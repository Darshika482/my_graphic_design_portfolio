import React, { useState } from 'react';
import ThreeBackground from './components/ThreeBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WorkSection from './components/WorkSection';
import About from './components/About';
import Contact from './components/Contact';

const App: React.FC = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <main className="relative w-full min-h-screen bg-stone-50 text-stone-900 selection:bg-accent selection:text-white">
      <ThreeBackground />
      <Navbar isOverlayOpen={isOverlayOpen} />
      
      <div className="relative z-10">
        <Hero />
        <WorkSection onOverlayToggle={setIsOverlayOpen} />
        <About />
        <Contact />
      </div>
    </main>
  );
};

export default App;