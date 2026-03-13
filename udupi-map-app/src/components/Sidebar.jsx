import React from 'react';
import { CATEGORY_STYLES } from '../utils/icons';

export default function Sidebar({ categories, selectedCategories, onToggleCategory, totalPlaces }) {
    // Compute how many places are currently visible
    const visiblePlaces = Object.keys(categories).reduce((acc, cat) => {
        return selectedCategories.has(cat) ? acc + categories[cat] : acc;
    }, 0);

    return (
        <div className="absolute top-4 left-4 z-[9999] w-80 flex flex-col gap-4 pointer-events-none">

            {/* Header Card */}
            <div className="glass-panel p-5 rounded-2xl pointer-events-auto">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent mb-1">
                    Udupi Explorer
                </h1>
                <p className="text-slate-300 text-sm font-medium mb-3">
                    Interactive Map Visualization
                </p>

                <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 p-2 rounded-lg">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Showing {visiblePlaces} of {totalPlaces} places
                </div>
            </div>

            {/* Filter Card */}
            <div className="glass-panel p-5 rounded-2xl pointer-events-auto max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white font-semibold text-lg">Categories</h2>
                    <button
                        onClick={() => {
                            // Toggle all logic
                            const allSelected = selectedCategories.size === Object.keys(categories).length;
                            if (allSelected) {
                                // Keep only the first one to avoid empty map (or clear all, choice is ours)
                                Object.keys(categories).forEach(cat => onToggleCategory(cat, false));
                            } else {
                                Object.keys(categories).forEach(cat => onToggleCategory(cat, true));
                            }
                        }}
                        className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
                    >
                        {selectedCategories.size === Object.keys(categories).length ? 'Hide All' : 'Show All'}
                    </button>
                </div>

                <div className="flex flex-col gap-2 relative">
                    {Object.entries(categories).map(([category, count]) => {
                        const isSelected = selectedCategories.has(category);
                        const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Default;

                        return (
                            <button
                                key={category}
                                onClick={() => onToggleCategory(category, !isSelected)}
                                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 border ${isSelected
                                        ? 'bg-slate-800/80 border-slate-600/50 shadow-md shadow-black/20'
                                        : 'bg-slate-900/40 border-slate-800/50 opacity-60 hover:opacity-80'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-4 h-4 rounded-full shadow-sm`}
                                        style={{ backgroundColor: style.color, opacity: isSelected ? 1 : 0.5 }}
                                    />
                                    <span className={`font-medium ${isSelected ? 'text-slate-100' : 'text-slate-400'}`}>
                                        {category}
                                    </span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-md font-semibold ${isSelected ? 'bg-slate-700/50 text-slate-300' : 'bg-transparent text-slate-500'
                                    }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
