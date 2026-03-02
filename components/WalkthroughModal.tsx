
import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from 'react';

interface Props {
  isOpen: boolean;
  onComplete: () => void;
}

interface Step {
  title: string;
  description: string;
  targetId?: string; 
  position?: 'left' | 'right' | 'top' | 'bottom';
  proTip?: string;
}

const STEPS: Step[] = [
  {
    title: "Welcome to Gee Support 2.5",
    description: "Your advanced AI co-pilot for high-velocity support. This tour will show you how to leverage tiered models and accuracy tracking to deliver world-class responses.",
    targetId: undefined
  },
  {
    title: "Multi-Domain Knowledge",
    description: "Start by selecting one or more Product Domains. This search-enabled grid loads specific API schemas and technical documentation directly into the AI's short-term memory.",
    targetId: 'domain-grid',
    position: 'top',
    proTip: "Try searching 'connect' or 'billing' to quickly filter relevant topics."
  },
  {
    title: "Traffic Light Status",
    description: "The header and sidebar use a traffic-light system. Red means locked, Amber means configuration in progress, and Green means you're ready to generate.",
    targetId: 'sidebar-panel',
    position: 'right'
  },
  {
    title: "Smart Tone Profiles",
    description: "Choose a Tone Profile to match the customer's state. 'Driver' is best for direct resolutions, while 'Amiable' is tailored for sensitive escalations.",
    targetId: 'sidebar-tones',
    position: 'right'
  },
  {
    title: "Output Formats",
    description: "Select your desired output. Use 'Drafts' for emails, or 'Internal Records' for concise, objective notes that strip away conversational filler.",
    targetId: 'sidebar-formats',
    position: 'right',
    proTip: "Internal formats automatically disable tone profiles to maintain neutrality."
  },
  {
    title: "Confidence & Accuracy",
    description: "Every response now includes a self-evaluated confidence score. This validates the AI's output against official documentation in real-time.",
    targetId: 'chat-input-area', 
    position: 'top',
    proTip: "Scores below 80% will highlight specific areas where context might be missing."
  },
  {
    title: "Thinking & Reasoning",
    description: "Audit the AI's internal logic using the hidden 'Thinking' block. It reveals the QA checklist used for PII redaction and documentation grounding.",
    targetId: 'chat-input-area',
    position: 'top'
  },
  {
    title: "Training Mode Toggle",
    description: "Switch this on to enable an educational overlay in your responses. The AI will explain its choice of tone and technical APIs to help you upskill.",
    targetId: 'footer-training',
    position: 'right',
    proTip: "Great for new team members learning the 'Stripe Way' of communication."
  },
  {
    title: "The Workflow Guide",
    description: "Access the comprehensive Guide to view the 4-step workflow, product ecosystem maps, and detailed technical deep-dives.",
    targetId: 'footer-guide',
    position: 'right'
  },
  {
    title: "What's New (Changelog)",
    description: "Keep track of our latest AI model improvements, bug fixes, and feature releases through the changelog modal.",
    targetId: 'footer-changelog',
    position: 'right'
  },
  {
    title: "Rules Engine (Core Rules)",
    description: "Override or append to the AI's global operating system. Use this to enforce brand styling, compliance mandates, or personal preferences.",
    targetId: 'footer-rules',
    position: 'right',
    proTip: "Example: 'Always refer to the customer as Partner'."
  },
  {
    title: "Preferences & Layout",
    description: "Customize your environment. Toggle between dark and light modes, set your display name, or move the sidebar to the right side of the screen.",
    targetId: 'footer-settings',
    position: 'right'
  },
  {
    title: "Privacy & Data Handling",
    description: "Transparency is core to Gee Support. View our privacy modal to see how we handle RAM-only storage and our zero-retention policy.",
    targetId: 'footer-privacy',
    position: 'right'
  },
  {
    title: "Tutorial Replay",
    description: "Need a refresher? You can always trigger this guided walkthrough again from the Tutorial button in the footer.",
    targetId: 'footer-tutorial',
    position: 'right'
  }
];

const WalkthroughModal = ({ isOpen, onComplete }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [popoverLayout, setPopoverLayout] = useState<{
      style: React.CSSProperties;
      arrowClass: string;
      arrowStyle: React.CSSProperties;
  } | null>(null);
  
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  useEffect(() => {
    if (!isOpen) return;

    let animationFrameId: number;
    const updateRect = () => {
      if (!step.targetId) {
          setTargetRect(null);
          return;
      }
      const el = document.getElementById(step.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(prev => {
            if (!prev || prev.top !== rect.top || prev.left !== rect.left || prev.width !== rect.width || prev.height !== rect.height) {
                return rect;
            }
            return prev;
        });
      } else {
        setTargetRect(null);
      }
    };

    const el = step.targetId ? document.getElementById(step.targetId) : null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      const startTime = Date.now();
      const track = () => {
        updateRect();
        if (Date.now() - startTime < 1000) animationFrameId = requestAnimationFrame(track);
      };
      track();
    } else {
        updateRect();
    }

    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [currentStep, step.targetId, windowSize, isOpen]);

  useLayoutEffect(() => {
    if (!targetRect || windowSize.width < 768 || !isOpen) {
        setPopoverLayout(null);
        return;
    }

    const POPOVER_W = 380; 
    const POPOVER_H_EST = 320; 
    const GAP = 20;
    const VIEWPORT_PAD = 24;

    const space = {
        top: targetRect.top,
        bottom: windowSize.height - targetRect.bottom,
        left: targetRect.left,
        right: windowSize.width - targetRect.right
    };

    let side = step.position || 'bottom';
    
    const doesFit = (s: string) => {
        if (s === 'top' || s === 'bottom') return space[s] >= (POPOVER_H_EST + GAP);
        return space[s] >= (POPOVER_W + GAP);
    };

    if (!doesFit(side)) {
        const sortedSides = Object.entries(space).sort((a, b) => b[1] - a[1]);
        side = sortedSides[0][0] as any;
    }

    let top = 0, left = 0, arrowClass = '', arrowStyle: React.CSSProperties = {};
    const centerH = targetRect.left + (targetRect.width / 2);
    const centerV = targetRect.top + (targetRect.height / 2);

    switch(side) {
        case 'top':
            top = targetRect.top - GAP - POPOVER_H_EST;
            left = centerH - (POPOVER_W / 2);
            arrowClass = 'border-b border-r -bottom-[7px]';
            break;
        case 'bottom':
            top = targetRect.bottom + GAP;
            left = centerH - (POPOVER_W / 2);
            arrowClass = 'border-t border-l -top-[7px]';
            break;
        case 'left':
            left = targetRect.left - GAP - POPOVER_W;
            top = centerV - (POPOVER_H_EST / 2);
            arrowClass = 'border-b border-r -right-[7px]';
            break;
        case 'right':
            left = targetRect.right + GAP;
            top = centerV - (POPOVER_H_EST / 2);
            arrowClass = 'border-t border-l -left-[7px]';
            break;
    }

    const minLeft = VIEWPORT_PAD;
    const maxLeft = windowSize.width - POPOVER_W - VIEWPORT_PAD;
    left = Math.max(minLeft, Math.min(left, maxLeft));

    if (side === 'left' || side === 'right') {
        const arrowY = centerV - top - 7;
        arrowStyle = { top: `${arrowY}px` };
    } else {
        const arrowX = centerH - left - 7;
        arrowStyle = { left: `${arrowX}px` };
    }

    setPopoverLayout({ 
        style: { position: 'absolute', zIndex: 110, left, top, width: POPOVER_W }, 
        arrowClass, 
        arrowStyle 
    });
  }, [targetRect, step.position, windowSize, isOpen]);

  const handleNext = useCallback(() => currentStep < STEPS.length - 1 ? setCurrentStep(prev => prev + 1) : onComplete(), [currentStep, onComplete]);
  const handleBack = useCallback(() => currentStep > 0 && setCurrentStep(prev => prev - 1), [currentStep]);

  useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext();
          if (e.key === 'ArrowLeft') handleBack();
          if (e.key === 'Escape') onComplete();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handleBack, onComplete, isOpen]);

  if (!isOpen) return null;

  const isSpotlightActive = !!targetRect && windowSize.width >= 768;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <style>{`
        @keyframes spotlightPulse {
            0% { box-shadow: 0 0 0 0px rgba(99, 102, 241, 0.4), 0 0 0 0px rgba(99, 102, 241, 0.2); }
            50% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0), 0 0 0 20px rgba(99, 102, 241, 0); }
            100% { box-shadow: 0 0 0 0px rgba(99, 102, 241, 0), 0 0 0 0px rgba(99, 102, 241, 0); }
        }
        .spotlight-frame {
            animation: spotlightPulse 2s infinite;
        }
      `}</style>
      
      {isSpotlightActive && targetRect ? (
          <>
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-all duration-700 cursor-pointer" 
              onClick={onComplete}
              style={{
                clipPath: `polygon(0% 0%, 0% 100%, ${targetRect.left}px 100%, ${targetRect.left}px ${targetRect.top}px, ${targetRect.right}px ${targetRect.top}px, ${targetRect.right}px ${targetRect.bottom}px, ${targetRect.left}px ${targetRect.bottom}px, ${targetRect.left}px 100%, 100% 100%, 100% 0%)`
              }} 
            />
            <div 
                className="absolute border-2 border-brand-400 rounded-lg pointer-events-none transition-all duration-700 z-[105] spotlight-frame"
                style={{
                    top: targetRect.top - 4,
                    left: targetRect.left - 4,
                    width: targetRect.width + 8,
                    height: targetRect.height + 8,
                }}
            />
          </>
      ) : (
          <div 
            className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-700 cursor-pointer"
            onClick={onComplete}
          ></div>
      )}

      <div className={`absolute inset-0 flex pointer-events-none ${isSpotlightActive ? '' : 'items-center justify-center p-4'}`}>
        <div 
            ref={popoverRef}
            className="bg-white dark:bg-zinc-900 w-full max-w-[340px] md:max-w-[380px] rounded-3xl shadow-2xl flex flex-col pointer-events-auto transition-all duration-500 ease-out border border-zinc-200 dark:border-zinc-800 relative group overflow-hidden"
            style={isSpotlightActive && popoverLayout ? popoverLayout.style : {}}
        >
            {isSpotlightActive && popoverLayout && (
                <div 
                    className={`absolute w-3.5 h-3.5 bg-white dark:bg-zinc-900 transform rotate-45 border-zinc-200 dark:border-zinc-800 ${popoverLayout.arrowClass}`}
                    style={popoverLayout.arrowStyle}
                ></div>
            )}

            <div className="flex flex-col h-full">
                <div className="p-6 pb-0 flex justify-between items-center relative">
                    <div className="flex gap-1.5 flex-1 pr-8">
                         {STEPS.map((_, idx) => (
                            <div key={idx} className={`h-1 rounded-full transition-all duration-500 ${idx === currentStep ? 'flex-[3] bg-brand-500' : idx < currentStep ? 'flex-1 bg-brand-200 dark:bg-brand-900' : 'flex-1 bg-zinc-200 dark:bg-zinc-800'}`} />
                         ))}
                    </div>
                    <button 
                        onClick={onComplete} 
                        className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"
                        aria-label="Close walkthrough"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 pt-8 flex flex-col h-full">
                    <div key={currentStep} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h3 className="font-bold text-2xl text-zinc-900 dark:text-white mb-3 tracking-tight">
                            {step.title}
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                            {step.description}
                        </p>
                        
                        {step.proTip && (
                            <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 p-3 rounded-xl mb-6">
                                <p className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Pro Tip
                                </p>
                                <p className="text-xs text-brand-700 dark:text-brand-300 leading-snug">
                                    {step.proTip}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                         <div className="flex gap-4 items-center">
                            <button onClick={handleBack} disabled={currentStep === 0} className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentStep === 0 ? 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}>
                                Back
                            </button>
                            <button onClick={onComplete} className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-500 transition-colors">
                                Skip
                            </button>
                         </div>

                        <button onClick={handleNext} className="flex items-center gap-2 pl-6 pr-4 py-2.5 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all text-sm group/btn active:scale-95">
                            {isLastStep ? "Launch Console" : "Continue"}
                            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WalkthroughModal;
