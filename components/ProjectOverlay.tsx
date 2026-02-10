import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Category } from '../types';

interface ProjectOverlayProps {
  category: Category | null;
  initialIndex: number;
  onClose: () => void;
}

const ProjectOverlay: React.FC<ProjectOverlayProps> = ({ category, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex === -1 ? 0 : initialIndex);

  // Professional zoom (desktop): click to toggle zoom, cursor sets zoom origin
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [zoomOrigin, setZoomOrigin] = React.useState('50% 50%');
  const imageContainerRef = React.useRef<HTMLDivElement | null>(null);

  // Combine hero and gallery for the slideshow
  const allImages = category 
    ? [{ id: 'hero', url: category.heroImage, title: category.title }, ...category.gallery] 
    : [];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < allImages.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex(prev => Math.min(prev + 1, allImages.length - 1));
      if (e.key === 'ArrowLeft') setCurrentIndex(prev => Math.max(prev - 1, 0));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allImages.length, onClose]);

  if (!category) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-stone-900/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
        onClick={onClose}
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 p-2"
        >
          <X size={32} />
        </button>

        <div className="relative w-full max-w-7xl h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
          
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-[80vh] flex items-center justify-center cursor-zoom-in md:cursor-zoom-in"
            ref={imageContainerRef}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed((prev) => !prev);
            }}
            onMouseMove={(e) => {
              if (!imageContainerRef.current || !isZoomed) return;

              const rect = imageContainerRef.current.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;

              const xPercent = (x / rect.width) * 100;
              const yPercent = (y / rect.height) * 100;

              setZoomOrigin(`${xPercent}% ${yPercent}%`);
            }}
          >
            {/* Magnifying glass icon hint (desktop) */}
            <div className="hidden md:flex absolute top-6 right-6 items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 text-xs tracking-[0.2em] uppercase text-white/80 backdrop-blur-sm pointer-events-none">
              <Search className="w-3.5 h-3.5" />
              <span>Zoom</span>
            </div>

            <img 
              src={allImages[currentIndex].url} 
              alt={allImages[currentIndex].title} 
              className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-300 ease-out md:pointer-events-auto"
              style={{
                transform: isZoomed ? 'scale(1.6)' : 'scale(1)',
                transformOrigin: zoomOrigin,
              }}
            />
          </motion.div>

          <div className="mt-6 text-center space-y-1">
            <h3 className="text-white text-2xl font-serif">{allImages[currentIndex].title}</h3>
            <p className="text-stone-400 text-sm tracking-widest uppercase">
              {currentIndex === 0 ? 'Hero Image' : `Gallery Image ${currentIndex} / ${allImages.length - 1}`}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-4">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full bg-white/10 backdrop-blur text-white pointer-events-auto transition-all ${currentIndex === 0 ? 'opacity-0' : 'opacity-100 hover:bg-white/20'}`}
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={handleNext}
              disabled={currentIndex === allImages.length - 1}
              className={`p-3 rounded-full bg-white/10 backdrop-blur text-white pointer-events-auto transition-all ${currentIndex === allImages.length - 1 ? 'opacity-0' : 'opacity-100 hover:bg-white/20'}`}
            >
              <ChevronRight size={32} />
            </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectOverlay;