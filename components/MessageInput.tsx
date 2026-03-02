
import React, { useRef, useState, useEffect } from 'react';

interface Props {
  onSend: (text: string, attachments: any[]) => void;
  onStop: () => void;
  isLoading: boolean;
  disabled?: boolean;
  isInternal?: boolean;
  tokenUsage?: number; // Approximate token count
  tokenLimit?: number;
}

const CUSTOMER_ACTIONS = [
    { label: "Draft Reply", prompt: "Draft a response to this issue.", icon: "✍️" },
    { label: "Summarize Case", prompt: "Summarize the key points of this case.", icon: "📋" },
    { label: "Analyze Logs", prompt: "Analyze these logs and spot the error.", icon: "🔎" },
    { label: "Stripe Policy", prompt: "What is the Stripe policy regarding this issue?", icon: "⚖️" },
];

const INTERNAL_ACTIONS = [
    { label: "Internal Notes", prompt: "Draft internal notes for this case.", icon: "🗒️" },
    { label: "Risk Scan", prompt: "Identify potential risks or compliance issues in this conversation.", icon: "⚠️" },
    { label: "Case Timeline", prompt: "Generate a bulleted timeline of actions taken so far.", icon: "⏳" },
    { label: "Account Audit", prompt: "Perform an audit of this account status based on the logs.", icon: "🔎" },
];

const MessageInput = ({ onSend, onStop, isLoading, disabled, isInternal = false, tokenUsage = 0, tokenLimit = 32000 }: Props) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [logDetected, setLogDetected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const actions = isInternal ? INTERNAL_ACTIONS : CUSTOMER_ACTIONS;
  
  // Smart Paste Detection
  useEffect(() => {
      const stripeObjectRegex = /(acct_|pi_|evt_|seti_|tok_|ch_|cus_|sub_|re_)[a-zA-Z0-9]+/;
      const isLog = stripeObjectRegex.test(text) || (text.includes('{') && text.includes('}'));
      setLogDetected(isLog);
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!text.trim() && attachments.length === 0) || isLoading) return;
    onSend(text, attachments);
    setText('');
    setAttachments([]);
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleQuickAction = (prompt: string) => {
      setText(prompt);
      setTimeout(() => {
          if (textareaRef.current) {
              textareaRef.current.focus();
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
          }
      }, 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            setAttachments(prev => [...prev, {
                id: Date.now(),
                name: file.name,
                type: file.type.startsWith('image/') ? 'image' : 'file',
                data: ev.target?.result as string,
                mimeType: file.type
            }]);
        };
        reader.readAsDataURL(file);
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const usagePercent = Math.min((tokenUsage / tokenLimit) * 100, 100);
  const isUsageHigh = usagePercent > 80;

  return (
    <div className="relative">
      
      {!disabled && !isLoading && !text.trim() && attachments.length === 0 && (
          <div className="flex gap-2.5 mb-4 overflow-x-auto pb-2 scrollbar-hide px-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {actions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all active:scale-95 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-brand-500 hover:text-brand-700 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/10 shadow-sm"
                  >
                      <span className="opacity-80">{action.icon}</span>
                      {action.label}
                  </button>
              ))}
          </div>
      )}

      {logDetected && !isLoading && (
          <div className="flex items-center gap-2 mb-2 px-1 animate-in fade-in duration-300">
              <div className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-amber-200 dark:border-amber-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Stripe Log Detected
              </div>
              <span className="text-[10px] text-zinc-400 italic">Try "Summarize Case" or "Analyze Logs"</span>
          </div>
      )}

      <div className={`border rounded-2xl shadow-sm transition-all duration-300 bg-white dark:bg-zinc-900 overflow-hidden ${disabled ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50' : 'border-zinc-300 dark:border-zinc-700 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 hover:border-brand-400'}`}>
        
        {attachments.length > 0 && (
            <div className="flex gap-3 p-3 bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto">
                {attachments.map((att, idx) => (
                    <div key={idx} className="relative group/att shrink-0">
                        <img src={att.data} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm" />
                        <button 
                            onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute -top-2 -right-2 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-red-500 rounded-full p-1 shadow border border-zinc-200 dark:border-zinc-700 opacity-0 group-hover/att:opacity-100 transition-opacity"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        )}

        <div className="relative flex items-end">
            <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={disabled ? "Please wait..." : "Paste context, logs, or describe the issue..."}
                disabled={disabled || isLoading}
                className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-80 min-h-[60px] py-4 px-4 text-[15px] text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 leading-relaxed"
                rows={1}
                style={{ height: 'auto' }}
                onInput={(e) => {
                    e.currentTarget.style.height = 'auto';
                    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                }}
            />
            
            <div className="flex items-center gap-1.5 pr-3 pb-3">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    title="Attach file"
                    disabled={disabled || isLoading}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple accept="image/*" />

                {isLoading ? (
                    <button 
                        onClick={onStop}
                        className="p-2 px-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all flex items-center gap-2 font-bold text-sm border border-red-100 dark:border-red-900/40"
                    >
                        <div className="w-2.5 h-2.5 bg-current rounded-sm"></div>
                        <span className="hidden sm:inline">Stop</span>
                    </button>
                ) : (
                    <button 
                        onClick={handleSend}
                        disabled={disabled || (!text.trim() && attachments.length === 0)}
                        className={`p-2 w-10 h-10 rounded-xl transition-all flex items-center justify-center shadow-sm active:scale-90 ${
                            (text.trim() || attachments.length > 0) && !disabled
                            ? 'bg-brand-600 text-white hover:bg-brand-700'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                        }`}
                        title="Send Message"
                    >
                        <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                )}
            </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1 w-24 sm:w-32">
                  <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-wider">
                      <span className={isUsageHigh ? 'text-amber-600' : 'text-zinc-400'}>Session Weight</span>
                      <span className={isUsageHigh ? 'text-amber-600' : 'text-zinc-500'}>{Math.round(usagePercent)}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${isUsageHigh ? 'bg-amber-500' : 'bg-indigo-500'}`}
                        style={{ width: `${usagePercent}%` }}
                      ></div>
                  </div>
              </div>
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-600 uppercase font-bold tracking-widest hidden sm:inline">
              Return to send • Shift + Return for new line
          </span>
      </div>
    </div>
  );
};

export default MessageInput;
