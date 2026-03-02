
import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TABS = [
  { id: 'workflow', label: '4-Step Workflow' },
  { id: 'copilot', label: 'Co-pilot Process' },
  { id: 'toolbox', label: 'Feature Toolbox' },
  { id: 'ecosystem', label: 'Product Ecosystem' },
];

const WorkflowStep = ({ number, title, description, icon, color }: { number: string, title: string, description: string, icon: React.ReactNode, color: string }) => (
  <div className="flex flex-col items-center text-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 h-full transition-transform hover:scale-[1.02] duration-300">
     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-sm ${color}`}>
        {icon}
     </div>
     <div className="font-bold text-lg mb-2 text-zinc-900 dark:text-zinc-100">{number}. {title}</div>
     <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
  </div>
);

const ECOSYSTEM_DATA = [
  {
    id: 'direct',
    title: "Direct Payments",
    description: "Foundational Payments LOB",
    rootClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    borderClass: "border-blue-200 dark:border-blue-800",
    connectorClass: "bg-blue-300 dark:bg-blue-700",
    dotClass: "bg-blue-500",
    branches: [
      {
        title: "Key Products",
        items: ["Payments Online", "Terminal (In-person)", "Radar (Fraud Prevention)", "Authorization Boost"]
      },
      {
        title: "Implementation Tools",
        items: ["Payment Links (No-code)", "Checkout (Prebuilt form)", "Elements (Flexible UI)"]
      },
      {
        title: "Infrastructure",
        items: ["Transfers & Payouts", "Refunds", "Disputes", "Declines", "APMs & LPMs"]
      }
    ]
  },
  {
    id: 'connect',
    title: "Connect (Platforms)",
    description: "Multiparty payments & payouts",
    rootClass: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    borderClass: "border-teal-200 dark:border-teal-800",
    connectorClass: "bg-teal-300 dark:bg-teal-700",
    dotClass: "bg-teal-500",
    branches: [
      {
        title: "Key Products & Topics",
        items: ["Connect Integrations", "OAuth & Onboarding", "Fund Flows (Direct/Dest)", "Platform Reserves", "Application Fees", "Unified Accounts (UA)"]
      },
      {
        title: "Support / Compliance",
        items: ["Onboard Service Providers", "Multiparty Payments", "CBSP (Single Platform)", "Tax Reporting"]
      },
      {
        title: "Risk Interventions",
        items: ["Disabled Payouts", "Account Rejections"]
      }
    ]
  },
  {
    id: 'saas',
    title: "SaaS (Revenue)",
    description: "Software as a Service & Recurring",
    rootClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    borderClass: "border-purple-200 dark:border-purple-800",
    connectorClass: "bg-purple-300 dark:bg-purple-700",
    dotClass: "bg-purple-500",
    branches: [
      {
        title: "Key Products",
        items: ["Billing (Subscriptions)", "Invoicing", "Tax Automation", "Revenue Recognition"]
      },
      {
        title: "Revenue Optimization",
        items: ["Smart Retries", "Billing Recovery", "Retention Automations"]
      },
      {
        title: "Pricing Models",
        items: ["Flat Rate", "Usage-based (Metered)", "Hybrid", "Per-seat"]
      }
    ]
  }
];

const ToolboxView = () => (
    <div className="max-w-5xl mx-auto w-full p-4 animate-in fade-in duration-500 slide-in-from-left-4">
        <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Feature Toolbox Guide</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Master the visible modals and advanced controls of Gee Support</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center text-2xl shrink-0">⚙️</div>
                <div>
                    <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1">Preferences Modal</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">Customize your profile, set your display name, and toggle between Light/Dark/System UI modes and sidebar positioning.</p>
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center text-2xl shrink-0">⚖️</div>
                <div>
                    <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1">Rules Engine (Core Rules)</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">Instruct the AI to rewrite its own internal logic. Use this to enforce specific styling or global compliance rules across all sessions.</p>
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center text-2xl shrink-0">💰</div>
                <div>
                    <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1">Cost Impact Analysis</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">Monitor real-time efficiency savings generated by our Tiered Model architecture. Compare 'Lite' vs 'Standard' vs 'Pro' model usage.</p>
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center text-2xl shrink-0">🛡️</div>
                <div>
                    <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1">Data Privacy Modal</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">A transparent deep-dive into how your data is processed. Explains RAM-only storage and our PII redaction protocols.</p>
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center text-2xl shrink-0">🚀</div>
                <div>
                    <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1">Changelog Modal</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">Stay updated with the latest AI model updates, UI improvements, and bug fixes as we continuously roll out new features.</p>
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-900/50 dark:text-zinc-400 flex items-center justify-center text-2xl shrink-0">🎬</div>
                <div>
                    <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1">Tutorial (Walkthrough)</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">Replay the guided tour to refresh your memory on the core UI components and traffic-light navigation system.</p>
                </div>
            </div>
        </div>
    </div>
);

const EcosystemView = () => (
    <div className="max-w-6xl mx-auto w-full p-4 animate-in fade-in duration-500 slide-in-from-bottom-4">
        <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Product Ecosystem Map</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Navigate the feature landscape by vertical</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {ECOSYSTEM_DATA.map((vertical) => (
                <div key={vertical.id} className="flex flex-col">
                    <div className={`p-4 rounded-xl border-2 mb-8 text-center shadow-sm relative z-10 ${vertical.rootClass}`}>
                        <h3 className="font-bold text-lg">{vertical.title}</h3>
                        <p className="text-xs opacity-80">{vertical.description}</p>
                        <div className={`absolute left-1/2 -bottom-8 w-0.5 h-8 opacity-40 ${vertical.connectorClass.replace('bg-', 'bg-current ')}`}></div>
                    </div>

                    <div className={`flex flex-col gap-6 relative pl-6 border-l-2 ${vertical.borderClass} ml-6 lg:ml-8`}>
                        {vertical.branches.map((branch, i) => (
                            <div key={i} className="relative">
                                <div className={`absolute -left-[26px] top-4 w-6 h-0.5 ${vertical.connectorClass}`}></div>
                                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 shadow-sm relative z-10 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
                                    <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 mb-3 pb-2 border-b border-zinc-100 dark:border-zinc-700/50 flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${vertical.dotClass}`}></span>
                                        {branch.title}
                                    </h4>
                                    <ul className="space-y-2">
                                        {branch.items.map((item, j) => (
                                            <li key={j} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                                                <svg className="w-3 h-3 text-zinc-300 dark:text-zinc-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                                <span className="leading-tight">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const FourStepView = () => (
  <div className="max-w-5xl mx-auto w-full p-4 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">The Gee Support Workflow</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Get answers fast with this 4-step process</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <WorkflowStep 
             number="1"
             title="Select Domain" 
             description="Click a product domain to load its specific knowledge base and API context."
             icon="🧩"
             color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          />
          <WorkflowStep 
             number="2"
             title="Choose Tone" 
             description="Adjust the AI's empathy and structure to match the customer's mood."
             icon="🎚️"
             color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
          />
          <WorkflowStep 
             number="3"
             title="Pick Format" 
             description="Select from full email drafts, short snippets, or internal compliance notes."
             icon="📝"
             color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          />
          <WorkflowStep 
             number="4"
             title="Generate" 
             description="Paste case details, hit send, and audit the AI's logic before copying."
             icon="🚀"
             color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
          />
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-700 shadow-sm">
          <h3 className="text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 mb-6 tracking-widest border-b border-zinc-100 dark:border-zinc-700 pb-2">Quick Reference Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="flex items-start gap-5">
                  <div className="flex flex-col gap-2 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl shrink-0 border border-zinc-200 dark:border-zinc-800">
                      <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm ring-2 ring-red-500/20"></div>
                      <div className="w-4 h-4 rounded-full bg-amber-500 shadow-sm ring-2 ring-amber-500/20"></div>
                      <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm ring-2 ring-green-500/20"></div>
                  </div>
                  <div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg mb-1">Traffic Light Logic</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Your configuration status is always clear. Red means <span className="font-medium text-zinc-900 dark:text-zinc-200">Locked</span>, Amber is <span className="font-medium text-zinc-900 dark:text-zinc-200">Waiting</span>, and Green is <span className="font-medium text-zinc-900 dark:text-zinc-200">Ready</span>.
                      </p>
                  </div>
              </div>
              <div className="flex items-start gap-5">
                   <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl shrink-0 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                   </div>
                   <div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg mb-1">Training Mode</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Toggle this ON to force the AI to explain its <span className="font-medium text-zinc-900 dark:text-zinc-200">technical reasoning</span> and <span className="font-medium text-zinc-900 dark:text-zinc-200">tone choice</span> in an educational insight block.
                      </p>
                  </div>
              </div>
          </div>
      </div>
  </div>
);

const CopilotView = () => (
   <div className="max-w-5xl mx-auto w-full p-4 animate-in fade-in duration-500 slide-in-from-right-4">
      <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Co-pilot Workflow</h2>
          <p className="text-zinc-500 dark:text-zinc-400">3 steps to precision support</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <WorkflowStep 
             number="1"
             title="Configure Context" 
             description="Select your Product Domain and Tone using the sidebar controls. The traffic light system guides you."
             icon="🎛️"
             color="bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
          />
           <WorkflowStep 
             number="2"
             title="Draft Response" 
             description="Use structured formats (Email, Bad News, Internal Notes) or Quick Actions to start generating."
             icon="✍️"
             color="bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
          />
           <WorkflowStep 
             number="3"
             title="Learn While You Work" 
             description="Enable Training Mode to see 'AI Insights' explaining the 'why' behind every response."
             icon="💡"
             color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          />
      </div>
   </div>
);

const WorkflowGuideModal = ({ isOpen, onClose }: Props) => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  if (!isOpen) return null;

  const renderContent = () => {
      switch(activeTab) {
          case 'workflow': return <FourStepView />;
          case 'copilot': return <CopilotView />;
          case 'toolbox': return <ToolboxView />;
          case 'ecosystem': return <EcosystemView />;
          default: return <FourStepView />;
      }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh] h-[800px] transform scale-100 animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <span className="text-xl">🗺️</span> Workflow Guide
                </h2>
                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                                activeTab === tab.id
                                ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <button 
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8 flex items-center justify-center">
            {renderContent()}
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center shrink-0">
             <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Pro Tip: Follow the <span className="font-bold text-indigo-500">Traffic Light Logic</span> in the sidebar to ensure all context is loaded before generating.
             </p>
        </div>
      </div>
    </div>
  );
};

export default WorkflowGuideModal;
