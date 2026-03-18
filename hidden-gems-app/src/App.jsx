import { useState, useMemo } from 'react'
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import hiddenGemsData from './data/hidden_places.json'
import { Trophy } from 'lucide-react';
import BottomSheet from './components/BottomSheet';
import MobileHeader from './components/MobileHeader';

function App() {
    const KARNATAKA_CENTER = [14.8, 75.8];

    const categories = useMemo(() => {
        const counts = {};
        hiddenGemsData.features.forEach(feature => {
            const cat = feature.properties.category;
            if (cat) {
                counts[cat] = (counts[cat] || 0) + 1;
            }
        });
        return counts;
    }, []);

    const [selectedCategories, setSelectedCategories] = useState(() =>
        new Set(Object.keys(categories))
    );

    const [selectedFeature, setSelectedFeature] = useState(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleCategory = (category, isSelected) => {
        setSelectedCategories(prev => {
            const next = new Set(prev);
            if (isSelected) {
                next.add(category);
            } else {
                next.delete(category);
            }
            return next;
        });
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-slate-900 font-sans text-slate-100">

            <MobileHeader 
                visiblePlaces={Object.keys(categories).reduce((acc, cat) => selectedCategories.has(cat) ? acc + categories[cat] : acc, 0)}
                totalPlaces={hiddenGemsData.features.length}
                onToggleSidebar={() => setIsMobileSidebarOpen(true)}
            />

            <Sidebar
                categories={categories}
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                totalPlaces={hiddenGemsData.features.length}
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />

            <div className="w-full h-full relative z-0">
                <Map
                    data={hiddenGemsData}
                    selectedCategories={selectedCategories}
                    defaultCenter={KARNATAKA_CENTER}
                    onSelectFeature={setSelectedFeature}
                />
            </div>

            <BottomSheet 
                feature={selectedFeature} 
                onClose={() => setSelectedFeature(null)} 
            />
        </div>
    )
}

export default App
