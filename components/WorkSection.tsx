import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import CategoryScene from './CategoryScene';
import ProjectOverlay from './ProjectOverlay';
import { Category, SectionId } from '../types';

interface WorkSectionProps {
  onOverlayToggle?: (isOpen: boolean) => void;
}

const WorkSection: React.FC<WorkSectionProps> = ({ onOverlayToggle }) => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  const handleOpenProject = (category: Category, index: number) => {
    setActiveCategory(category);
    setInitialImageIndex(index);
    document.body.style.overflow = 'hidden';
    onOverlayToggle?.(true);
  };

  const handleCloseProject = () => {
    setActiveCategory(null);
    document.body.style.overflow = 'unset';
    onOverlayToggle?.(false);
  };

  return (
    <div id={SectionId.Work} className="relative z-10 bg-stone-50">
      <div className="py-20 text-center">
        <p className="text-sm uppercase tracking-widest text-stone-400 mb-2">Curated Portfolio</p>
        <h2 className="text-3xl font-serif text-stone-900">Selected Works</h2>
      </div>

      {CATEGORIES.map((category) => (
        <CategoryScene 
          key={category.id} 
          category={category} 
          onOpenProject={handleOpenProject} 
        />
      ))}

      {activeCategory && (
        <ProjectOverlay 
          category={activeCategory} 
          initialIndex={initialImageIndex} 
          onClose={handleCloseProject} 
        />
      )}
    </div>
  );
};

export default WorkSection;