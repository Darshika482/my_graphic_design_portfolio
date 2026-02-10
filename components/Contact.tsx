import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { SectionId } from '../types';
import { Mail, Phone, FileText } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id={SectionId.Contact} className="relative min-h-[70vh] flex items-center justify-center bg-stone-900 text-stone-50 px-6 py-20 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-serif mb-6">Let's Create Together</h2>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto">
            I am currently available for freelance projects and full-time opportunities. 
            If you value thoughtful design and print perfection, I'd love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          {/* Primary email button – solid light style for better visibility */}
          <a href="mailto:darshika.creativpulse@gmail.com">
            <Button
              variant="outline"
              className="bg-white text-stone-900 border-white hover:bg-accent hover:border-accent hover:text-white shadow-lg min-w-[200px]"
            >
              <Mail className="mr-2 w-4 h-4" /> Email Me
            </Button>
          </a>

          {/* Resume button pointing to Google Drive link */}
          <a
            href="https://drive.google.com/file/d/1NyP2NZbwNOzzTObB00CR9pvWEZYl2PRW/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="primary"
              className="bg-transparent border border-stone-400 text-stone-100 hover:bg-stone-100 hover:text-stone-900 min-w-[200px]"
            >
              <FileText className="mr-2 w-4 h-4" /> Download Resume
            </Button>
          </a>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-stone-800 text-sm text-stone-400">
           <div className="flex flex-col items-center md:items-start gap-2">
             <span className="uppercase tracking-widest text-xs text-stone-600">Contact</span>
             <a href="tel:+919755049483" className="hover:text-white transition-colors flex items-center gap-2">
               <Phone className="w-3 h-3" /> +91 97550 49483
             </a>
             <a href="mailto:darshika.creativpulse@gmail.com" className="hover:text-white transition-colors">
               darshika.creativpulse@gmail.com
             </a>
           </div>
           
           <div className="flex flex-col items-center gap-2">
             <span className="uppercase tracking-widest text-xs text-stone-600">Social</span>
             <div className="flex gap-4">
               <a
                 href="https://www.linkedin.com/in/darshika-jain-9048491b9/"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-white transition-colors"
               >
                 LinkedIn
               </a>
               <a
                 href="https://github.com/Darshika482"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-white transition-colors"
               >
                 GitHub
               </a>
             </div>
           </div>

           <div className="flex flex-col items-center md:items-end gap-2">
             <span className="uppercase tracking-widest text-xs text-stone-600">Location</span>
             <span>India</span>
             <span>Available Remote</span>
           </div>
        </div>
        
        <div className="pt-20 text-xs text-stone-600">
          © {new Date().getFullYear()} Darshika Jain. All Rights Reserved.
        </div>
      </div>
    </section>
  );
};

export default Contact;