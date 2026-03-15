import React from 'react';

export default function MobileHeader({ visiblePlaces, totalPlaces, onToggleSidebar }) {
    return (
        <div className="fixed top-4 left-4 right-4 z-[9900] md:hidden">
            <div className="glass px-5 py-3 rounded-2xl flex justify-between items-center shadow-2xl animate-fade-in">
                
                {/* Compact Title Area */}
                <div className="flex flex-col gap-0.5">
                    <h1 className="text-xl font-black tracking-tighter text-white leading-none">
                        Hidden <span className="text-sky-400">Gems</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                         <div className="flex h-1.5 w-1.5 relative">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></div>
                            <div className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></div>
                        </div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest leading-none">
                            {visiblePlaces}/{totalPlaces} Locations
                        </p>
                    </div>
                </div>

                {/* Filter Toggle Button */}
                <button 
                    onClick={onToggleSidebar}
                    className="flex items-center gap-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 px-4 py-2 rounded-xl transition-colors border border-sky-500/30 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
                </button>

            </div>
        </div>
    );
}
