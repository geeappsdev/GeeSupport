import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPromoModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#fff9f0] dark:bg-zinc-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800 relative transform scale-100 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
         
         <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&family=Quicksand:wght@500;700&display=swap');

            .privacy-wrapper {
                font-family: 'Quicksand', sans-serif;
                background-color: #fff9f0;
                padding: 40px 20px;
                width: 100%;
                color: #4a3b32;
                box-sizing: border-box;
            }
            
            /* Dark mode overrides for the wrapper */
            .dark .privacy-wrapper {
                background-color: #18181b; /* zinc-900 */
                color: #e4e4e7; /* zinc-200 */
            }

            .privacy-title {
                font-family: 'Fredoka', sans-serif;
                text-align: center;
                font-size: 2.5rem;
                margin-bottom: 40px;
                color: #3e2723;
                position: relative;
                display: inline-block;
                width: 100%;
                line-height: 1.2;
            }

            .dark .privacy-title {
                color: #f4f4f5; /* zinc-100 */
            }

            .privacy-title::after {
                content: '✨';
                font-size: 1.5rem;
                position: absolute;
                top: -10px;
                margin-left: 10px;
            }

            .privacy-container {
                display: flex;
                gap: 30px;
                justify-content: center;
                align-items: stretch;
                flex-wrap: wrap;
            }

            .privacy-card {
                flex: 1;
                min-width: 300px;
                padding: 30px;
                border-radius: 30px;
                position: relative;
                box-shadow: 0 8px 20px rgba(0,0,0,0.05);
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .section-header {
                font-family: 'Fredoka', sans-serif;
                font-size: 1.8rem;
                text-align: center;
                margin-bottom: 25px;
                text-shadow: 2px 2px 0px rgba(255,255,255,0.5);
                line-height: 1.2;
            }
            
            .dark .section-header {
                text-shadow: none;
            }

            .info-block {
                background: rgba(255, 255, 255, 0.6);
                border: 2px solid rgba(0,0,0,0.1);
                border-radius: 20px;
                padding: 15px;
                margin-bottom: 20px;
                width: 100%;
                display: flex;
                align-items: flex-start;
                gap: 15px;
                transition: transform 0.2s;
            }
            
            .dark .info-block {
                background: rgba(255, 255, 255, 0.05);
                border-color: rgba(255,255,255,0.1);
            }

            .info-block:hover {
                transform: translateY(-3px);
            }

            .icon-box {
                font-size: 2rem;
                background: #fff;
                padding: 10px;
                border-radius: 50%;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 60px;
                height: 60px;
            }
            
            .dark .icon-box {
                background: #27272a;
            }

            .text-content h4 {
                margin: 0 0 5px 0;
                font-size: 1.1rem;
                font-weight: 700;
            }

            .text-content p {
                margin: 0;
                font-size: 0.95rem;
                line-height: 1.4;
                opacity: 0.9;
            }

            /* --- LEFT COLUMN (BLUE BUBBLE THEME) --- */
            .device-card {
                background-color: #e3f6fa;
                border: 4px solid #bcebf5;
                border-radius: 50px 50px 50px 50px; 
            }
            
            .dark .device-card {
                background-color: #164e63; /* cyan-900 */
                border-color: #0e7490; /* cyan-700 */
            }

            .device-card .section-header {
                color: #456d75;
            }
            
            .dark .device-card .section-header {
                color: #a5f3fc; /* cyan-200 */
            }

            .device-card .info-block {
                background-color: #fff5e6;
                border-color: #fdd8b5;
            }
            
            .dark .device-card .info-block {
                background-color: rgba(0,0,0,0.2);
                border-color: rgba(255,255,255,0.1);
            }

            /* --- RIGHT COLUMN (ORANGE CARD THEME) --- */
            .external-card {
                background-color: #fff8e6;
                border: 4px solid #ffe0b2;
                border-radius: 30px;
            }
            
            .dark .external-card {
                background-color: #431407; /* orange-950/brown */
                border-color: #9a3412; /* orange-800 */
            }

            .external-card .section-header {
                color: #8d6e63;
            }
            
            .dark .external-card .section-header {
                color: #fdba74; /* orange-300 */
            }

            .external-card .info-block {
                background-color: #fff;
                border-color: #ffe0b2;
            }
            
            .dark .external-card .info-block {
                background-color: rgba(0,0,0,0.2);
                border-color: rgba(255,255,255,0.1);
            }

            .decoration {
                position: absolute;
                font-size: 1.5rem;
                animation: float 3s ease-in-out infinite;
                z-index: 10;
            }
            
            .heart { top: 10px; left: 15px; }
            .star { bottom: 15px; right: 15px; animation-delay: 1s;}

            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-5px); }
                100% { transform: translateY(0px); }
            }

            /* --- MOBILE ADJUSTMENTS --- */
            @media (max-width: 768px) {
                .privacy-wrapper {
                    padding: 25px 15px;
                }

                .privacy-title {
                    font-size: 1.75rem;
                    margin-bottom: 25px;
                }
                
                .privacy-title::after {
                    font-size: 1.2rem;
                    top: -5px;
                }

                .privacy-container {
                    flex-direction: column;
                    gap: 20px;
                }

                .privacy-card {
                    min-width: 100%;
                    padding: 20px;
                    border-radius: 25px;
                    border-width: 3px;
                }
                
                .device-card {
                    /* Reset uneven bubble shape for mobile to save space */
                    border-radius: 30px;
                }

                .section-header {
                    font-size: 1.4rem;
                    margin-bottom: 15px;
                }

                .info-block {
                    padding: 12px;
                    margin-bottom: 12px;
                    gap: 12px;
                }

                .icon-box {
                    font-size: 1.4rem;
                    width: 45px;
                    height: 45px;
                    padding: 0;
                }

                .text-content h4 {
                    font-size: 1rem;
                    margin-bottom: 3px;
                }

                .text-content p {
                    font-size: 0.85rem;
                }

                .decoration {
                    font-size: 1.2rem;
                    top: 10px;
                }
            }
         `}</style>
         
         {/* Close Button */}
         <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full backdrop-blur-md transition-colors z-20"
         >
            <svg className="w-6 h-6 text-zinc-700 dark:text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
         </button>
         
         {/* Content */}
         <div className="privacy-wrapper">
            <h2 className="privacy-title">How We Protect Your Privacy</h2>

            <div className="privacy-container">
                
                {/* LEFT COLUMN: On Your Device */}
                <div className="privacy-card device-card">
                    <span className="decoration heart">❤️</span>
                    <h3 className="section-header">On Your Device</h3>
                    
                    <div className="info-block">
                        <div className="icon-box">🏠</div>
                        <div className="text-content">
                            <h4>100% Client-Side Isolation</h4>
                            <p>The app runs entirely on your device; we have no central chat database.</p>
                        </div>
                    </div>

                    <div className="info-block">
                        <div className="icon-box">👻</div>
                        <div className="text-content">
                            <h4>Ephemeral Storage Only</h4>
                            <p>Data is stored in temporary RAM and is permanently wiped on refresh.</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: External Processing */}
                <div className="privacy-card external-card">
                    <span className="decoration star">✨</span>
                    <h3 className="section-header">External Processing & Best Practices</h3>

                    <div className="info-block">
                        <div className="icon-box">☁️</div>
                        <div className="text-content">
                            <h4>Secure Google Gemini Processing</h4>
                            <p>Your inputs are sent for processing but are never logged or stored by us.</p>
                        </div>
                    </div>

                    <div className="info-block">
                        <div className="icon-box">🛡️</div>
                        <div className="text-content">
                            <h4>Protect Sensitive Information</h4>
                            <p>We recommend redacting PII like SSNs before pasting content.</p>
                        </div>
                    </div>

                </div>
            </div>
            
             {/* Footer Action */}
            <div className="mt-8 flex justify-center">
                <button 
                    onClick={onClose}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1 font-['Quicksand']"
                >
                    Continue to App
                </button>
            </div>
         </div>
         
      </div>
    </div>
  );
};

export default PrivacyPromoModal;