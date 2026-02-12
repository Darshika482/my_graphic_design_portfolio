import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import ThreeBackground from './components/ThreeBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WorkSection from './components/WorkSection';
import About from './components/About';
import Contact from './components/Contact';
import CollectionPage from './components/CollectionPage';
import CustomCursor from './components/CustomCursor';
import Admin from './components/admin/Admin';
import { Category } from './types';
import { CATEGORIES } from './constants';
import { useImageProtection } from './hooks/useImageProtection';

const App: React.FC = () => {
  // Enable image protection globally
  useImageProtection();
  
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState<Category | null>(null);

  // Check if admin route
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  // Resolve hash to a collection category or admin route
  const resolveHash = useCallback(() => {
    const hash = window.location.hash;
    
    // Check for admin routes
    if (hash.includes('/admin')) {
      setIsAdminRoute(true);
      setActiveCollection(null);
      return;
    }
    
    setIsAdminRoute(false);
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

  // Add global CSS for image protection
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      img, video {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: auto !important;
      }
      
      img::selection, video::selection {
        background: transparent !important;
      }
      
      img::-moz-selection, video::-moz-selection {
        background: transparent !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  // Render admin panel if on admin route
  if (isAdminRoute) {
    return <Admin />;
  }

  return (
    <main className="relative w-full min-h-screen bg-stone-50 text-stone-900 selection:bg-accent selection:text-white">
      <CustomCursor />
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