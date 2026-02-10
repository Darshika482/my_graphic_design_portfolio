import React from 'react';
import { motion } from 'framer-motion';
import { SectionId } from '../types';

const About: React.FC = () => {
  const skills = [
    "Print Production", "Typography", "Visual Identity", "Curriculum Design", 
    "Adobe Creative Suite", "Layout Systems", "Art Direction", "Packaging"
  ];

  return (
    <section id={SectionId.About} className="relative py-32 bg-stone-100 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Image / Visual */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
           <div className="aspect-[4/5] bg-stone-300 overflow-hidden relative shadow-xl">
             <img src="https://picsum.photos/seed/darshika/800/1000" alt="Darshika Jain" className="w-full h-full object-cover grayscale contrast-125" />
             <div className="absolute inset-0 ring-1 ring-inset ring-black/10"></div>
           </div>
           {/* Decorative elements */}
           <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-stone-200 -z-10"></div>
           <div className="absolute -top-8 -left-8 w-full h-full border border-stone-300 -z-10"></div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900">
            Design with <span className="italic text-accent">Purpose</span>
          </h2>
          
          <div className="space-y-4 text-stone-600 text-lg font-light leading-relaxed">
            <p>
              I am Darshika Jain, a graphic designer deeply passionate about the intersection of education and visual communication. 
              My work focuses on creating clarity out of chaos, transforming complex academic curriculums into engaging, accessible visual systems.
            </p>
            <p>
              With a background in both print production and digital systems, I ensure that every project—from a single letterhead to a school-wide branding overhaul—is executed with precision, tactile quality, and thoughtful typography.
            </p>
          </div>

          <div className="pt-6">
            <h4 className="text-sm uppercase tracking-widest text-stone-400 mb-4">Core Competencies</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-stone-200 text-stone-700 text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;