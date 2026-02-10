import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Category } from '../types';
import ProjectOverlay from './ProjectOverlay';

interface CollectionPageProps {
  category: Category;
  onBack: (categoryId: string) => void;
  previousCategory?: Category | null;
  nextCategory?: Category | null;
  onNavigateCollection?: (category: Category) => void;
}

interface ImageDimensions {
  width: number;
  height: number;
  ratio: number;
}

const CollectionPage: React.FC<CollectionPageProps> = ({
  category,
  onBack,
  previousCategory,
  nextCategory,
  onNavigateCollection,
}) => {
  const [overlayCategory, setOverlayCategory] = useState<Category | null>(null);
  const [overlayIndex, setOverlayIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imageDimensions, setImageDimensions] = useState<Map<string, ImageDimensions>>(new Map());
  const [columnCount, setColumnCount] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Responsive column count
  useEffect(() => {
    const updateColumns = () => {
      const w = window.innerWidth;
      if (w < 480) setColumnCount(1);
      else if (w < 768) setColumnCount(2);
      else if (w < 1280) setColumnCount(3);
      else setColumnCount(4);
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const allImages = category.gallery;

  // Preload images to get natural dimensions
  useEffect(() => {
    allImages.forEach(image => {
      if (imageDimensions.has(image.id)) return;

      const isVideo = image.mediaType === 'video' || /\.mp4$/i.test(image.url);

      if (isVideo) {
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
          setImageDimensions(prev => {
            const next = new Map(prev);
            next.set(image.id, {
              width: video.videoWidth || 16,
              height: video.videoHeight || 9,
              ratio: (video.videoHeight || 9) / (video.videoWidth || 16),
            });
            return next;
          });
          setLoadedImages(prev => new Set(prev).add(image.id));
        };
        video.src = image.url;
      } else {
        const img = new Image();
        img.onload = () => {
          setImageDimensions(prev => {
            const next = new Map(prev);
            next.set(image.id, {
              width: img.naturalWidth,
              height: img.naturalHeight,
              ratio: img.naturalHeight / img.naturalWidth,
            });
            return next;
          });
          setLoadedImages(prev => new Set(prev).add(image.id));
        };
        img.src = image.url;
      }
    });
  }, [allImages]);

  // Shortest-column distribution (Pinterest algorithm)
  const columns = (() => {
    const cols: { items: { image: typeof allImages[0]; index: number }[]; height: number }[] =
      Array.from({ length: columnCount }, () => ({ items: [], height: 0 }));

    allImages.forEach((image, index) => {
      const dims = imageDimensions.get(image.id);
      const ratio = dims ? dims.ratio : 1.2;

      // Place in the shortest column
      let shortestIdx = 0;
      let shortestHeight = cols[0].height;
      for (let i = 1; i < cols.length; i++) {
        if (cols[i].height < shortestHeight) {
          shortestIdx = i;
          shortestHeight = cols[i].height;
        }
      }

      cols[shortestIdx].items.push({ image, index });
      cols[shortestIdx].height += ratio;
    });

    return cols;
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

  const gap = columnCount <= 2 ? 10 : 16;

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
              onClick={() => onBack(category.id)}
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

        {/* Masonry Grid — shortest-column layout */}
        <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-8 md:py-12">
          <div
            ref={containerRef}
            className="flex items-start"
            style={{ gap: `${gap}px` }}
          >
            {columns.map((col, colIdx) => (
              <div
                key={colIdx}
                className="flex-1 min-w-0 flex flex-col"
                style={{ gap: `${gap}px` }}
              >
                {col.items.map(({ image, index }) => {
                  const dims = imageDimensions.get(image.id);
                  return (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.04 }}
                    >
                      <div
                        onClick={() => handleImageClick(index)}
                        className="group relative cursor-pointer overflow-hidden rounded-lg bg-stone-100"
                        style={dims ? { aspectRatio: `${dims.width} / ${dims.height}` } : undefined}
                      >
                        {image.mediaType === 'video' || /\.mp4$/i.test(image.url) ? (
                          <video
                            src={image.url}
                            muted
                            loop
                            autoPlay
                            playsInline
                            className={`w-full h-full object-cover block transition-all duration-500 ease-out group-hover:scale-[1.03] ${loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
                              }`}
                            onLoadedMetadata={() => {
                              setLoadedImages(prev => new Set(prev).add(image.id));
                            }}
                          />
                        ) : (
                          <img
                            src={image.url}
                            alt={image.title}
                            loading="lazy"
                            decoding="async"
                            className={`w-full h-full object-cover block transition-all duration-500 ease-out group-hover:scale-[1.03] ${loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
                              }`}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                          <p className="text-white text-sm font-medium tracking-wide">{image.title}</p>
                        </div>
                        {!loadedImages.has(image.id) && (
                          <div className="absolute inset-0 bg-stone-200 animate-pulse" style={{ minHeight: '200px' }} />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="py-12 border-t border-stone-200/60">
          <div className="max-w-[1800px] mx-auto px-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:gap-6">
              {previousCategory && onNavigateCollection && (
                <button
                  onClick={() => onNavigateCollection(previousCategory)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-300 bg-white/70 text-xs md:text-sm uppercase tracking-wider font-medium text-stone-600 shadow-sm hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="whitespace-nowrap">
                    Previous: <span className="font-serif normal-case">{previousCategory.title}</span>
                  </span>
                </button>
              )}
            </div>

            <div className="text-center order-first md:order-none">
              <button
                onClick={() => onBack(category.id)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-300 bg-white/70 text-xs md:text-sm uppercase tracking-wider font-medium text-stone-600 shadow-sm hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </button>
            </div>

            <div className="flex justify-end">
              {nextCategory && onNavigateCollection && (
                <button
                  onClick={() => onNavigateCollection(nextCategory)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-300 bg-white/70 text-xs md:text-sm uppercase tracking-wider font-medium text-stone-600 shadow-sm hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors"
                >
                  <span className="whitespace-nowrap">
                    Next: <span className="font-serif normal-case">{nextCategory.title}</span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

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
