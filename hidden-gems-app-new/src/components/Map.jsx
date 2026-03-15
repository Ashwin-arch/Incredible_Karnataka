import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, LayersControl, ZoomControl, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getIconForCategory } from '../utils/icons';
import karnatakaBoundary from '../data/karnataka_boundary.json';

export default function Map({ data, selectedCategories, defaultCenter, onSelectFeature }) {
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
                        eventHandlers={{ click: () => onSelectFeature(feature) }}
                    >
                        <Tooltip direction="top" offset={[0, -15]} opacity={1} className="glass">
                            <div className="font-bold text-sm">{name}</div>
                            <div className="text-[10px] text-sky-200 font-medium opacity-90">{district}</div>
                        </Tooltip>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
