import L from 'leaflet';

// SVGs using Lucide icons styles but hardcoded for the Leaflet divIcon rendering
const createIconSvg = (svgPath, color) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
    <g transform="scale(0.55) translate(9.5, 9.5)">
      ${svgPath}
    </g>
  </svg>
`;

export const CATEGORY_STYLES = {
    Temple: {
        color: '#f97316', // orange-500
        bg: 'bg-orange-500',
        text: 'text-orange-500',
        path: '<path d="M4 15h16M12 3v18M8 9h8" />' // simple symbol
    },
    Beach: {
        color: '#0ea5e9', // sky-500
        bg: 'bg-sky-500',
        text: 'text-sky-500',
        path: '<path d="M2 12h20M12 2v20M5 5l14 14M19 5L5 19" />'
    },
    Restaurant: {
        color: '#ef4444', // red-500
        bg: 'bg-red-500',
        text: 'text-red-500',
        path: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />' // utensils
    },
    'Tourist Attraction': {
        color: '#22c55e', // green-500
        bg: 'bg-green-500',
        text: 'text-green-500',
        path: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3" />' // camera
    },
    University: {
        color: '#a855f7', // purple-500
        bg: 'bg-purple-500',
        text: 'text-purple-500',
        path: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5" />' // graduation-cap
    },
    Museum: {
        color: '#3b82f6', // blue-500
        bg: 'bg-blue-500',
        text: 'text-blue-500',
        path: '<path d="m4 9 8-4 8 4M10 9v7M14 9v7M4 22h16M2 18h20" />' // landmark
    },
    Hotel: {
        color: '#14b8a6', // teal-500
        bg: 'bg-teal-500',
        text: 'text-teal-500',
        path: '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />' // bed
    },
    Hospital: {
        color: '#be123c', // rose-700
        bg: 'bg-rose-700',
        text: 'text-rose-700',
        path: '<path d="M12 5v14M5 12h14" />' // plus
    },
    Default: {
        color: '#64748b', // slate-500
        bg: 'bg-slate-500',
        text: 'text-slate-500',
        path: '<circle cx="12" cy="12" r="10" />'
    }
};

export const getIconForCategory = (category) => {
    const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Default;

    return L.divIcon({
        className: 'custom-leaflet-icon', // no base styles
        html: `<div class="marker-pin">${createIconSvg(style.path, style.color)}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -30],
        tooltipAnchor: [14, -14]
    });
};
