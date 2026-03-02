import React from 'react';

const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-4 bg-white dark:bg-zinc-800 rounded-2xl w-fit shadow-sm border border-zinc-100 dark:border-zinc-700/50">
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
  </div>
);

export default TypingIndicator;