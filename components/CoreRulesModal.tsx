import React, { useState } from 'react';
import { generateUpdatedRules } from '../services/geminiService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    rules: string;
    onUpdate: (rules: string) => void;
    apiKey: string;
}

const CoreRulesModal = ({ isOpen, onClose, rules, onUpdate, apiKey }: Props) => {
    const [instruction, setInstruction] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if(!isOpen) return null;

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            const { updatedRules } = await generateUpdatedRules(instruction, rules, apiKey);
            onUpdate(updatedRules);
            setInstruction('');
        } catch (e) {
            alert("Failed to update rules");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 h-[80vh] flex flex-col mx-4 md:mx-0">
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <h3 className="text-lg font-bold dark:text-white">Core Rules Config</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 p-2">✕</button>
                </div>

                <div className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl font-mono text-xs md:text-sm border border-zinc-200 dark:border-zinc-800 mb-4 whitespace-pre-wrap dark:text-zinc-300">
                    {rules}
                </div>

                <div className="space-y-2 shrink-0">
                    <p className="text-xs text-zinc-500">Instruct AI to modify the rules:</p>
                    <div className="flex flex-col md:flex-row gap-2">
                        <input 
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            placeholder="e.g., 'Be more empathetic' or 'Always use bullet points'"
                            className="flex-1 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-white"
                        />
                        <button 
                            onClick={handleUpdate}
                            disabled={isLoading || !instruction}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {isLoading ? 'Updating...' : 'Apply'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoreRulesModal;