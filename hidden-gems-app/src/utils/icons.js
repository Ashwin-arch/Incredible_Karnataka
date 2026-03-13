import L from 'leaflet';

const createIconSvg = (svgPath, color) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
    <g transform="scale(0.55) translate(9.5, 9.5)">
      ${svgPath}
    </g>
  </svg>
`;

export const CATEGORY_STYLES = {
    Religious: {
        color: '#f97316', // orange-500
        bg: 'bg-orange-500',
        text: 'text-orange-500',
        path: '<path d="M4 15h16M12 3v18M8 9h8" />'
    },
    Nature: {
        color: '#22c55e', // green-500
        bg: 'bg-green-500',
        text: 'text-green-500',
        path: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 14.8V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4.2"/><path d="M8 13.8V7a4 4 0 1 1 8 0v6.8"/>'
    },
    Heritage: {
        color: '#3b82f6', // blue-500
        bg: 'bg-blue-500',
        text: 'text-blue-500',
        path: '<path d="m4 9 8-4 8 4M10 9v7M14 9v7M4 22h16M2 18h20" />'
    },
    Adventure: {
        color: '#a855f7', // purple-500
        bg: 'bg-purple-500',
        text: 'text-purple-500',
        path: '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>'
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
        className: 'custom-leaflet-icon',
        html: `<div class="marker-pin">${createIconSvg(style.path, style.color)}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -30],
        tooltipAnchor: [14, -14]
    });
};
