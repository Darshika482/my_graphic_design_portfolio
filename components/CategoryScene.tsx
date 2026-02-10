import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Category } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface CategorySceneProps {
  category: Category;
  onOpenProject: (cat: Category, index: number) => void;
}

const CategoryScene: React.FC<CategorySceneProps> = ({ category, onOpenProject }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroImages = [category.heroImage, ...category.gallery.map((img) => img.url)];

  // Create a scroll-linked animation for the parallax effect within this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  // Automatically cycle through hero images
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000); // change image every 4 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section ref={containerRef} className="relative min-h-screen py-24 md:py-32 flex flex-col justify-center overflow-hidden border-t border-stone-200">
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

          <div className="pt-4 flex flex-col space-y-4">
            <button
              onClick={() => onOpenProject(category, -1)} // -1 indicates Hero
              className="group flex items-center justify-between w-full p-4 bg-white border border-stone-200 hover:border-accent hover:shadow-lg transition-all duration-300"
            >
              <span className="text-sm uppercase tracking-wider font-medium text-stone-900 group-hover:text-accent">View Collection</span>
              <ArrowUpRight className="w-5 h-5 text-stone-400 group-hover:text-accent transition-colors" />
            </button>

            {/* Mini Gallery Strip */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {category.gallery.slice(0, 3).map((img, idx) => (
                <motion.div
                  key={img.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onOpenProject(category, idx)}
                  className="aspect-square bg-stone-200 overflow-hidden cursor-pointer"
                >
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right/Bottom Hero Image */}
        <div className="w-full md:w-2/3 relative order-1 md:order-2">
          <motion.div
            style={{ y: yHero }}
            className="w-full bg-stone-100 shadow-2xl overflow-hidden cursor-pointer flex items-center justify-center max-h-[85vh]"
            onClick={() => onOpenProject(category, -1)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
          >
            <img
              key={heroIndex}
              src={heroImages[heroIndex]}
              alt={category.title}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain transition-opacity duration-700"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
};

export default CategoryScene;