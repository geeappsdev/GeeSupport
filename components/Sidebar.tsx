
import React, { useState, useRef, useEffect } from 'react';
import { FORMATS, TONES, PRODUCT_DOMAINS, INTERNAL_FORMAT_IDS } from '../constants';
import GeeLogo from './GeeLogo';
import EasterEggMusic from './EasterEggMusic';

interface Props {
  activeFormat: string;
  activeTone: string | null;
  activeProductDomains: string[];
  onSelectFormat: (id: string) => void;
  onSelectTone: (id: string) => void;
  onToggleProductDomain: (id: string) => void;
  isTrainingMode: boolean;
  onToggleTrainingMode: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  onOpenPrivacy: () => void;
  onOpenWalkthrough?: () => void;
  onOpenGuide?: () => void;
  onOpenChangelog?: () => void;
  onOpenCost?: () => void;
  onNewChat: () => void;
  position?: 'left' | 'right';
  isOpen?: boolean;
  onClose?: () => void;
  isMusicUnlocked?: boolean;
}

const Sidebar = ({ 
    activeFormat, 
    activeTone, 
    activeProductDomains,
    onSelectFormat, 
    onSelectTone, 
    onToggleProductDomain,
    isTrainingMode,
    onToggleTrainingMode,
    onOpenSettings, 
    onOpenRules, 
    onOpenPrivacy,
    onOpenWalkthrough,
    onOpenGuide,
    onOpenChangelog,
    onOpenCost,
    onNewChat,
    position = 'left',
    isOpen = false,
    onClose,
    isMusicUnlocked = false
}: Props) => {
  const [hoveredItem, setHoveredItem] = useState<{
      type: 'tone' | 'domain' | 'format';
      data: any;
      top: number;
      height: number;
  } | null>(null);
  
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    domains: false,
    tones: false,
    formats: false
  });

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    const handleScroll = () => {
        if (hoveredItem) setHoveredItem(null);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [hoveredItem]);

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMouseEnter = (e: React.MouseEvent, type: 'tone' | 'domain' | 'format', data: any) => {
      if (isMobile) return;

      const rect = e.currentTarget.getBoundingClientRect();
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      
      hoverTimeoutRef.current = setTimeout(() => {
          setHoveredItem({ type, data, top: rect.top, height: rect.height });
      }, 150);
  };

  const handleMouseLeave = () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setHoveredItem(null);
  };
  
  const SectionHeader = ({ id, title, status, count, subtitle }: { id: string, title: string, status: 'locked' | 'waiting' | 'complete', count?: number, subtitle?: string }) => {
    const isCollapsed = collapsedSections[id];
    let statusColor = '';
    let statusIcon = null;

    switch(status) {
        case 'locked':
            statusColor = 'bg-red-500/10 text-red-500 border-red-500/20';
            statusIcon = <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>;
            break;
        case 'waiting':
            statusColor = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            statusIcon = <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>;
            break;
        case 'complete':
            statusColor = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            statusIcon = <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>;
            break;
    }

    return (
        <div className="px-5 mb-3">
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => toggleSection(id)}>
                <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${status === 'locked' ? 'text-zinc-600' : 'text-zinc-400'} hover:text-zinc-200`}>
                    <svg className={`w-3 h-3 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    {title} {count !== undefined && <span className="opacity-50 font-normal">({count})</span>}
                </span>
                <div className={`flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${statusColor}`}>
                    {statusIcon}
                    <span>{status === 'complete' ? 'Ready' : status === 'locked' ? 'Locked' : 'Action'}</span>
                </div>
            </div>
            {subtitle && !isCollapsed && <p className="mt-1 ml-5 text-[10px] text-zinc-500 italic leading-tight">{subtitle}</p>}
        </div>
    );
  };

  const getTierBadge = (tier?: string) => {
    switch(tier) {
      case 'pro': return <span className="text-[8px] px-1 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-bold">PRO</span>;
      case 'lite': return <span className="text-[8px] px-1 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded font-bold">LITE</span>;
      default: return <span className="text-[8px] px-1 py-0.5 bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 rounded font-bold">STD</span>;
    }
  }

  const isDomainSelected = activeProductDomains.length > 0;
  const isInternalFormatActive = INTERNAL_FORMAT_IDS.includes(activeFormat);
  const isToneLocked = !isDomainSelected || isInternalFormatActive;

  const term = sidebarSearch.toLowerCase();
  const filteredDomains = PRODUCT_DOMAINS.filter(d => !term || d.name.toLowerCase().includes(term) || d.keywords.some(k => k.toLowerCase().includes(term)));
  const filteredTones = TONES.filter(t => !term || t.name.toLowerCase().includes(term) || t.description.toLowerCase().includes(term));
  const filteredFormats = FORMATS.filter(f => !term || f.name.toLowerCase().includes(term) || f.description.toLowerCase().includes(term));

  const draftFormats = filteredFormats.filter(f => f.category === 'draft');
  const snippetFormats = filteredFormats.filter(f => f.category === 'snippet');
  const internalFormats = filteredFormats.filter(f => f.category === 'internal');

  const renderFormatItem = (fmt: typeof FORMATS[0], isLocked: boolean, lockMessage: string, isInternalVariant: boolean = false) => {
    const isSelected = activeFormat === fmt.id;
    let selectedClasses = 'bg-brand-900/40 text-white border-brand-500';
    if (isInternalVariant) selectedClasses = 'bg-emerald-900/30 text-white border-emerald-500';

    return (
        <li key={fmt.id}>
            <button
                onMouseEnter={(e) => handleMouseEnter(e, 'format', fmt)}
                onMouseLeave={handleMouseLeave}
                onClick={() => { if(!isLocked) { onSelectFormat(fmt.id); if(onClose) onClose(); } }}
                disabled={isLocked}
                className={`w-full text-left px-5 py-2 text-[14px] flex items-center gap-3 transition-all border-l-[3px] ${
                    isSelected ? selectedClasses : isLocked ? 'text-zinc-600 cursor-not-allowed border-transparent' : 'text-zinc-400 hover:text-zinc-100 hover:bg-sidebar-hover border-transparent'
                }`}
            >
                <span className={`text-base w-5 flex justify-center relative ${isLocked ? 'opacity-30' : ''}`}>
                    {isLocked ? '🔒' : fmt.icon}
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium">{fmt.name}</span>
                        {!isLocked && getTierBadge(fmt.modelTier)}
                    </div>
                    {isLocked && <span className="text-[10px] text-zinc-600 font-normal truncate">{lockMessage}</span>}
                </div>
            </button>
        </li>
    );
  };

  const getPopoverStyle = () => {
      if (!hoveredItem) return {};
      const padding = 16, popoverEstimateHeight = 300; 
      const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
      if (isMobile) return { position: 'fixed' as const, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90vw', maxWidth: '320px', zIndex: 60 };
      let top = hoveredItem.top - (popoverEstimateHeight / 4);
      top = Math.max(padding, Math.min(top, windowHeight - popoverEstimateHeight - padding));
      const style: React.CSSProperties = { position: 'fixed', top, zIndex: 60, width: '288px' };
      if (position === 'left') style.left = '290px'; else style.right = '290px';
      return style;
  };

  const domainStatus = isDomainSelected ? 'complete' : 'waiting';
  const toneStatus = !isDomainSelected || isInternalFormatActive ? 'locked' : activeTone ? 'complete' : 'waiting';
  const formatStatus = !isDomainSelected ? 'locked' : (activeFormat || isInternalFormatActive) ? 'complete' : 'waiting';

  return (
    <>
        {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden animate-in fade-in" onClick={onClose}></div>}
        <div className={`w-[280px] bg-sidebar-bg flex flex-col h-full flex-shrink-0 ${position === 'right' ? 'border-l border-sidebar-border' : 'border-r border-sidebar-border'} fixed inset-y-0 z-40 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${position === 'right' ? 'right-0' : 'left-0'} ${isOpen ? 'translate-x-0' : position === 'right' ? 'translate-x-full' : '-translate-x-full'}`} id="sidebar-panel">
          <div className="h-16 flex items-center px-6 border-b border-sidebar-border/50 justify-between">
            <h1 className="font-bold text-white text-lg tracking-tight truncate flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-glow"><span className="font-bold text-sm">G</span></div>
                <span className="opacity-90">Gee Support</span>
            </h1>
            <button onClick={onClose} className="md:hidden text-zinc-400 hover:text-white p-1"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent py-6 space-y-8">
            <div className="px-4">
                 <button onClick={() => { onNewChat(); if(onClose) onClose(); }} className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-3 py-2.5 rounded-lg shadow-md hover:shadow-lg shadow-brand-500/20 text-[14px] font-bold transition-all w-full border border-brand-500/50 group"><svg className="w-4 h-4 text-white/90 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>New Session</button>
            </div>

            <div className="px-5">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none"><svg className="h-3.5 w-3.5 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                    <input type="text" className="block w-full pl-8 pr-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-md leading-4 text-zinc-300 placeholder-zinc-600 text-xs focus:outline-none focus:bg-zinc-900 focus:border-zinc-700 transition-colors" placeholder="Search topics, tones, tools..." value={sidebarSearch} onChange={(e) => setSidebarSearch(e.target.value)} />
                </div>
                <p className="mt-1.5 text-[9px] text-zinc-500 font-medium px-1 flex items-center gap-1 opacity-80">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Search if you have a hard time finding a topic.
                </p>
            </div>

            <div id="sidebar-domains">
                <SectionHeader id="domains" title="Topic Domain" status={domainStatus} count={filteredDomains.length} subtitle="Can't find it? Search above." />
                {!collapsedSections.domains && (
                    <ul className="space-y-0.5">
                        {filteredDomains.map(domain => {
                            const isSelected = activeProductDomains.includes(domain.id);
                            let categoryColor = domain.category.includes('direct') && domain.category.includes('connect') ? 'bg-gradient-to-r from-blue-500 to-teal-500' : domain.category.includes('direct') ? 'bg-blue-500' : domain.category.includes('connect') ? 'bg-teal-500' : 'bg-purple-500';
                            return (
                                <li key={domain.id}>
                                    <button onMouseEnter={(e) => handleMouseEnter(e, 'domain', domain)} onMouseLeave={handleMouseLeave} onClick={() => onToggleProductDomain(domain.id)} className={`w-full text-left px-5 py-2 text-[14px] flex items-center gap-3 transition-all relative ${isSelected ? 'bg-brand-900/40 text-white border-l-[3px] border-brand-500' : 'text-zinc-400 hover:text-zinc-100 hover:bg-sidebar-hover border-l-[3px] border-transparent'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${categoryColor}`}></span>
                                        <span className="truncate font-medium">{domain.name}</span>
                                        {isSelected && <span className="ml-auto text-brand-400 text-xs">✓</span>}
                                    </button>
                                </li>
                            );
                        })}
                        {filteredDomains.length === 0 && <li className="px-5 py-2 text-xs text-zinc-600 italic text-center">No matching topics</li>}
                    </ul>
                )}
            </div>

            <div id="sidebar-tones">
                <SectionHeader id="tones" title="Tone Profile" status={toneStatus} count={filteredTones.length} />
                {!collapsedSections.tones && (
                    <ul className="space-y-0.5">
                        {filteredTones.map(tone => {
                            const isSelected = activeTone === tone.id;
                            return (
                                <li key={tone.id}>
                                    <button onMouseEnter={(e) => handleMouseEnter(e, 'tone', tone)} onMouseLeave={handleMouseLeave} onClick={() => { if (!isToneLocked) { onSelectTone(tone.id); if(onClose) onClose(); } }} disabled={isToneLocked} className={`w-full text-left px-5 py-2 text-[14px] flex items-center gap-3 transition-all relative ${isToneLocked ? 'text-zinc-600 cursor-not-allowed border-transparent' : isSelected ? 'bg-brand-900/40 text-white border-l-[3px] border-emerald-500' : 'text-zinc-400 hover:text-zinc-100 hover:bg-sidebar-hover border-l-[3px] border-transparent'}`}>
                                        <div className={`w-2 h-2 rounded-full ${isSelected && !isToneLocked ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-zinc-700'}`}></div>
                                        <span className="truncate font-medium">{tone.name}</span>
                                    </button>
                                </li>
                            );
                        })}
                        {filteredTones.length === 0 && <li className="px-5 py-2 text-xs text-zinc-600 italic text-center">No matching tones</li>}
                    </ul>
                )}
            </div>

            <div id="sidebar-formats">
                <SectionHeader id="formats" title="Output Format" status={formatStatus} count={filteredFormats.length} />
                {!collapsedSections.formats && (
                    <>
                        {draftFormats.length > 0 && <div className="px-5 mb-2 mt-1"><span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest opacity-60">Drafts</span></div>}
                        <ul className="space-y-0.5">{draftFormats.map(fmt => renderFormatItem(fmt, !isDomainSelected || !activeTone, `Select ${!isDomainSelected ? 'Topic' : 'Tone'}`)) }</ul>
                        {snippetFormats.length > 0 && <div className="px-5 mb-2 mt-4"><span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest opacity-60">Snippets</span></div>}
                        <ul className="space-y-0.5">{snippetFormats.map(fmt => renderFormatItem(fmt, !isDomainSelected || !activeTone, `Select ${!isDomainSelected ? 'Topic' : 'Tone'}`)) }</ul>
                        {internalFormats.length > 0 && <div className="px-5 mb-2 mt-4"><span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest opacity-60">Internal Records</span></div>}
                        <ul className="space-y-0.5">{internalFormats.map(fmt => renderFormatItem(fmt, !isDomainSelected, 'Select Topic', true)) }</ul>
                        {filteredFormats.length === 0 && <li className="px-5 py-2 text-xs text-zinc-600 italic text-center">No matching formats</li>}
                    </>
                )}
            </div>

            {isMusicUnlocked && <EasterEggMusic />}
          </div>

          <div className="p-4 border-t border-sidebar-border bg-sidebar-bg space-y-1" id="sidebar-footer">
            <div className="flex items-center justify-between px-3 py-2" id="footer-training">
                <div className="flex items-center gap-2"><span className="text-[13px] font-medium text-zinc-400">Training Mode</span><div className="group relative"><span className="text-zinc-600 cursor-help">?</span><div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-zinc-800 text-xs text-white p-2 rounded shadow-lg hidden group-hover:block z-50">Forces AI to explain why it used specific technical details and tone.</div></div></div>
                <button onClick={onToggleTrainingMode} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isTrainingMode ? 'bg-brand-500' : 'bg-zinc-700'}`}><span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isTrainingMode ? 'translate-x-5' : 'translate-x-1'}`} /></button>
            </div>
            <div className="grid grid-cols-2 gap-1">
                {onOpenWalkthrough && <button id="footer-tutorial" onClick={() => { onOpenWalkthrough(); if(onClose) onClose(); }} className="w-full text-left flex items-center gap-2 text-zinc-400 text-[13px] px-2 py-2 rounded-md hover:bg-sidebar-hover hover:text-white transition-colors"><span className="opacity-70">🎬</span> <span className="font-medium truncate">Tutorial</span></button>}
                {onOpenGuide && <button id="footer-guide" onClick={() => { onOpenGuide(); if(onClose) onClose(); }} className="w-full text-left flex items-center gap-2 text-zinc-400 text-[13px] px-2 py-2 rounded-md hover:bg-sidebar-hover hover:text-white transition-colors"><span className="opacity-70">📖</span> <span className="font-medium truncate">Guide</span></button>}
            </div>
            {onOpenChangelog && <button id="footer-changelog" onClick={() => { onOpenChangelog(); if(onClose) onClose(); }} className="w-full text-left flex items-center gap-3 text-zinc-400 text-[13px] px-3 py-2 rounded-md hover:bg-sidebar-hover hover:text-white transition-colors group"><span className="opacity-70 group-hover:text-amber-400 transition-colors">🚀</span> <span className="font-medium">What's New</span></button>}
            <button id="footer-rules" onClick={() => { onOpenRules(); if(onClose) onClose(); }} className="w-full text-left flex items-center gap-3 text-zinc-400 text-[13px] px-3 py-2 rounded-md hover:bg-sidebar-hover hover:text-white transition-colors"><span className="opacity-70">⚖️</span> <span className="font-medium">Core Rules</span></button>
            <button id="footer-settings" onClick={() => { onOpenSettings(); if(onClose) onClose(); }} className="w-full text-left flex items-center gap-3 text-zinc-400 text-[13px] px-3 py-2 rounded-md hover:bg-sidebar-hover hover:text-white transition-colors"><span className="opacity-70">⚙️</span> <span className="font-medium">Preferences</span></button>
            <button id="footer-privacy" onClick={() => { onOpenPrivacy(); if(onClose) onClose(); }} className="w-full text-left flex items-center gap-3 text-zinc-400 text-[13px] px-3 py-2 rounded-md hover:bg-sidebar-hover hover:text-white transition-colors text-zinc-500 hover:text-zinc-300"><span className="opacity-70">🔒</span> <span className="font-medium">Privacy</span></button>
          </div>

          {hoveredItem && (
              <>
                 {isMobile && <div className="fixed inset-0 bg-black/60 z-50 animate-in fade-in backdrop-blur-sm" onClick={() => setHoveredItem(null)}></div>}
                 <div className="bg-[#18181b]/95 text-white p-4 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-zinc-700 backdrop-blur-md transition-all duration-200 animate-in fade-in zoom-in-95 pointer-events-none" style={getPopoverStyle()}>
                    <div className="flex items-start gap-3 mb-3 border-b border-zinc-700 pb-3">
                        <div className="mt-0.5 text-xl">{hoveredItem.type === 'domain' && '#'}{hoveredItem.type === 'format' && hoveredItem.data.icon}{hoveredItem.type === 'tone' && <div className="w-4 h-4 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>}</div>
                        <div>
                            <h4 className="font-bold text-base leading-tight">{hoveredItem.data.name}</h4>
                            <p className="text-xs text-zinc-400 font-medium mt-0.5 uppercase tracking-wide opacity-80">{hoveredItem.type} Profile</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div><p className="text-[13px] leading-relaxed text-zinc-200">{hoveredItem.data.description}</p></div>
                        {(hoveredItem.data.contextInstruction || hoveredItem.data.promptInstruction) && (
                            <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>AI Instruction</p>
                                <p className="text-[11px] font-mono text-emerald-200/90 leading-relaxed opacity-90">"{hoveredItem.data.contextInstruction || hoveredItem.data.promptInstruction || hoveredItem.data.instruction?.slice(0, 100) + '...'}"</p>
                            </div>
                        )}
                    </div>
                    {!isMobile && <div className={`absolute w-3 h-3 bg-[#18181b]/95 border-l border-b border-zinc-700 transform rotate-45 ${position === 'left' ? '-left-1.5 border-l border-b' : '-right-1.5 border-t border-r rotate-[225deg]'}`} style={{ top: Math.max(20, Math.min(hoveredItem.height / 2 + 10, 100)) }}></div>}
                 </div>
              </>
          )}
        </div>
    </>
  );
};

export default Sidebar;
