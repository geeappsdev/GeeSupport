
import React from 'react';
import { MODEL_COSTS, USD_TO_MYR_RATE } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    lite: number;
    standard: number;
    pro: number;
    totalRequests: number;
    tokensSaved: number;
  };
}

const CostImpactModal = ({ isOpen, onClose, stats }: Props) => {
  if (!isOpen) return null;

  const COST_LITE = MODEL_COSTS.lite;    
  const COST_STD = MODEL_COSTS.standard; 
  const COST_PRO = MODEL_COSTS.pro;      
  
  const EX_RATE = USD_TO_MYR_RATE;

  const currentCostUSD = 
    (stats.lite * COST_LITE) + 
    (stats.standard * COST_STD) + 
    (stats.pro * COST_PRO);

  const naiveCostUSD = stats.totalRequests * COST_PRO;
  
  const savingsUSD = naiveCostUSD - currentCostUSD;
  const savingsPercent = naiveCostUSD > 0 ? ((savingsUSD / naiveCostUSD) * 100).toFixed(1) : 0;

  const savingsMYR = (savingsUSD * EX_RATE).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div>
                <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <span className="text-2xl">💰</span> Cost Impact Analysis
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Real-time savings from Tiered Model & Prompt Optimization</p>
            </div>
            <button 
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="p-6 md:p-8 bg-zinc-50 dark:bg-zinc-950">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Requests</p>
                    <p className="text-xl font-bold text-zinc-900 dark:text-white">{stats.totalRequests}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Tokens Saved</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                        {stats.tokensSaved.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Net Savings</p>
                    <p className="text-xl font-bold text-amber-600">RM {savingsMYR}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Efficiency</p>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{savingsPercent}%</p>
                </div>
            </div>

            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mb-4">Model Usage Breakdown</h3>
            <div className="space-y-3">
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs shrink-0">Lite</div>
                    <div className="flex-1">
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Snippet Tier</span>
                            <span className="text-[10px] text-zinc-500">{stats.lite} reqs</span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${stats.totalRequests ? (stats.lite / stats.totalRequests) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs shrink-0">Std</div>
                    <div className="flex-1">
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Balanced Tier</span>
                            <span className="text-[10px] text-zinc-500">{stats.standard} reqs</span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${stats.totalRequests ? (stats.standard / stats.totalRequests) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-xs shrink-0">Pro</div>
                    <div className="flex-1">
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Reasoning Tier</span>
                            <span className="text-[10px] text-zinc-500">{stats.pro} reqs</span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${stats.totalRequests ? (stats.pro / stats.totalRequests) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-800 text-center">
                 <p className="text-xs text-brand-700 dark:text-brand-300 leading-relaxed">
                    By dynamically assembling prompts and pruning history based on task complexity, <strong>Gee Support</strong> has mitigated approximately <strong>{(stats.tokensSaved / 1000).toFixed(1)}k tokens</strong> from your API usage.
                 </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CostImpactModal;
