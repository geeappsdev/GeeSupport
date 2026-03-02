
import React, { useState, useEffect, useReducer } from 'react';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import ProfileSettingsModal from './components/ProfileSettingsModal';
import CoreRulesModal from './components/CoreRulesModal';
import WalkthroughModal from './components/WalkthroughModal';
import ApiKeyModal from './components/ApiKeyModal';
import ConfirmationModal from './components/ConfirmationModal';
import DataPrivacyModal from './components/DataPrivacyModal';
import FormatSelectorModal from './components/FormatSelectorModal';
import WorkflowGuideModal from './components/WorkflowGuideModal';
import PrivacyPromoModal from './components/PrivacyPromoModal';
import ChangelogModal from './components/ChangelogModal';
import CostImpactModal from './components/CostImpactModal';
import useLocalStorage from './hooks/useLocalStorage';
import { generateResponseStream } from './services/geminiService';
import { FORMATS, PRODUCT_DOMAINS, SYSTEM_PROMPT } from './constants';
import { Message, UserProfile } from './types';

type ChatAction = 
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'UPDATE_MESSAGE'; id: number; text: string; isError?: boolean; isOptimized?: boolean }
  | { type: 'TOGGLE_PIN'; id: number }
  | { type: 'CLEAR_MESSAGES' };

const chatReducer = (state: Message[], action: ChatAction): Message[] => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return [...state, action.message];
    case 'UPDATE_MESSAGE':
      return state.map(m => m.id === action.id ? { ...m, text: action.text, isError: action.isError ?? m.isError, isOptimized: action.isOptimized ?? m.isOptimized } : m);
    case 'TOGGLE_PIN':
      return state.map(m => m.id === action.id ? { ...m, isPinned: !m.isPinned } : m);
    case 'CLEAR_MESSAGES':
      return [];
    default:
      return state;
  }
};

const MAX_HISTORY_CHARS = 32000;

const App = () => {
  const [messages, dispatch] = useReducer(chatReducer, []);
  const [activeFormat, setActiveFormat] = useState<string>('');
  const [activeTone, setActiveTone] = useState<string | null>(null);
  const [activeProductDomains, setActiveProductDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(true);
  const [coreRules, setCoreRules] = useLocalStorage('core_rules', SYSTEM_PROMPT);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isPrivacyPromoOpen, setIsPrivacyPromoOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);

  const [hasSeenWalkthrough, setHasSeenWalkthrough] = useLocalStorage('has_seen_walkthrough_v1', false);
  const [privacyAdStats, setPrivacyAdStats] = useLocalStorage('privacy_ad_stats', { date: '', count: 0, lastShown: 0 });

  const [usageStats, setUsageStats] = useLocalStorage('usage_stats_v2', { lite: 0, standard: 0, pro: 0, totalRequests: 0, tokensSaved: 0 });
  const [apiKey, setApiKey] = useLocalStorage<string | null>('gemini_api_key', null);
  
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('user_profile', {
    name: 'Agent', avatar: '', theme: 'indigo', mode: 'light', layout: 'left', enableCitations: true
  });

  const abortControllerRef = React.useRef<AbortController | null>(null);
  const currentTokenUsage = messages.reduce((acc, m) => acc + (m.text.length / 4), 0);

  useEffect(() => {
    if (!hasSeenWalkthrough) setIsWalkthroughOpen(true);
  }, [hasSeenWalkthrough]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!isWalkthroughOpen && hasSeenWalkthrough) {
        const today = new Date().toDateString();
        let stats = { ...privacyAdStats };
        if (stats.date !== today) stats = { date: today, count: 0, lastShown: 0 };
        const COOLDOWN = 4 * 60 * 60 * 1000; 
        if (stats.count < 2 && (stats.lastShown === 0 || Date.now() - stats.lastShown > COOLDOWN)) {
             timer = setTimeout(() => {
                 setIsPrivacyPromoOpen(true);
                 setPrivacyAdStats({ date: today, count: stats.count + 1, lastShown: Date.now() });
             }, 3000);
        }
    }
    return () => timer && clearTimeout(timer);
  }, [isWalkthroughOpen, hasSeenWalkthrough, privacyAdStats, setPrivacyAdStats]); 

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (activeProductDomains.length > 0) setIsFormatModalOpen(true);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProductDomains]);

  useEffect(() => {
    const applyTheme = () => {
        const isDark = userProfile.mode === 'dark' || (userProfile.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', isDark);
    };
    applyTheme();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [userProfile.mode]);

  const processGeneration = async (prompt: string, attachments: any[], aiMsgId: number, historyMessages: Message[]) => {
      setIsLoading(true);
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const formatObj = FORMATS.find(f => f.id === activeFormat);
        const currentTier = formatObj?.modelTier || 'standard';
        const signatureName = userProfile.name === 'Agent' ? 'Gee' : userProfile.name;

        // Est tokens before optimization: Mega-Prompt (~2k) + full history (~tokens)
        const estTokensBefore = 2000 + (historyMessages.reduce((a, b) => a + b.text.length, 0) / 4);

        const stream = await generateResponseStream(
            prompt, activeFormat || 'CL', activeTone || '', activeProductDomains,
            historyMessages, coreRules, abortController.signal, apiKey || '', attachments,
            isTrainingMode, signatureName
        );

        let fullText = '';
        let isOptimized = false;
        for await (const chunk of stream) {
            if (chunk.text) {
                fullText += chunk.text;
                isOptimized = chunk.isOptimized || isOptimized;
                dispatch({ type: 'UPDATE_MESSAGE', id: aiMsgId, text: fullText, isOptimized });
            }
        }

        // Est tokens after optimization: Lean prompt (~0.5k) + truncated history
        const estTokensAfter = 500 + (currentTokenUsage / 2); 
        const saved = Math.max(0, estTokensBefore - estTokensAfter);

        setUsageStats(prev => ({ 
            ...prev, 
            [currentTier]: (prev as any)[currentTier] + 1, 
            totalRequests: prev.totalRequests + 1,
            tokensSaved: prev.tokensSaved + Math.round(saved)
        }));

      } catch (e: any) {
        if (e.name !== 'AbortError') {
             dispatch({ type: 'UPDATE_MESSAGE', id: aiMsgId, text: `Error: ${e.message}`, isError: true });
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
  };

  const handleSend = async (text: string, attachments: any[]) => {
    const userMsg: Message = { id: Date.now(), sender: 'user', text, name: userProfile.name, avatar: userProfile.avatar, attachments };
    const aiMsgId = Date.now() + 1;
    const aiMsg: Message = { id: aiMsgId, sender: 'ai', name: 'Gee', text: '' };

    dispatch({ type: 'ADD_MESSAGE', message: userMsg });
    dispatch({ type: 'ADD_MESSAGE', message: aiMsg });
    
    await processGeneration(text, attachments, aiMsgId, [...messages, userMsg]);
  };

  const handleStop = () => {
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          setIsLoading(false);
      }
  };

  const handleRetry = async (aiMessageId: number) => {
      const msgIndex = messages.findIndex(m => m.id === aiMessageId);
      if (msgIndex === -1) return;
      const previousMsg = messages[msgIndex - 1];
      if (!previousMsg || previousMsg.sender !== 'user') return; 

      dispatch({ type: 'UPDATE_MESSAGE', id: aiMessageId, text: '', isError: false, isOptimized: false });
      await processGeneration(previousMsg.text, previousMsg.attachments || [], aiMessageId, messages.slice(0, msgIndex - 1));
  };

  const togglePin = (id: number) => dispatch({ type: 'TOGGLE_PIN', id });

  const handleClearSession = () => {
      dispatch({ type: 'CLEAR_MESSAGES' });
      setActiveFormat('');
      if (abortControllerRef.current) abortControllerRef.current.abort();
      setIsLoading(false);
  };

  const currentFormatName = FORMATS.find(f => f.id === activeFormat)?.name || 'Select Format';
  const currentDomainNames = activeProductDomains.length > 0 
      ? activeProductDomains.map(id => PRODUCT_DOMAINS.find(p => p.id === id)?.name).filter(Boolean).join(' + ')
      : 'Select Domain';

  return (
    <div className={`flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-zinc-950 font-sans text-[#1d1c1d] dark:text-zinc-200 relative ${userProfile.layout === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
        <Sidebar 
            activeFormat={activeFormat} activeTone={activeTone} activeProductDomains={activeProductDomains}
            onSelectFormat={setActiveFormat} onSelectTone={setActiveTone} onToggleProductDomain={(id) => setActiveProductDomains(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])}
            isTrainingMode={isTrainingMode} onToggleTrainingMode={() => setIsTrainingMode(!isTrainingMode)}
            onOpenSettings={() => setIsSettingsOpen(true)} onOpenRules={() => setIsRulesOpen(true)} onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
            onOpenWalkthrough={() => setIsWalkthroughOpen(true)} onOpenGuide={() => setIsGuideOpen(true)} onOpenChangelog={() => setIsChangelogOpen(true)}
            onOpenCost={() => setIsCostModalOpen(true)}
            onNewChat={() => setIsNewSessionModalOpen(true)} position={userProfile.layout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 min-w-0 h-full relative z-0">
            <ChatPanel 
                messages={messages} isLoading={isLoading} onSend={handleSend} onStop={handleStop}
                activeFormatName={currentFormatName} activeFormatId={activeFormat} activeToneId={activeTone}
                activeDomainNames={currentDomainNames} activeProductDomainIds={activeProductDomains}
                onToggleDomain={(id) => setActiveProductDomains(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])}
                onOpenFormatModal={() => setIsFormatModalOpen(true)} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                onRetry={handleRetry} onTogglePin={togglePin} tokenUsage={currentTokenUsage} tokenLimit={MAX_HISTORY_CHARS / 4}
            />
        </main>
        <WalkthroughModal isOpen={isWalkthroughOpen} onComplete={() => { setHasSeenWalkthrough(true); setIsWalkthroughOpen(false); }} />
        <WorkflowGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        <PrivacyPromoModal isOpen={isPrivacyPromoOpen} onClose={() => setIsPrivacyPromoOpen(false)} />
        <ChangelogModal isOpen={isChangelogOpen} onClose={() => setIsChangelogOpen(false)} />
        <CostImpactModal isOpen={isCostModalOpen} onClose={() => setIsCostModalOpen(false)} stats={usageStats} />
        <FormatSelectorModal isOpen={isFormatModalOpen} onClose={() => setIsFormatModalOpen(false)} activeFormatId={activeFormat} activeToneId={activeTone} onSelectFormat={setActiveFormat} onSelectTone={setActiveTone} isDomainSelected={activeProductDomains.length > 0} />
        <ProfileSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} profile={userProfile} onSave={setUserProfile} />
        <CoreRulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} rules={coreRules} onUpdate={setCoreRules} apiKey={apiKey || ''} />
        <ConfirmationModal isOpen={isNewSessionModalOpen} onClose={() => setIsNewSessionModalOpen(false)} onConfirm={handleClearSession} title="Delete Session Data?" message="This will permanently delete the current conversation history from memory." confirmText="Delete & Start New" isDestructive={true} />
        <DataPrivacyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
        {!apiKey && <ApiKeyModal onSubmit={setApiKey} />}
    </div>
  );
};

export default App;
