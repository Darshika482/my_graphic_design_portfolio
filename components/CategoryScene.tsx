import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Category } from '../types';
import { ArrowUpRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface CategorySceneProps {
  category: Category;
  onOpenProject: (cat: Category, index: number) => void;
  onViewCollection?: (cat: Category) => void;
}

const CategoryScene: React.FC<CategorySceneProps> = ({ category, onOpenProject, onViewCollection }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  // Build hero media list from heroImage and gallery, preserving whether items are video or image
  const heroMedia = React.useMemo(
    () => {
      const items: { url: string; isVideo: boolean }[] = [];

      const addIfNew = (url: string, isVideo: boolean) => {
        if (!items.some((m) => m.url === url)) {
          items.push({ url, isVideo });
        }
      };

      if (category.heroImage) {
        const heroIsVideo = /\.mp4$/i.test(category.heroImage);
        addIfNew(category.heroImage, heroIsVideo);
      }

      category.gallery.forEach((img) => {
        const isVideo = img.mediaType === 'video' || /\.mp4$/i.test(img.url);
        addIfNew(img.url, isVideo);
      });

      return items;
    },
    [category.heroImage, category.gallery]
  );

  // Create a scroll-linked animation for the parallax effect within this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  // Automatically cycle through hero media
  useEffect(() => {
    if (heroMedia.length <= 1) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroMedia.length);
    }, 4000); // change image every 4 seconds

    return () => clearInterval(interval);
  }, [heroMedia.length]);

  return (
    <section
      id={category.id}
      ref={containerRef}
      className="relative min-h-screen py-16 md:py-32 flex flex-col justify-center overflow-hidden"
    >
      {/* Section Divider — visible on mobile */}
      <div className="absolute top-0 left-6 right-6 md:left-1/2 md:-translate-x-1/2 md:w-24 h-px bg-stone-300 md:bg-stone-200"></div>
      <motion.div
        className="container mx-auto px-6 h-full flex flex-col md:flex-row items-center gap-12 md:gap-24"
      >
        {/* Left/Top Content */}
        <motion.div style={{ y: yContent }} className="w-full md:w-1/3 space-y-8 z-10 order-2 md:order-1">
          <div className="space-y-4">
            <span className="text-accent text-sm font-bold tracking-widest uppercase">Selected Work</span>
            <h2 className="text-4xl md:text-6xl font-serif text-stone-900 leading-none">
              {category.title}
            </h2>
            <div className="w-12 h-0.5 bg-stone-300"></div>
          </div>

          <p className="text-lg text-stone-600 leading-relaxed font-light">
            {category.description}
          </p>

          <div className="pt-6 flex flex-col space-y-6">
            <button
              // Open collection starting from the first gallery image
              onClick={() => onViewCollection ? onViewCollection(category) : onOpenProject(category, 0)}
              className="group relative flex items-center justify-between w-full p-4 rounded-xl text-white overflow-hidden active:scale-[0.97] transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #A34829 0%, #c75b35 50%, #e07a4f 100%)',
                boxShadow: '0 4px 0 0 #7a3520, 0 6px 20px rgba(163, 72, 41, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                transform: 'translateY(-2px)',
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(1px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 0 0 #7a3520, 0 2px 8px rgba(163, 72, 41, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 0 0 #7a3520, 0 6px 20px rgba(163, 72, 41, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 0 0 #7a3520, 0 6px 20px rgba(163, 72, 41, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)';
              }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="relative text-sm uppercase tracking-wider font-semibold drop-shadow-sm">View Collection</span>
              <ArrowUpRight className="relative w-5 h-5 drop-shadow-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            {/* Mini Gallery Strip */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {category.gallery.slice(0, 3).map((img, idx) => {
                const isVideo =
                  img.mediaType === 'video' || /\.mp4$/i.test(img.url);
                return (
                  <motion.div
                    key={img.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => onOpenProject(category, idx)}
                    className="aspect-square bg-stone-200 overflow-hidden cursor-pointer"
                  >
                    {isVideo ? (
                      <video
                        src={img.url}
                        muted
                        loop
                        autoPlay
                        playsInline
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        onSelectStart={(e) => e.preventDefault()}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 select-none"
                        style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitUserDrag: 'none' }}
                      />
                    ) : (
                      <OptimizedImage
                        src={img.url}
                        thumbnail={img.thumbnail}
                        alt={img.title}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        eager
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right/Bottom Hero Image */}
        <div className="w-full md:w-2/3 relative order-1 md:order-2">
          <motion.div
            style={{ y: yHero }}
            className="relative w-full h-[70vh] bg-stone-100 shadow-2xl overflow-hidden cursor-pointer"
            // Clicking hero also opens overlay at first gallery image
            onClick={() => onOpenProject(category, 0)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
          >
            {heroMedia[heroIndex]?.isVideo ? (
              <video
                key={heroMedia[heroIndex].url}
                src={heroMedia[heroIndex].url}
                muted
                loop
                autoPlay
                playsInline
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onSelectStart={(e) => e.preventDefault()}
                className="absolute inset-0 w-full h-full object-contain select-none"
                style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitUserDrag: 'none' }}
              />
            ) : (
              <OptimizedImage
                key={heroMedia[heroIndex]?.url}
                src={heroMedia[heroIndex]?.url}
                thumbnail={category.gallery[heroIndex]?.thumbnail}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-700"
                rootMargin="500px"
                objectFit="contain"
                eager
              />
            )}
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
};

export default CategoryScene;