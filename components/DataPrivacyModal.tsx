import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DataPrivacyModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold dark:text-white">Data Handling & Privacy</h3>
                    <p className="text-xs text-zinc-500">Transparency Protocol</p>
                </div>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="space-y-4 mb-8">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Client-Side Isolation
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    This application runs entirely on your local device. There is <strong>no central database</strong> storing chat logs. Your session data is completely isolated from other users and cannot be accessed by anyone else using the app.
                </p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Ephemeral Storage (RAM Only)
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Chat history and input data are stored exclusively in your browser's temporary memory (RAM). We do <strong>not</strong> use LocalStorage or Cookies to persist conversation logs. Refreshing the page or clicking "New Session" permanently wipes this data.
                </p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Google Gemini Processing
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Data is transmitted securely to Google's Gemini API for processing. We do not store, log, or train on your inputs on our own intermediate servers.
                </p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    PII Best Practices
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    While connections are secure, we recommend redacting highly sensitive Personally Identifiable Information (Full Credit Card Numbers, SSNs) before pasting logs, adhering to standard compliance protocols.
                </p>
            </div>
        </div>
        
        <button 
            onClick={onClose}
            className="w-full py-3 bg-zinc-900 dark:bg-zinc-700 text-white font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors"
        >
            Acknowledge
        </button>
      </div>
    </div>
  );
};

export default DataPrivacyModal;