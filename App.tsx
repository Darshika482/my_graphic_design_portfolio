import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import ThreeBackground from './components/ThreeBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WorkSection from './components/WorkSection';
import About from './components/About';
import Contact from './components/Contact';
import CollectionPage from './components/CollectionPage';
import { Category } from './types';
import { CATEGORIES } from './constants';

const App: React.FC = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState<Category | null>(null);

  // Resolve hash to a collection category
  const resolveHash = useCallback(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#\/collection\/(.+)$/);
    if (match) {
      const cat = CATEGORIES.find(c => c.id === match[1]);
      setActiveCollection(cat || null);
    } else {
      setActiveCollection(null);
    }
  }, []);

  // Listen for hash changes (browser back/forward)
  useEffect(() => {
    resolveHash();
    window.addEventListener('hashchange', resolveHash);
    return () => window.removeEventListener('hashchange', resolveHash);
  }, [resolveHash]);

  const handleViewCollection = (category: Category) => {
    window.location.hash = `/collection/${category.id}`;
  };

  const handleBackToPortfolio = (categoryId: string) => {
    // Set hash to the category id so browser scrolls to that section
    window.location.hash = `#${categoryId}`;
  };

  const currentIndex = activeCollection
    ? CATEGORIES.findIndex((c) => c.id === activeCollection.id)
    : -1;

  const previousCategory =
    currentIndex > 0 ? CATEGORIES[currentIndex - 1] : null;

  const nextCategory =
    currentIndex >= 0 && currentIndex < CATEGORIES.length - 1
      ? CATEGORIES[currentIndex + 1]
      : null;

  return (
    <main className="relative w-full min-h-screen bg-stone-50 text-stone-900 selection:bg-accent selection:text-white">
      <ThreeBackground />
      {!activeCollection && <Navbar isOverlayOpen={isOverlayOpen} />}

      <AnimatePresence mode="wait">
        {activeCollection ? (
          <CollectionPage
            key={activeCollection.id}
            category={activeCollection}
            onBack={handleBackToPortfolio}
            previousCategory={previousCategory}
            nextCategory={nextCategory}
            onNavigateCollection={handleViewCollection}
          />
        ) : (
          <div key="main" className="relative z-10">
            <Hero />
            <WorkSection onOverlayToggle={setIsOverlayOpen} onViewCollection={handleViewCollection} />
            <About />
            <Contact />
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default App;