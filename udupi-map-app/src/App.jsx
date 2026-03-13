import { useState, useMemo } from 'react'
import Map from './components/Map'
import Sidebar from './components/Sidebar'

// Static GeoJSON Data generated from Python
import geojsonData from './data/udupi_places.json'

function App() {
  const UDUPI_CENTER = [13.3409, 74.7421];

  // Calculate unique categories and their total counts from the raw GeoJSON Data
  const categories = useMemo(() => {
    const counts = {};
    geojsonData.features.forEach(feature => {
      const cat = feature.properties.category;
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, []);

  // Set storing all active categories
  const [selectedCategories, setSelectedCategories] = useState(() =>
    new Set(Object.keys(categories))
  );

  // Toggle filter logic
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

      {/* Absolute floating Sidebar */}
      <Sidebar
        categories={categories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        totalPlaces={geojsonData.features.length}
      />

      {/* Main Map Engine */}
      <div className="w-full h-full relative z-0">
        <Map
          data={geojsonData}
          selectedCategories={selectedCategories}
          defaultCenter={UDUPI_CENTER}
        />
      </div>

    </div>
  )
}

export default App
