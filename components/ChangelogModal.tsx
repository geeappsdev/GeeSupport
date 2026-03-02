import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface ChangeItem {
    type: 'new' | 'update' | 'fix';
    text: string;
}

interface Version {
    version: string;
    date: string;
    description: string;
    changes: ChangeItem[];
}

const VERSIONS: Version[] = [
    {
        version: "2.1.0",
        date: "Latest Release",
        description: "Major UX overhaul focused on context-aware workflows and training capabilities.",
        changes: [
            { type: 'new', text: "Visual Domain Grid: New card-based selector for easier topic discovery." },
            { type: 'new', text: "Training Mode: Toggle AI insights to learn 'why' a response was generated." },
            { type: 'new', text: "Traffic Light Workflow: Sidebar indicators (Red/Amber/Green) guide you through setup." },
            { type: 'update', text: "Enhanced Dark Mode: Improved contrast and color palettes for night shifts." },
            { type: 'update', text: "Privacy Controls: New promotional modal and improved data transparency." }
        ]
    },
    {
        version: "2.0.0",
        date: "Previous Major",
        description: "Foundation of the AI-powered support assistant.",
        changes: [
            { type: 'new', text: "Gemini 2.5 Integration: High-speed, context-aware responses." },
            { type: 'new', text: "Format Selector: Choose between Drafts, Snippets, or Internal Notes." },
            { type: 'new', text: "Product Knowledge Base: Integrated Stripe documentation contexts." },
            { type: 'fix', text: "Streaming stability improvements." }
        ]
    }
];

const ChangelogModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  const getTypeStyle = (type: string) => {
      switch(type) {
          case 'new': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
          case 'update': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
          case 'fix': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
          default: return 'bg-zinc-100 text-zinc-700';
      }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[85vh] flex flex-col transform scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-t-2xl sticky top-0 z-10">
            <div>
                <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <span className="text-2xl">✨</span> What's New
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Latest features and improvements</p>
            </div>
            <button 
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700">
            <div className="relative border-l-2 border-zinc-100 dark:border-zinc-800 ml-3 space-y-10 pb-4">
                {VERSIONS.map((v, idx) => (
                    <div key={idx} className="relative pl-8">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm ${idx === 0 ? 'bg-indigo-500 ring-4 ring-indigo-500/20' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
                        
                        <div className="flex items-baseline gap-3 mb-2">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">v{v.version}</h3>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                {v.date}
                            </span>
                        </div>
                        
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 italic leading-relaxed">
                            {v.description}
                        </p>

                        <ul className="space-y-3">
                            {v.changes.map((change, cIdx) => (
                                <li key={cIdx} className="flex items-start gap-3 text-sm">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border shrink-0 mt-0.5 ${getTypeStyle(change.type)}`}>
                                        {change.type}
                                    </span>
                                    <span className="text-zinc-700 dark:text-zinc-300 leading-snug">
                                        {change.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-b-2xl text-center">
             <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Have feedback? Mention it in your internal chat notes.
             </p>
        </div>

      </div>
    </div>
  );
};

export default ChangelogModal;