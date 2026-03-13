import { useState, useMemo } from 'react'
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import hiddenGemsData from './data/hidden_places.json'

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
            <Sidebar
                categories={categories}
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                totalPlaces={hiddenGemsData.features.length}
            />

            <div className="w-full h-full relative z-0">
                <Map
                    data={hiddenGemsData}
                    selectedCategories={selectedCategories}
                    defaultCenter={KARNATAKA_CENTER}
                />
            </div>
        </div>
    )
}

export default App
