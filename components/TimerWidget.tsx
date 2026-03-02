import React, { useState, useEffect } from 'react';
import { Station } from '../types';
import { DEFAULT_STATION } from '../constants';

const MusicWidget = () => {
  const [station, setStation] = useState<Station>(DEFAULT_STATION as unknown as Station);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Poll for station updates
    const fetchStation = async () => {
        try {
            const res = await fetch('/api/station');
            if(res.ok) {
                const data = await res.json();
                setStation(data);
            }
        } catch (e) {
            console.warn("Radio offline");
        }
    };
    
    fetchStation();
    const interval = setInterval(fetchStation, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 transition-all duration-300 ${isExpanded ? 'h-64' : 'h-14'} overflow-hidden flex flex-col`}>
        <div 
            className="flex items-center justify-between px-4 h-14 shrink-0 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-zinc-400'}`}></div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200 uppercase tracking-wider">Gee Radio</span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[150px]">{station.name}</span>
                </div>
            </div>
            <button className="text-zinc-400">
                <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
            </button>
        </div>
        
        <div className="flex-1 bg-black relative">
            {isExpanded && (
                <iframe 
                    src={station.url} 
                    className="w-full h-full absolute inset-0" 
                    frameBorder="0" 
                    allow="autoplay; encrypted-media" 
                    title="Radio"
                    onLoad={() => setIsPlaying(true)}
                ></iframe>
            )}
        </div>
    </div>
  );
};

export default MusicWidget;