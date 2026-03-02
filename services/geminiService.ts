
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT, TONES, PRODUCT_DOMAINS, FORMATS, INTERNAL_FORMAT_IDS } from '../constants';
import { Message } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const SMALL_TALK_REGEX = /^(thanks?|thank you|got it|ok|okay|clear|understand|thx|appreciate it|cool|neat|no problem|awesome)[\s.!]?$/i;

const getErrorDetails = (error: any) => {
    let message = error.message || 'Unknown error';
    let code = error.code || error.status;
    let status = error.status;

    if (error.error) {
        if (error.error.message) message = error.error.message;
        if (error.error.code) code = error.error.code;
        if (error.error.status) status = error.error.status;
    }

    try {
        if (typeof message === 'string') {
            const jsonStart = message.indexOf('{');
            const jsonEnd = message.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd > jsonStart) {
                const jsonStr = message.substring(jsonStart, jsonEnd + 1);
                const parsed = JSON.parse(jsonStr);
                if (parsed.error) {
                    if (parsed.error.message) message = parsed.error.message;
                    if (parsed.error.code) code = parsed.error.code;
                    if (parsed.error.status) status = parsed.error.status;
                } else if (parsed.message) {
                    message = parsed.message;
                }
            }
        }
    } catch (e) {}

    return { message, code, status };
};

const isRateLimitError = (error: any) => {
    const { message, code, status } = getErrorDetails(error);
    return (
        code === 429 || 
        status === 429 || 
        status === 'RESOURCE_EXHAUSTED' ||
        (typeof message === 'string' && (
            message.includes('429') || 
            message.includes('Resource has been exhausted') || 
            message.includes('Quota exceeded')
        ))
    );
};

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = isRateLimitError(error);
    const { code, status } = getErrorDetails(error);
    const isServerError = code === 503 || status === 503;

    if (retries > 0 && (isRateLimit || isServerError)) {
      console.warn(`Gemini API transient error (${code || status}). Retrying in ${delay}ms... (Attempts left: ${retries})`);
      await sleep(delay);
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Optimization: Calculate history window based on model tier.
 */
const getTierAwareHistory = (messages: Message[], tier: 'lite' | 'standard' | 'pro'): string => {
    let windowSize = 3;
    if (tier === 'standard') windowSize = 6;
    if (tier === 'pro') windowSize = 10;
    
    return messages.slice(-windowSize).map(m => `${m.sender}: ${m.text}`).join('\n');
};

/**
 * Optimization: Small Talk Interceptor.
 */
const isSmallTalk = (text: string) => {
    return text.length < 20 && SMALL_TALK_REGEX.test(text.trim());
};

export async function* generateResponseStream(
  prompt: string,
  formatId: string,
  toneId: string,
  productDomainIds: string[],
  historyMessages: Message[],
  coreRules: string,
  signal: AbortSignal,
  apiKey: string,
  attachments: { data: string; mimeType: string }[] = [],
  isTrainingMode: boolean = false,
  userName: string = "Gee"
): AsyncGenerator<GenerateContentResponse & { isOptimized?: boolean }, void, unknown> {
  const effectiveKey = apiKey || process.env.API_KEY;
  if (!effectiveKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey: effectiveKey });
  
  const selectedFormat = FORMATS.find(f => f.id === formatId) || FORMATS[0];
  let selectedTone = TONES.find(t => t.id === toneId) || TONES[0];
  let currentTier = selectedFormat.modelTier || 'standard';

  const isOptimizedForSmallTalk = isSmallTalk(prompt);
  if (isOptimizedForSmallTalk) {
      currentTier = 'lite';
  }

  if (INTERNAL_FORMAT_IDS.includes(selectedFormat.id)) {
     selectedTone = {
        id: 'INTERNAL_OVERRIDE',
        name: 'Internal/Neutral',
        description: 'Internal notes override.',
        promptInstruction: 'STRICTLY INTERNAL. Objective, factual, concise fragments. No conversational filler.'
     };
  }

  const selectedDomains = PRODUCT_DOMAINS.filter(p => productDomainIds.includes(p.id));
  const combinedContexts = selectedDomains.map(d => `[${d.name}]: ${d.contextInstruction}`).join('\n');

  let systemInstruction = `
${SYSTEM_PROMPT.slice(0, 1000)}... (Core Rules Appended Below)

CONFIG:
- Domains: ${selectedDomains.map(d => d.name).join(' + ')}
- Instructions: ${combinedContexts}
- Format: ${selectedFormat.name}
- Tone: ${selectedTone.name} (${selectedTone.promptInstruction})

TEMPLATE:
${selectedFormat.instruction || 'Standard format.'}

IMPORTANT: Sign off as "${userName}".

OVERRIDES:
${coreRules}
`;

  if (isTrainingMode) {
      systemInstruction += `\n**MANDATORY TRAINING MODE ENABLED:** Append a "Training Insight" section explaining Domain (${selectedDomains.map(d=>d.name).join(',')}) and Tone (${selectedTone.name}) choices.`;
  }

  const truncatedHistory = getTierAwareHistory(historyMessages, currentTier);
  const parts: any[] = [{ text: `History:\n${truncatedHistory}\n\nRequest: ${prompt}` }];

  if (attachments && attachments.length > 0) {
    attachments.forEach(att => {
        parts.push({ inlineData: { mimeType: att.mimeType || 'image/jpeg', data: att.data.split(',')[1] || att.data } });
    });
  }

  let primaryModel = 'gemini-3-flash-preview';
  if (currentTier === 'pro') primaryModel = 'gemini-3-pro-preview';
  else if (currentTier === 'lite') primaryModel = 'gemini-flash-lite-latest';
  
  const fallbackModel = 'gemini-3-flash-preview';

  const makeRequest = async (modelName: string) => {
      const tools = (modelName.includes('flash') || modelName.includes('pro')) && !modelName.includes('lite') 
        ? [{ googleSearch: {} }] 
        : undefined;

      return await ai.models.generateContentStream({
        model: modelName,
        contents: [{ role: 'user', parts }],
        config: { 
            systemInstruction, 
            temperature: 0.2,
            tools
        },
      });
  };

  let stream: any = null;
  try {
      try {
          stream = await retryWithBackoff(() => makeRequest(primaryModel), 1);
      } catch (primaryError: any) {
           if (primaryModel !== fallbackModel && isRateLimitError(primaryError)) {
               stream = await retryWithBackoff(() => makeRequest(fallbackModel), 3);
           } else throw primaryError;
      }
  } catch (connectionError: any) {
      if (isRateLimitError(connectionError)) throw new Error("High traffic. Try again later.");
      throw connectionError;
  }

  if (stream) {
      for await (const chunk of stream) {
          const res = chunk as any;
          res.isOptimized = isOptimizedForSmallTalk || historyMessages.length > (currentTier === 'lite' ? 3 : currentTier === 'standard' ? 6 : 10);
          yield res;
      }
  }
}

export const generateUpdatedRules = async (instruction: string, currentRules: string, apiKey: string) => {
    const effectiveKey = apiKey || process.env.API_KEY;
    if (!effectiveKey) throw new Error("API Key required");
    const ai = new GoogleGenAI({ apiKey: effectiveKey });
    const prompt = `Current Rules: "${currentRules}"\nMod Instruction: "${instruction}"\nTask: Rewrite rules. Return ONLY text.`;
    try {
        const response = await retryWithBackoff(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        })) as GenerateContentResponse;
        return { updatedRules: response.text || currentRules, confirmationMessage: "Rules updated." };
    } catch (error: any) {
        throw new Error(`Failed to update rules: ${getErrorDetails(error).message}`);
    }
}
