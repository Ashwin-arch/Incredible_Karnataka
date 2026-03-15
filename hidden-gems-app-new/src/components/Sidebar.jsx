import React from 'react';
import { CATEGORY_STYLES } from '../utils/icons';

export default function Sidebar({ categories, selectedCategories, onToggleCategory, totalPlaces, isOpen, onClose }) {
    const visiblePlaces = Object.keys(categories).reduce((acc, cat) => {
        return selectedCategories.has(cat) ? acc + categories[cat] : acc;
    }, 0);

    return (
        <>
            {/* Mobile Backdrop overlay */}
            <div 
                className={`md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9980] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Container - Drawer on mobile, fixed element on desktop */}
            <div className={`
                fixed top-0 left-0 bottom-0 z-[9990] w-84 flex flex-col gap-6 md:gap-6 
                p-4 md:p-0 md:absolute md:top-6 md:left-6 md:bottom-auto md:z-[9999] md:pointer-events-none
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            `}>
                
                {/* Mobile Drawer Header with Close Button */}
                <div className="md:hidden flex justify-between items-center glass px-6 py-4 rounded-2xl shrink-0">
                    <h2 className="text-white font-black text-sm uppercase tracking-widest">Filters</h2>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 flex flex-col justify-center items-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5 active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Desktop Header Panel (hidden on mobile) */}
                <div className="hidden md:block glass p-6 rounded-[24px] shadow-2xl animate-fade-in pointer-events-auto">
                    <h1 className="text-3xl font-black tracking-tighter text-white">
                        Hidden <span className="text-sky-400">Gems</span>
                    </h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] opacity-80">
                        Incredible Karnataka
                    </p>
                </div>

                <div className="mt-5 flex items-center gap-3 bg-white/5 border border-white/5 py-3 px-4 rounded-2xl">
                    <div className="flex h-2.5 w-2.5 relative">
                        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></div>
                        <div className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-white leading-none">
                            {visiblePlaces} Destinations
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                            of {totalPlaces} curated gems
                        </span>
                    </div>
                </div>

            {/* Categories Panel */}
            <div className="glass flex-1 md:flex-none p-6 rounded-[24px] pointer-events-auto md:max-h-[calc(100vh-220px)] overflow-y-auto shadow-2xl animate-fade-in custom-scroll" style={{ animationDelay: '0.1s' }}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white font-black text-sm uppercase tracking-widest">Categories</h2>
                    <button
                        onClick={() => {
                            const allSelected = selectedCategories.size === Object.keys(categories).length;
                            if (allSelected) {
                                Object.keys(categories).forEach(cat => onToggleCategory(cat, false));
                            } else {
                                Object.keys(categories).forEach(cat => onToggleCategory(cat, true));
                            }
                        }}
                        className="text-[10px] text-sky-400 hover:text-sky-300 font-black uppercase tracking-tighter transition-all hover:scale-110 active:scale-95 px-2 py-1 bg-sky-500/10 rounded-lg border border-sky-500/20"
                    >
                        {selectedCategories.size === Object.keys(categories).length ? 'Hide All' : 'Show All'}
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    {Object.entries(categories).map(([category, count]) => {
                        const isSelected = selectedCategories.has(category);
                        const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Default;

                        return (
                            <button
                                key={category}
                                onClick={() => onToggleCategory(category, !isSelected)}
                                className={`glass-card flex items-center justify-between p-4 group ${isSelected
                                    ? 'bg-white/10 border-white/20'
                                    : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-3.5 h-3.5 rounded-full ring-4 ring-black/20`}
                                        style={{ backgroundColor: style.color }}
                                    />
                                    <span className={`text-sm font-bold tracking-tight ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                        {category}
                                    </span>
                                </div>
                                <div className={`flex items-center justify-center min-w-[28px] h-6 rounded-lg text-[10px] font-black transition-all ${isSelected
                                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                    : 'bg-white/5 text-slate-500'
                                    }`}>
                                    {count}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer Tip (hidden on mobile, taking up space) */}
            <div className="hidden md:block glass px-5 py-3 rounded-2xl self-start pointer-events-auto cursor-help hover:scale-105 active:scale-95 transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <p className="text-[10px] font-bold text-sky-300 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-sm">✨</span> Tap markers to discover
                </p>
            </div>

            </div>
        </>
    );
}
