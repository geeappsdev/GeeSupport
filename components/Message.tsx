
import React, { useState, useMemo } from 'react';
import { Message as MessageType } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { VERIFIED_DOC_ROOTS } from '../constants';

// Fixed TypeScript error: Use React.FC to allow 'key' prop during iteration in map()
const VerifiedCitation: React.FC<{ url: string; label: string }> = ({ url, label }) => {
    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg group transition-all hover:border-emerald-500 shadow-sm"
        >
            <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-800 rounded flex items-center justify-center text-[10px] text-emerald-700 dark:text-emerald-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Verified Reference</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-300 truncate font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{label || url}</span>
            </div>
        </a>
    );
};

const ConfidenceMeter = ({ score, reasoning }: { score: number, reasoning: string }) => {
    const isHigh = score >= 85;
    const isMed = score >= 60 && score < 85;
    
    let colorClass = 'text-rose-500 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800';
    let barColor = 'bg-rose-500';
    let icon = '⚠️';

    if (isHigh) {
        colorClass = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
        barColor = 'bg-emerald-500';
        icon = '🛡️';
    } else if (isMed) {
        colorClass = 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
        barColor = 'bg-amber-500';
        icon = '🔍';
    }

    return (
        <div className={`mt-4 p-3 rounded-xl border flex flex-col gap-2 transition-all ${colorClass}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm">{icon}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider">Audit Results</span>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase opacity-60">Confidence</span>
                        <span className="text-xs font-bold">{score}%</span>
                    </div>
                </div>
            </div>
            <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 ease-out ${barColor}`} 
                    style={{ width: `${score}%` }}
                ></div>
            </div>
            {reasoning && (
                <p className="text-[10px] opacity-80 leading-tight italic mt-1">
                    "{reasoning}"
                </p>
            )}
        </div>
    );
};

const ThinkingBlock = ({ content }: { content: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-700"
      >
        <div className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-zinc-300 dark:bg-zinc-600'}`}></div>
        <span>Thinking</span>
        <svg className={`w-3 h-3 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <div className="mt-1.5 p-3 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono bg-zinc-50/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg whitespace-pre-wrap leading-tight animate-in fade-in duration-200 shadow-sm">
          {content.trim()}
        </div>
      )}
    </div>
  );
};

interface Props {
    message: MessageType;
    onRetry?: (id: number) => void;
    onTogglePin?: (id: number) => void;
}

const Message = ({ message, onRetry, onTogglePin }: Props) => {
  const isAI = message.sender === 'ai';
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const parsedContent = useMemo(() => {
    let content = message.text;
    let thinking = null;
    let metadata = { score: 0, accuracy: 0, toneAccuracy: 0, reasoning: '' };

    const tStart = '<thinking>';
    const tEnd = '</thinking>';
    const tIdx = content.indexOf(tStart);
    if (tIdx !== -1) {
        const eIdx = content.indexOf(tEnd, tIdx);
        if (eIdx !== -1) {
            thinking = content.substring(tIdx + tStart.length, eIdx);
            content = content.substring(0, tIdx) + content.substring(eIdx + tEnd.length);
        } else {
            thinking = content.substring(tIdx + tStart.length);
            content = content.substring(0, tIdx);
        }
    }

    const mStart = '<metadata>';
    const mEnd = '</metadata>';
    const mIdx = content.indexOf(mStart);
    if (mIdx !== -1) {
        const eIdx = content.indexOf(mEnd, mIdx);
        if (eIdx !== -1) {
            const rawMeta = content.substring(mIdx + mStart.length, eIdx);
            const scoreMatch = rawMeta.match(/confidence_score:\s*(\d+)/);
            const accMatch = rawMeta.match(/grounding_accuracy:\s*(\d+)/);
            const reasonMatch = rawMeta.match(/reasoning:\s*(.+)/);
            metadata = {
                score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
                accuracy: accMatch ? parseInt(accMatch[1]) : 0,
                toneAccuracy: 0,
                reasoning: reasonMatch ? reasonMatch[1].trim() : ''
            };
            content = content.substring(0, mIdx) + content.substring(eIdx + mEnd.length);
        } else {
            content = content.substring(0, mIdx);
        }
    }

    const citations: { url: string; label: string }[] = [];
    
    // Manual Link Extraction (Fallback/Standard)
    const linkRegex = /\[([^\]]+)\]\((https:\/\/docs\.stripe\.com\/[^\)]+)\)/g;
    let match;
    const allRoots = Object.values(VERIFIED_DOC_ROOTS).flat();
    while ((match = linkRegex.exec(content)) !== null) {
        const url = match[2];
        const label = match[1];
        if (allRoots.some(root => url.startsWith(root)) && !citations.some(c => c.url === url)) {
            citations.push({ url, label });
        }
    }

    return { thinking, metadata, citations, content: content.trim() };
  }, [message.text]);

  const handleCopy = (mode: 'rich' | 'plain' = 'rich') => {
    let cleanText = parsedContent.content;
    if (mode === 'plain') {
        cleanText = cleanText
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/#+\s+(.+)/g, '$1')
            .trim();
    }
    navigator.clipboard.writeText(cleanText).then(() => {
        if (mode === 'rich') {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } else {
            setExporting(true);
            setTimeout(() => setExporting(false), 2000);
        }
    });
  };

  if (message.isError) {
      return (
        <div className="flex gap-4 py-4 px-4 bg-red-50/50 dark:bg-red-900/10 border-l-4 border-red-500 my-2 rounded-r-lg animate-in slide-in-from-left-2 duration-300">
            <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[15px] text-red-700 dark:text-red-400">Generation Failed</span>
                </div>
                <p className="text-red-600 dark:text-red-300 text-[14px] mb-3">{message.text}</p>
                {onRetry && (
                    <button onClick={() => onRetry(message.id)} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-sm font-semibold transition-all shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Retry Generation
                    </button>
                )}
            </div>
        </div>
      );
  }

  return (
    <div className={`flex gap-4 py-4 px-4 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-all group rounded-lg animate-in slide-in-from-bottom-4 fade-in duration-500 relative ${message.isPinned ? 'ring-2 ring-indigo-500/20 bg-indigo-50/10 dark:bg-indigo-900/5' : ''}`}>
      
      {message.isPinned && (
          <div className="absolute top-0 right-12 translate-y-[-50%] bg-indigo-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-lg z-10 flex items-center gap-1">
              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
              Pinned Version
          </div>
      )}

      <div className="flex-shrink-0 mt-0.5">
        {message.avatar ? (
            <img src={message.avatar} alt={message.name} className="w-10 h-10 rounded-md shadow-sm object-cover" />
        ) : (
            <div className={`w-10 h-10 rounded-md flex items-center justify-center text-white font-bold shadow-sm ${isAI ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' : 'bg-gradient-to-br from-zinc-600 to-zinc-800'}`}>
                {isAI ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                ) : (
                    <span className="text-sm">{message.name?.[0]?.toUpperCase() || 'U'}</span>
                )}
            </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-[15px] text-zinc-900 dark:text-zinc-200">{message.name || (isAI ? 'Gee' : 'Agent')}</span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-500">{new Date(message.id).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            {message.isOptimized && (
                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 animate-in fade-in zoom-in-95 duration-500" title="Cost-optimized with tier-aware pruning">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Optimized
                </span>
            )}
        </div>
        
        <div className="text-[15px] text-zinc-800 dark:text-zinc-300 leading-relaxed relative">
             {isAI && (
                <div className="absolute -right-2 -top-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10 duration-200">
                    {onTogglePin && (
                        <button onClick={() => onTogglePin(message.id)} className={`p-1.5 rounded-md shadow-sm border transition-all ${message.isPinned ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 border-zinc-200 dark:border-zinc-700'}`} title={message.isPinned ? "Unpin message" : "Pin version"}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V5z" /></svg>
                        </button>
                    )}
                    <button onClick={() => handleCopy('plain')} className="bg-white dark:bg-zinc-800 p-1.5 text-zinc-500 hover:text-emerald-600 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-sm transition-all" title="Copy Plain Text for CRM">
                        {exporting ? <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    </button>
                    <button onClick={() => handleCopy('rich')} className="bg-white dark:bg-zinc-800 p-1.5 text-zinc-500 hover:text-indigo-600 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-sm transition-all" title="Copy Markdown">
                        {copied ? <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2-2h-8a2 2 0 002 2v8a2 2 0 002 2z" /></svg>}
                    </button>
                </div>
            )}
            
            {parsedContent.thinking && <ThinkingBlock content={parsedContent.thinking} />}

            <div className="markdown-body">
                <ReactMarkdown
                    components={{
                        code({node, inline, className, children, ...props}: any) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <div className="my-3 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                    <div className="bg-zinc-50 dark:bg-zinc-800 px-3 py-1 text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700 uppercase">{match[1]}</div>
                                    <SyntaxHighlighter {...props} style={tomorrow} language={match[1]} PreTag="div" customStyle={{ margin: 0, fontSize: '13px', padding: '1rem' }}>
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </div>
                            ) : (
                                <code {...props} className="bg-zinc-100 dark:bg-zinc-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-[13px] font-mono border border-zinc-200/50 dark:border-zinc-700/50">{children}</code>
                            )
                        },
                        a: ({href, children}) => {
                            const allRoots = Object.values(VERIFIED_DOC_ROOTS).flat();
                            const isVerified = allRoots.some(root => href?.startsWith(root));
                            return (
                                <a href={href} className={`inline-flex items-baseline gap-1 font-medium hover:underline underline-offset-2 transition-all rounded px-0.5 ${isVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`} target="_blank" rel="noopener noreferrer">
                                    <span>{children}</span>
                                    <svg className="w-3 h-3 self-center opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            );
                        }
                    }}
                >
                    {parsedContent.content}
                </ReactMarkdown>
            </div>

            {parsedContent.citations.length > 0 && (
                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">Verified Documentation References</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {parsedContent.citations.map((citation, i) => <VerifiedCitation key={i} url={citation.url} label={citation.label} />)}
                    </div>
                </div>
            )}

            {isAI && parsedContent.metadata && parsedContent.metadata.score > 0 && <ConfidenceMeter score={parsedContent.metadata.score} reasoning={parsedContent.metadata.reasoning} />}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Message);
