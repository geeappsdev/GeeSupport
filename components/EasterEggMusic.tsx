
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const EasterEggMusic = () => {
  const [query, setQuery] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState('jfKfPfyJRdk'); // Default Lofi Girl
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory] = useState<{title: string, id: string}[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const searchWithGemini = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Find a high-quality YouTube video ID for this search query: "${query}". 
        Return ONLY the 11-character YouTube video ID string. No other text. 
        If it's a music request, prefer official music videos or high-quality audio streams.`,
      });
      
      const videoId = response.text?.trim();
      if (videoId && videoId.length === 11) {
        setCurrentVideoId(videoId);
        setHistory(prev => [{ title: query, id: videoId }, ...prev].slice(0, 5));
        setIsPlaying(true);
        setQuery('');
      }
    } catch (error) {
      console.error("Gemini Music Search Error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="mt-4 px-4 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        {/* Visualizer Header */}
        <div 
          className="h-12 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-indigo-900/40 flex items-center justify-between px-4 cursor-pointer hover:from-indigo-900/60 transition-all"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
             <div className="flex gap-0.5 items-end h-3">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1 bg-indigo-400 rounded-full ${isPlaying ? 'animate-bounce' : 'h-1'}`}
                    style={{ animationDelay: `${i * 0.1}s`, height: isPlaying ? '100%' : '20%' }}
                  ></div>
                ))}
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Gee Audio Lab</span>
          </div>
          <svg className={`w-4 h-4 text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>

        {isExpanded && (
          <div className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
            {/* Search Input */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Search music..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-3 pr-10 text-[11px] text-zinc-300 placeholder-zinc-600 focus:border-indigo-500 outline-none transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchWithGemini()}
              />
              <button 
                onClick={searchWithGemini}
                disabled={isSearching}
                className="absolute right-2 top-1.5 text-zinc-500 hover:text-indigo-400 transition-colors"
              >
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                )}
              </button>
            </div>

            {/* History Tags */}
            {history.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {history.map((h, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentVideoId(h.id)}
                    className="text-[9px] font-bold uppercase tracking-tight px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-full border border-zinc-700 transition-colors truncate max-w-[80px]"
                  >
                    {h.title}
                  </button>
                ))}
              </div>
            )}

            {/* Hidden Iframe (Persistent Playback) */}
            <div className="rounded-xl overflow-hidden aspect-video bg-black border border-zinc-800 relative">
               <iframe 
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                title="GeePlayer"
               />
               {!isPlaying && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
                    <button className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </button>
                 </div>
               )}
            </div>
            
            <p className="text-[9px] text-center text-zinc-600 font-mono italic">
              Powered by Gemini Search Engine
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EasterEggMusic;
