import React, { useEffect, useRef, useState } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { Message as MessageType, ProductDomain } from '../types';
import { PRODUCT_DOMAINS, INTERNAL_FORMAT_IDS } from '../constants';

interface Props {
  messages: MessageType[];
  isLoading: boolean;
  onSend: (text: string, attachments: any[]) => void;
  onStop: () => void;
  activeFormatName: string;
  activeFormatId: string;
  activeToneId: string | null;
  activeDomainNames: string;
  activeProductDomainIds: string[];
  onToggleDomain: (id: string) => void;
  onOpenFormatModal: () => void;
  onToggleSidebar?: () => void;
  onOpenGuide?: () => void;
  onRetry: (id: number) => void;
  onTogglePin?: (id: number) => void;
  tokenUsage?: number;
  tokenLimit?: number;
  enableSearch?: boolean;
  onToggleSearch?: () => void;
}

const getDomainIcon = (id: string) => {
    switch(id) {
        case 'CORE_PAYMENTS': return (
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        );
        case 'SAAS_BILLING': return (
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        );
        case 'CONNECT_PLATFORMS': return (
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
        );
        case 'FINANCIAL_PRODUCTS': return (
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
        );
        case 'BUSINESS_IDENTITY': return (
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        );
        default: return (
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
        );
    }
};

const ChatPanel = ({ messages, isLoading, onSend, onStop, activeFormatName, activeFormatId, activeToneId, activeDomainNames, activeProductDomainIds, onToggleDomain, onOpenFormatModal, onToggleSidebar, onRetry, onTogglePin, tokenUsage, tokenLimit, enableSearch, onToggleSearch }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [domainSearch, setDomainSearch] = useState('');
  const isDomainSelected = activeProductDomainIds.length > 0;
  const isFormatSelected = !!activeFormatId;
  const isDisabled = !isDomainSelected || !isFormatSelected;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const filteredDomains = PRODUCT_DOMAINS.filter(d => {
      const term = domainSearch.toLowerCase();
      return !term || d.name.toLowerCase().includes(term) || d.description.toLowerCase().includes(term) || d.keywords.some(k => k.toLowerCase().includes(term));
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-black relative transition-colors duration-200">
      <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 md:px-8 justify-between bg-white/60 dark:bg-black/40 backdrop-blur-xl sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
            <button onClick={onToggleSidebar} className="md:hidden p-2 text-zinc-500 hover:text-brand-600 dark:hover:bg-zinc-800 rounded-xl transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg></button>
            <div className="flex flex-col">
                <h2 className={`font-black flex items-center gap-2 text-sm md:text-base tracking-tighter uppercase transition-colors ${!isDomainSelected ? 'text-zinc-400' : 'text-zinc-900 dark:text-white'}`}>
                    <span className={`w-2 h-2 rounded-full ${!isDomainSelected ? 'bg-zinc-300 dark:bg-zinc-700' : 'bg-brand-500 shadow-glow-brand'}`}></span>
                    {activeDomainNames.split(' + ')[0] || 'Awaiting Topic'}
                </h2>
            </div>
        </div>
        <div className="flex items-center gap-2">
             <button 
                onClick={onToggleSearch} 
                className={`p-2 rounded-xl border transition-all ${enableSearch ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400'}`}
                title="Toggle Google Search Grounding"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </button>

             <button onClick={onOpenFormatModal} disabled={!isDomainSelected} className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${!isDomainSelected ? 'bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 opacity-40 cursor-not-allowed' : 'glass border-white/10 dark:border-white/5 hover:border-brand-500/50 hover:shadow-glow-brand'}`}>
                <div className={`w-2 h-2 rounded-full ${isDisabled ? 'bg-amber-500 shadow-glow-amber' : 'bg-emerald-500 shadow-glow-emerald'}`}></div>
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">{activeFormatName}</span>
             </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800" ref={scrollRef}>
        <div className="max-w-4xl mx-auto w-full pb-8">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-12 md:mt-20 animate-materialize">
                    {!isDomainSelected ? (
                        <div className="w-full text-center">
                            <div className="relative inline-block mb-12">
                                <div className="absolute inset-0 bg-brand-500 blur-[80px] opacity-10 rounded-full"></div>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white mb-4 relative">Support Assistant</h1>
                                <p className="text-zinc-500 dark:text-zinc-500 font-medium tracking-wide">Select a knowledge vertical to begin assistance.</p>
                            </div>
                            
                            <div className="relative max-w-xl mx-auto mb-12 group">
                                <input type="text" className="w-full pl-12 pr-4 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white outline-none transition-all shadow-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500" placeholder="Search domains..." value={domainSearch} onChange={e => setDomainSearch(e.target.value)} />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-brand-500 transition-colors"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
                                {filteredDomains.map(domain => {
                                    const isSelected = activeProductDomainIds.includes(domain.id);
                                    return (
                                        <button key={domain.id} onClick={() => onToggleDomain(domain.id)} className={`p-6 rounded-3xl border transition-all duration-300 group relative overflow-hidden h-full flex flex-col ${isSelected ? 'bg-brand-500/10 border-brand-500 shadow-glow-brand' : 'bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:border-brand-500/50 hover:bg-white dark:hover:bg-zinc-900'}`}>
                                            <div className="w-10 h-10 mb-4 transform group-hover:scale-110 transition-transform duration-500 text-brand-500 dark:text-brand-400">
                                                {getDomainIcon(domain.id)}
                                            </div>
                                            <h3 className="font-black text-xs uppercase tracking-widest text-zinc-900 dark:text-white mb-2">{domain.name}</h3>
                                            <p className="text-[11px] text-zinc-500 dark:text-zinc-500 font-medium leading-relaxed opacity-80 flex-1">{domain.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center animate-materialize">
                            <div className="w-24 h-24 bg-gradient-to-tr from-brand-500 to-indigo-600 rounded-[2rem] shadow-glow-brand flex items-center justify-center text-white mb-8 mx-auto animate-float">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white mb-4">Vertical Synced</h1>
                            <p className="text-zinc-500 font-medium mb-12">Vertical synchronized for {activeDomainNames}. Describe the inquiry.</p>
                            {!isFormatSelected && (
                                <button onClick={onOpenFormatModal} className="px-12 py-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:-translate-y-1 transition-all active:scale-95">Select Output Format</button>
                            )}
                        </div>
                    )}
                </div>
            )}
            <div className="py-8 space-y-4">{messages.map((msg) => <div key={msg.id} className="animate-materialize"><Message message={msg} onRetry={onRetry} onTogglePin={onTogglePin} /></div>)}</div>
            {isLoading && <div className="px-6 py-2"><TypingIndicator /></div>}
        </div>
      </div>

      <div className="p-4 md:p-8 glass dark:bg-black/60 border-t border-zinc-200 dark:border-zinc-800 transition-all z-10">
        <div className="max-w-4xl mx-auto w-full relative">
            <MessageInput onSend={onSend} onStop={onStop} isLoading={isLoading} disabled={isDisabled} isInternal={INTERNAL_FORMAT_IDS.includes(activeFormatId)} tokenUsage={tokenUsage} tokenLimit={tokenLimit} />
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;