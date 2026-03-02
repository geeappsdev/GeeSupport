import React, { useState } from 'react';

const ApiKeyModal = ({ onSubmit }: { onSubmit: (key: string) => void }) => {
  const [key, setKey] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md p-6 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold mb-2 dark:text-white">Enter API Key</h2>
        <p className="text-sm text-zinc-500 mb-4">You need a Gemini API key to use Gee Support.</p>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(key); }}>
            <input 
                type="password" 
                value={key} 
                onChange={(e) => setKey(e.target.value)}
                placeholder="Paste API Key here..."
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                autoFocus
            />
            <button 
                type="submit" 
                disabled={!key.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl disabled:opacity-50 transition-colors"
            >
                Get Started
            </button>
        </form>
        <p className="text-xs text-center mt-4 text-zinc-400">
            Get a key from <a href="https://aistudiogoogle.com/" target="_blank" className="text-indigo-500 hover:underline">Google AI Studio</a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyModal;
