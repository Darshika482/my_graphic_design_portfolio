import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { Category } from '../types';
import ProjectOverlay from './ProjectOverlay';

interface CollectionPageProps {
  category: Category;
  onBack: () => void;
}

const CollectionPage: React.FC<CollectionPageProps> = ({ category, onBack }) => {
  const [overlayCategory, setOverlayCategory] = useState<Category | null>(null);
  const [overlayIndex, setOverlayIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Scroll to top when page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const allImages = (() => {
    const combined = [
      { id: 'hero', url: category.heroImage, title: category.title },
      ...category.gallery,
    ];
    const seen = new Set<string>();
    return combined.filter(img => {
      if (seen.has(img.url)) return false;
      seen.add(img.url);
      return true;
    });
  })();

  const handleImageClick = (index: number) => {
    setOverlayCategory(category);
    setOverlayIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseOverlay = () => {
    setOverlayCategory(null);
    document.body.style.overflow = 'unset';
  };

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 min-h-screen bg-stone-50"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-stone-50/80 backdrop-blur-lg border-b border-stone-200/60">
          <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center gap-6">
            <button
              onClick={onBack}
              className="group flex items-center gap-2 text-stone-500 hover:text-accent transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm uppercase tracking-wider font-medium hidden sm:inline">Back</span>
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-serif text-stone-900 truncate">{category.title}</h1>
              <p className="text-xs text-stone-400 tracking-wider uppercase mt-0.5">{allImages.length} works</p>
            </div>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="masonry-grid">
            {allImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="masonry-item"
              >
                <div
                  onClick={() => handleImageClick(index)}
                  className="group relative cursor-pointer overflow-hidden rounded-lg bg-stone-100"
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => handleImageLoad(image.id)}
                    className={`w-full h-auto block transition-all duration-500 ease-out group-hover:scale-[1.03] ${loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
                      }`}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <p className="text-white text-sm font-medium tracking-wide">{image.title}</p>
                  </div>
                  {/* Loading skeleton */}
                  {!loadedImages.has(image.id) && (
                    <div className="absolute inset-0 bg-stone-200 animate-pulse" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-12 border-t border-stone-200/60">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-stone-500 hover:text-accent transition-colors text-sm uppercase tracking-wider font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </button>
        </div>
      </motion.div>

      {/* Slideshow Overlay */}
      {overlayCategory && (
        <ProjectOverlay
          category={overlayCategory}
          initialIndex={overlayIndex}
          onClose={handleCloseOverlay}
        />
      )}
    </>
  );
};

export default CollectionPage;
