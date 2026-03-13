import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, LayersControl, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getIconForCategory } from '../utils/icons';

export default function Map({ data, selectedCategories, defaultCenter }) {
    // Filter features based on selected categories
    const visibleFeatures = data.features.filter(f =>
        selectedCategories.has(f.properties.category)
    );

    return (
        <MapContainer
            center={defaultCenter}
            zoom={14}
            className="w-full h-full absolute inset-0 z-0"
            zoomControl={false} // We will add it to bottom right instead
        >
            <LayersControl position="topright">
                {/* CARTO Dark Base Map (Default) */}
                <LayersControl.BaseLayer checked name="Dark Mode Theme">
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        maxZoom={19}
                    />
                </LayersControl.BaseLayer>

                {/* Regular OpenStreetMap Base */}
                <LayersControl.BaseLayer name="Light Mode Theme (OSM)">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maxZoom={19}
                    />
                </LayersControl.BaseLayer>

                {/* Esri Satellite Map */}
                <LayersControl.BaseLayer name="Satellite Theme">
                    <TileLayer
                        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        maxZoom={19}
                    />
                </LayersControl.BaseLayer>
            </LayersControl>

            <ZoomControl position="bottomright" />

            {/* Render Markers */}
            {visibleFeatures.map(feature => {
                const { coordinates } = feature.geometry;
                const { name, category, address, phone, website } = feature.properties;
                const position = [coordinates[1], coordinates[0]]; // Leaflet uses [lat, lng]

                return (
                    <Marker
                        key={`${feature.properties.osm_id}-${name}`}
                        position={position}
                        icon={getIconForCategory(category)}
                    >
                        <Tooltip direction="top" offset={[0, -15]} opacity={1}>
                            <div className="font-semibold">{name}</div>
                            <div className="text-xs text-slate-300 opacity-80">{category}</div>
                        </Tooltip>

                        <Popup closeButton={true}>
                            <div className="flex flex-col gap-1 min-w-[200px]">
                                <h3 className="text-lg font-bold text-white mb-1 tracking-tight">{name}</h3>

                                <div className="inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-700/60 w-max mb-2">
                                    {category}
                                </div>

                                {address && (
                                    <p className="text-sm text-slate-300 flex items-start gap-2 mt-1">
                                        <span className="opacity-60 shrink-0 mt-0.5">📍</span>
                                        <span className="leading-snug">{address}</span>
                                    </p>
                                )}

                                {phone && (
                                    <p className="text-sm text-slate-300 flex items-center gap-2 mt-1">
                                        <span className="opacity-60 shrink-0">📞</span>
                                        <span>{phone}</span>
                                    </p>
                                )}

                                {website && (
                                    <a
                                        href={website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-2 mt-2 transition-colors"
                                    >
                                        <span className="opacity-60 shrink-0">🌐</span>
                                        <span className="underline decoration-sky-400/40 underline-offset-2">Visit Website</span>
                                    </a>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
