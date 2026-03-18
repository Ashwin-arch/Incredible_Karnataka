import React, { useState, useEffect, useRef } from 'react';

export default function BottomSheet({ feature, onClose }) {
    // states: 'closed', 'peek', 'half', 'full'
    const [sheetState, setSheetState] = useState('half');
    const [startY, setStartY] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    
    const sheetRef = useRef(null);
    const contentRef = useRef(null);

    // Reset state when feature changes
    useEffect(() => {
        if (feature) {
            setSheetState('half');
            setCurrentY(0);
            
            // Scroll content back to top
            if (contentRef.current) {
                contentRef.current.scrollTop = 0;
            }
        }
    }, [feature]);

    if (!feature) return null;

    const { name, category, district, description } = feature.properties;

    // Handle touch/mouse drag
    const handleDragStart = (e) => {
        // Don't drag if we're scrolling the content area
        if (e.target.closest('.bottom-sheet-content-scroll') && contentRef.current?.scrollTop > 0) {
            return;
        }
        
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setStartY(clientY);
        setIsDragging(true);
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const deltaY = clientY - startY;
        
        // Prevent dragging up past fully open
        if (sheetState === 'full' && deltaY < 0) {
            setCurrentY(deltaY * 0.2); // resistance
            return;
        }
        
        setCurrentY(deltaY);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        
        // Determine snap point based on drag distance and current state
        if (currentY > 100) {
            // Dragged down significantly
            if (sheetState === 'full') setSheetState('half');
            else if (sheetState === 'half') onClose();
            else if (sheetState === 'peek') onClose();
            else onClose();
        } else if (currentY < -100) {
            // Dragged up significantly
            if (sheetState === 'peek') setSheetState('half');
            else if (sheetState === 'half') setSheetState('full');
            else setSheetState('full');
        } else {
            // Tap or small drag - toggle state
            if (currentY === 0) {
                if (sheetState === 'half') setSheetState('full');
                else if (sheetState === 'full') setSheetState('half');
            }
        }
        
        setCurrentY(0);
    };

    // Calculate dynamic transform based on state and current drag
    const getTransform = () => {
        let baseTranslate = '100%';
        
        if (sheetState === 'peek') baseTranslate = '85%';
        if (sheetState === 'half') baseTranslate = '50%';
        if (sheetState === 'full') baseTranslate = '5%';
        
        if (isDragging) {
            return `translateY(calc(${baseTranslate} + ${currentY}px))`;
        }
        
        return `translateY(${baseTranslate})`;
    };

    return (
        <>
            {/* Backdrop overlay (only in full state) */}
            <div 
                className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${sheetState === 'full' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            
            {/* Bottom Sheet Container */}
            <div 
                ref={sheetRef}
                className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[95vh] z-[9999] bg-slate-900 rounded-t-[32px] border-t border-x border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden ${isDragging ? 'transition-none' : 'transition-transform duration-300 cubic-bezier(0.32, 0.72, 0, 1)'}`}
                style={{ transform: getTransform() }}
            >
                {/* Reusable Drag Hook Area */}
                <div 
                    className="w-full pt-4 pb-2 flex justify-center cursor-grab active:cursor-grabbing shrink-0 relative z-20"
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                >
                    <div className="w-16 h-1.5 bg-white/20 hover:bg-white/40 rounded-full transition-colors" />
                </div>
                
                {/* Top Action Bar */}
                <div className="px-5 pb-3 flex justify-between items-center shrink-0 border-b border-white/5">
                    <button 
                        onClick={onClose}
                        className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 hover:bg-white/5 px-3 py-1.5 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Map
                    </button>
                    
                    <button 
                        onClick={() => sheetState === 'full' ? setSheetState('half') : setSheetState('full')}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transform transition-transform ${sheetState === 'full' ? 'rotate-180' : ''}`}>
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content Area */}
                <div 
                    ref={contentRef}
                    className="flex-1 overflow-y-auto custom-scroll bottom-sheet-content-scroll pb-10"
                >
                    {/* Header Image */}
                    {feature.properties.image_url && (
                        <div className="w-full h-56 md:h-64 relative shrink-0">
                            <img 
                                src={feature.properties.image_url} 
                                alt={name}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                        </div>
                    )}
                    
                    {/* Main Content Body */}
                    <div className={`px-6 ${feature.properties.image_url ? '-mt-16' : 'mt-4'} relative z-10 flex flex-col gap-6`}>
                        
                        {/* Title Section */}
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-sky-500/20 text-sky-400 border border-sky-500/30 backdrop-blur-md">
                                    {category}
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-900/50 backdrop-blur-md px-2 py-1 rounded-lg">
                                    {district}
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
                                {name}
                            </h2>
                        </div>
                        
                        {/* Detailed Description */}
                        <div className="text-sm md:text-base text-slate-300 leading-relaxed font-medium opacity-90 border-l-2 border-sky-500/30 pl-4 py-1">
                            {feature.properties.detailed_description || description}
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* 3 Tourism Highlights */}
                        {feature.properties.highlights && (
                            <div>
                                <div className="card-section-title text-sky-400 mb-4">✨ Key Highlights</div>
                                <div className="flex flex-col gap-3">
                                    {feature.properties.highlights.map((h, i) => (
                                        <div key={i} className="flex items-start gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="mt-1 w-2 h-2 shrink-0 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                                            <span className="text-sm text-slate-200 font-medium leading-snug">{h}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tourism Type & Nearby Attractions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {feature.properties.tourism_type && (
                                <div>
                                    <div className="card-section-title mb-3">🏷️ Tourism Type</div>
                                    <div className="flex flex-wrap gap-2">
                                        {feature.properties.tourism_type.split('/').map((t, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                                                {t.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {feature.properties.nearby_attractions && (
                                <div>
                                    <div className="card-section-title mb-3">📍 Nearby</div>
                                    <div className="flex flex-wrap gap-2">
                                        {feature.properties.nearby_attractions.map((n, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                                                {n}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Google Maps Link CTA */}
                        <div className="mt-4 pt-4 sticky bottom-0 bg-gradient-to-t from-slate-900 via-slate-900 pb-6 z-20">
                            <a 
                                href={feature.properties.google_maps_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white text-[12px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_30px_rgba(56,189,248,0.3)] active:scale-95 flex justify-center items-center gap-3 group"
                            >
                                <span>Get Directions</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    );
}
