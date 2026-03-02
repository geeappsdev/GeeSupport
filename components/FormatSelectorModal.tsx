
import React, { useState, useEffect } from 'react';
import { FORMATS, TONES, INTERNAL_FORMAT_IDS } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeFormatId: string;
  activeToneId: string | null;
  onSelectFormat: (id: string) => void;
  onSelectTone: (id: string) => void;
  isDomainSelected?: boolean;
}

const FormatSelectorModal = ({ isOpen, onClose, activeFormatId, activeToneId, onSelectFormat, onSelectTone, isDomainSelected = true }: Props) => {
  const [step, setStep] = useState<'format' | 'tone'>('format');
  const [stagedFormat, setStagedFormat] = useState<string | null>(null);

  // Reset state on open
  useEffect(() => {
      if (isOpen) {
          setStep('format');
          setStagedFormat(null);
      }
  }, [isOpen]);

  if (!isOpen) return null;

  // Guard Clause for Domain Selection
  if (!isDomainSelected) {
      return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-zinc-900 w-full max-sm rounded-2xl p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center transform scale-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h2 className="text-xl font-bold dark:text-white mb-2">Select Domain First</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
                    You must select a Product Domain (e.g., Payments, Connect) before choosing an output format.
                </p>
                <button 
                    onClick={onClose}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                    Understood
                </button>
            </div>
        </div>
      );
  }

  const handleFormatClick = (formatId: string) => {
      const isInternal = INTERNAL_FORMAT_IDS.includes(formatId);
      
      if (isInternal) {
          onSelectFormat(formatId);
          onClose();
      } else {
          // It's a customer format (draft or snippet). Check if tone is selected.
          if (activeToneId) {
              // Tone already selected, just switch
              onSelectFormat(formatId);
              onClose();
          } else {
              // Need a tone. Switch to step 2.
              setStagedFormat(formatId);
              setStep('tone');
          }
      }
  };

  const handleToneClick = (toneId: string) => {
      if (stagedFormat) {
          onSelectFormat(stagedFormat);
      }
      onSelectTone(toneId);
      onClose();
  };

  const renderFormatCard = (fmt: typeof FORMATS[0]) => {
      const isActive = activeFormatId === fmt.id;
      
      let badgeColor = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      if(fmt.category === 'internal') badgeColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      if(fmt.category === 'snippet') badgeColor = 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';

      const label = fmt.category === 'internal' ? 'Internal' : fmt.category === 'snippet' ? 'Snippet' : 'Draft';

      return (
          <button
            key={fmt.id}
            onClick={() => handleFormatClick(fmt.id)}
            className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 ease-out group h-full hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden ${
                isActive
                ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-500 ring-2 ring-brand-500/20'
                : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-brand-500'
            }`}
          >
              <div className="flex justify-between items-start mb-3">
                  <div className="text-2xl">{fmt.icon}</div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeColor}`}>
                      {label}
                  </span>
              </div>
              <h3 className={`font-bold text-sm mb-1 ${isActive ? 'text-brand-800 dark:text-brand-200' : 'text-zinc-800 dark:text-zinc-200'}`}>
                  {fmt.name}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">
                  {fmt.description}
              </p>
          </button>
      );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-50 dark:bg-zinc-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] flex flex-col transform scale-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0 z-10 relative">
            <div className="transition-all duration-300">
                <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    {step === 'format' ? 'Select Output Format' : 'Choose a Tone Profile'}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {step === 'format' ? 'Press Enter or click to select' : 'Required for customer-facing drafts'}
                </p>
            </div>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-zinc-950/50 relative">
            {step === 'format' ? (
                <div key="step-format" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-left-8 fade-in duration-300 ease-out fill-mode-both">
                    
                    {/* Column 1: Drafts */}
                    <div>
                        <h3 className="text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 mb-4 tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            Customer Drafts
                        </h3>
                        <div className="flex flex-col gap-3">
                            {FORMATS.filter(f => f.category === 'draft').map(renderFormatCard)}
                        </div>
                    </div>

                    {/* Column 2: Snippets */}
                    <div>
                        <h3 className="text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 mb-4 tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                            Helper Snippets
                        </h3>
                        <div className="flex flex-col gap-3">
                            {FORMATS.filter(f => f.category === 'snippet').map(renderFormatCard)}
                        </div>
                    </div>

                    {/* Column 3: Internal Tools */}
                    <div>
                        <h3 className="text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 mb-4 tracking-wider flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            Internal Records
                        </h3>
                        <div className="flex flex-col gap-3">
                            {FORMATS.filter(f => f.category === 'internal').map(renderFormatCard)}
                        </div>
                    </div>

                </div>
            ) : (
                <div key="step-tone" className="animate-in slide-in-from-right-8 fade-in duration-300 ease-out fill-mode-both h-full">
                     <button 
                        onClick={() => setStep('format')}
                        className="mb-4 text-xs font-medium text-zinc-500 hover:text-indigo-500 flex items-center gap-1 transition-colors group"
                     >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Formats
                     </button>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                         {TONES.map(tone => (
                             <button 
                                key={tone.id}
                                onClick={() => handleToneClick(tone.id)}
                                className={`text-left p-5 rounded-xl border transition-all duration-200 ease-out group hover:shadow-md hover:-translate-y-0.5 ${
                                    activeToneId === tone.id
                                    ? 'bg-white dark:bg-zinc-800 border-indigo-500 ring-2 ring-indigo-500/20'
                                    : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-indigo-500'
                                }`}
                             >
                                 <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">{tone.name}</h3>
                                 <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{tone.description}</p>
                             </button>
                         ))}
                     </div>
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400 shrink-0 z-10">
            Use arrow keys to navigate • Enter to select
        </div>
      </div>
    </div>
  );
};

export default FormatSelectorModal;
