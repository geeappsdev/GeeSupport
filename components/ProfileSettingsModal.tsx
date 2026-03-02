import React, { useState } from 'react';
import { UserProfile } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    profile: UserProfile;
    onSave: (p: UserProfile) => void;
}

const ProfileSettingsModal = ({ isOpen, onClose, profile, onSave }: Props) => {
    const [name, setName] = useState(profile.name);
    const [mode, setMode] = useState(profile.mode);
    const [layout, setLayout] = useState<'left' | 'right'>(profile.layout || 'left');

    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 mx-4 md:mx-0 overflow-y-auto max-h-[90vh]">
                <h3 className="text-lg font-bold mb-4 dark:text-white">Settings</h3>
                
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Display Name</label>
                        <input 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Interface Layout</label>
                        <div className="grid grid-cols-2 gap-2">
                             <button
                                onClick={() => setLayout('left')}
                                className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-sm font-medium transition-all ${
                                    layout === 'left' 
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                                }`}
                             >
                                <div className="flex gap-1 items-center">
                                    <div className="w-2 h-4 bg-current rounded-sm opacity-50"></div>
                                    <div className="w-4 h-4 border border-current rounded-sm opacity-50"></div>
                                </div>
                                Left Sidebar
                             </button>
                             <button
                                onClick={() => setLayout('right')}
                                className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-sm font-medium transition-all ${
                                    layout === 'right' 
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                                }`}
                             >
                                <div className="flex gap-1 items-center">
                                    <div className="w-4 h-4 border border-current rounded-sm opacity-50"></div>
                                    <div className="w-2 h-4 bg-current rounded-sm opacity-50"></div>
                                </div>
                                Right Sidebar
                             </button>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Theme Mode</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['light', 'dark', 'system'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m as any)}
                                    className={`p-2 text-sm rounded-lg border capitalize transition-all ${mode === m ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <button onClick={onClose} className="flex-1 py-2.5 text-zinc-500 font-medium hover:text-zinc-800 transition-colors">Cancel</button>
                    <button 
                        onClick={() => { onSave({ ...profile, name, mode, layout }); onClose(); }}
                        className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsModal;