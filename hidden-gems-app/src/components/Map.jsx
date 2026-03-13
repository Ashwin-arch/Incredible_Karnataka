import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, LayersControl, ZoomControl, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getIconForCategory } from '../utils/icons';
import karnatakaBoundary from '../data/karnataka_boundary.json';

export default function Map({ data, selectedCategories, defaultCenter }) {
    const visibleFeatures = data.features.filter(f =>
        selectedCategories.has(f.properties.category)
    );

    return (
        <MapContainer
            center={defaultCenter}
            zoom={7}
            className="w-full h-full absolute inset-0 z-0"
            zoomControl={false}
        >
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Dark Mode Theme">
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        maxZoom={19}
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Light Mode Theme (OSM)">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maxZoom={19}
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Satellite Theme">
                    <TileLayer
                        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        maxZoom={19}
                    />
                </LayersControl.BaseLayer>
            </LayersControl>

            <ZoomControl position="bottomright" />

            {/* Karnataka State Outline */}
            <GeoJSON
                data={karnatakaBoundary}
                style={() => ({
                    color: '#38bdf8', // sky-400
                    weight: 3,
                    opacity: 0.6,
                    fillColor: '#38bdf8',
                    fillOpacity: 0.05
                })}
                interactive={false}
            />

            {/* Outline highlight (inner glow effect) */}
            <GeoJSON
                data={karnatakaBoundary}
                style={() => ({
                    color: '#bae6fd', // sky-200
                    weight: 1,
                    opacity: 0.3,
                    fillColor: 'transparent',
                    fillOpacity: 0
                })}
                interactive={false}
            />

            {visibleFeatures.map((feature, idx) => {
                const { coordinates } = feature.geometry;
                const { name, category, district, description } = feature.properties;
                const position = [coordinates[1], coordinates[0]];

                return (
                    <Marker
                        key={`${idx}-${name}`}
                        position={position}
                        icon={getIconForCategory(category)}
                    >
                        <Tooltip direction="top" offset={[0, -15]} opacity={1} className="glass">
                            <div className="font-bold text-sm">{name}</div>
                            <div className="text-[10px] text-sky-200 font-medium opacity-90">{district}</div>
                        </Tooltip>

                        <Popup className="glass-popup" closeButton={false}>
                            <div className="flex flex-col gap-0 w-[320px] max-h-[520px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl animate-fade-in bg-slate-900">
                                {/* Place Image */}
                                {feature.properties.image_url && (
                                    <div className="w-full h-48 overflow-hidden relative group/img flex-shrink-0">
                                        <img
                                            src={feature.properties.image_url}
                                            alt={name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                                            crossOrigin="anonymous"
                                            referrerPolicy="no-referrer"
                                            onError={(e) => {
                                                console.error("Image failed to load:", feature.properties.image_url);
                                                e.target.parentNode.style.display = 'none';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                    </div>
                                )}

                                {/* Header with High-Contrast Gradient */}
                                <div className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-white/10 relative z-10">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl -mr-16 -mt-16 rounded-full" />
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-sky-500/20 text-sky-400 border border-sky-500/30">
                                            {category}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
                                            {district}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white leading-normal tracking-tight drop-shadow-lg relative z-10">
                                        {name}
                                    </h3>
                                </div>

                                {/* Content Body with custom scroll */}
                                <div className="p-5 bg-slate-900/90 backdrop-blur-xl overflow-y-auto custom-scroll flex flex-col gap-5">
                                    {/* Detailed Description */}
                                    <div className="text-sm text-slate-300 leading-relaxed font-medium opacity-90 border-l-2 border-sky-500/30 pl-4">
                                        {feature.properties.detailed_description || description}
                                    </div>

                                    {/* 3 Tourism Highlights */}
                                    {feature.properties.highlights && (
                                        <div>
                                            <div className="card-section-title">✨ Key Highlights</div>
                                            <div className="flex flex-col">
                                                {feature.properties.highlights.map((h, i) => (
                                                    <div key={i} className="highlight-item">
                                                        <div className="highlight-icon" />
                                                        <span className="text-xs text-slate-200 font-medium">{h}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tourism Type & Nearby Attractions */}
                                    <div className="grid grid-cols-1 gap-4">
                                        {feature.properties.tourism_type && (
                                            <div>
                                                <div className="card-section-title">🏷️ Tourism Type</div>
                                                <div className="badge-grid">
                                                    {feature.properties.tourism_type.split('/').map((t, i) => (
                                                        <span key={i} className="glass-badge">{t.trim()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {feature.properties.nearby_attractions && (
                                            <div>
                                                <div className="card-section-title">📍 Nearby</div>
                                                <div className="badge-grid">
                                                    {feature.properties.nearby_attractions.map((n, i) => (
                                                        <span key={i} className="glass-badge">{n}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Google Maps Link CTA */}
                                    <a
                                        href={feature.properties.google_maps_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 w-full py-3 bg-sky-500 hover:bg-sky-400 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-sky-500/30 active:scale-95 flex justify-center items-center gap-2 group"
                                    >
                                        <span>Directions & Photos</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
