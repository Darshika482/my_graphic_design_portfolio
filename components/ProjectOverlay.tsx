import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Search, ArrowUpRight } from 'lucide-react';
import { Category } from '../types';

interface ProjectOverlayProps {
  category: Category | null;
  initialIndex: number;
  onClose: () => void;
}

const ProjectOverlay: React.FC<ProjectOverlayProps> = ({ category, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  // Unified zoom state for both desktop and touch
  const [zoomScale, setZoomScale] = React.useState(1);
  const [zoomOrigin, setZoomOrigin] = React.useState('50% 50%');

  // Panning state (mainly for touch / when zoomed)
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const lastTouchRef = React.useRef<{ x: number; y: number } | null>(null);

  // Pinch-zoom state for touch
  const pinchRef = React.useRef<{
    distance: number;
    scale: number;
    centerX: number;
    centerY: number;
  } | null>(null);

  const imageContainerRef = React.useRef<HTMLDivElement | null>(null);

  // Use only gallery images for the slideshow (no separate hero slide)
  const allImages = category ? category.gallery : [];

  const current = allImages[currentIndex];
  const isVideo =
    !!current &&
    (current.mediaType === 'video' || /\.mp4$/i.test(current.url));

  const resetZoom = () => {
    setZoomScale(1);
    setOffset({ x: 0, y: 0 });
    pinchRef.current = null;
    lastTouchRef.current = null;
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < allImages.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetZoom();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      resetZoom();
    }
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

  // Desktop click-to-zoom (kept separate from touch pinch behaviour)
  const handleDesktopToggleZoom = (e: React.MouseEvent) => {
    if (isVideo || !imageContainerRef.current) return;
    e.stopPropagation();

    // If already zoomed in, reset completely
    if (zoomScale > 1.01) {
      resetZoom();
      return;
    }

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setZoomOrigin(`${xPercent}% ${yPercent}%`);
    setZoomScale(1.6);
  };

  // Desktop mouse move updates zoom origin
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageContainerRef.current || zoomScale <= 1.01 || isVideo) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setZoomOrigin(`${xPercent}% ${yPercent}%`);
  };

  // Touch handlers for phone-like gallery experience
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!imageContainerRef.current || isVideo) return;

    if (e.touches.length === 1) {
      // Start panning
      const touch = e.touches[0];
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    } else if (e.touches.length === 2) {
      // Start pinch
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      const distance = Math.hypot(dx, dy);
      const centerX = (t1.clientX + t2.clientX) / 2;
      const centerY = (t1.clientY + t2.clientY) / 2;
      pinchRef.current = { distance, scale: zoomScale, centerX, centerY };

      // Also set zoom origin around pinch center
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = centerX - rect.left;
      const y = centerY - rect.top;
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      setZoomOrigin(`${xPercent}% ${yPercent}%`);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!imageContainerRef.current || isVideo) return;

    if (e.touches.length === 1 && lastTouchRef.current && zoomScale > 1.01) {
      // Panning when zoomed
      const touch = e.touches[0];
      const dx = touch.clientX - lastTouchRef.current.x;
      const dy = touch.clientY - lastTouchRef.current.y;
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };

      setOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
    } else if (e.touches.length === 2 && pinchRef.current) {
      // Pinch zoom
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      const distance = Math.hypot(dx, dy);

      const rawScale = (distance / pinchRef.current.distance) * pinchRef.current.scale;
      const clampedScale = Math.min(3, Math.max(1, rawScale));
      setZoomScale(clampedScale);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!imageContainerRef.current || isVideo) return;

    if (e.touches.length === 0) {
      lastTouchRef.current = null;
      pinchRef.current = null;

      // If user has zoomed out very close to 1, snap back to 1
      if (zoomScale < 1.05) {
        resetZoom();
      }
    }
  };

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
            className="relative w-full h-[80vh] flex items-center justify-center cursor-zoom-in md:cursor-zoom-in touch-none"
            ref={imageContainerRef}
            onClick={handleDesktopToggleZoom}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              touchAction: 'none',
              // When zoomed via touch, apply panning transforms on the container
              transform:
                zoomScale > 1.01
                  ? `translate3d(${offset.x}px, ${offset.y}px, 0)`
                  : 'translate3d(0, 0, 0)',
            }}
          >
            {isVideo ? (
              <video
                src={current?.url}
                controls
                autoPlay
                playsInline
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onSelectStart={(e) => e.preventDefault()}
                className="max-w-full max-h-full object-contain shadow-2xl select-none"
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitUserDrag: 'none',
                  transform: `scale(${zoomScale})`,
                  transformOrigin: zoomOrigin,
                }}
              />
            ) : (
              <>
                {/* Magnifying glass icon hint (desktop) */}
                <div className="hidden md:flex absolute top-6 right-6 items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 text-xs tracking-[0.2em] uppercase text-white/80 backdrop-blur-sm pointer-events-none">
                  <Search className="w-3.5 h-3.5" />
                  <span>Zoom</span>
                </div>

                <img
                  src={current?.url}
                  alt={current?.title}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  onSelectStart={(e) => e.preventDefault()}
                  className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-300 ease-out md:pointer-events-auto select-none"
                  style={{
                    transform: `scale(${zoomScale})`,
                    transformOrigin: zoomOrigin,
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitUserDrag: 'none',
                  }}
                />
              </>
            )}
          </motion.div>

          <div className="mt-6 text-center space-y-1">
            <h3 className="text-white text-2xl font-serif">{allImages[currentIndex]?.title}</h3>
            <p className="text-stone-400 text-sm tracking-widest uppercase">
              {`Gallery Image ${currentIndex + 1} / ${allImages.length}`}
            </p>
            
            {/* External link button for images that have a link (e.g. books on Drive) */}
            {allImages[currentIndex] && 'link' in allImages[currentIndex] && allImages[currentIndex].link && (
              <div className="pt-4">
                <a
                  href={allImages[currentIndex].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/40 text-xs tracking-[0.25em] uppercase text-white hover:bg-white hover:text-stone-900 transition-colors"
                >
                  <span>Link</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            )}
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