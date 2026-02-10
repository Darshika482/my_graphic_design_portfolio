import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { SectionId } from '../types';

const ROLES = [
    'Graphic Designer',
    'UI/UX Designer',
    'Web Developer',
];

const Hero: React.FC = () => {
    const [roleIndex, setRoleIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRoleIndex(prev => (prev + 1) % ROLES.length);
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    return (
        <section
            id={SectionId.Home}
            className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
        >
            {/* Minimal decorative line */}
            <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-stone-300 to-transparent"
                initial={{ height: 0 }}
                animate={{ height: '30%' }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
            />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Animated role */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mb-8 flex items-center justify-center gap-4"
                >
                    <div className="h-px w-10 bg-stone-300" />
                    <div className="relative h-7 overflow-hidden min-w-[220px]">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={roleIndex}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className="absolute inset-0 flex items-center justify-center text-sm md:text-base tracking-[0.25em] uppercase font-medium text-accent"
                            >
                                {ROLES[roleIndex]}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                    <div className="h-px w-10 bg-stone-300" />
                </motion.div>

                {/* Name — letter-by-letter stagger */}
                <motion.h1
                    className="text-5xl md:text-7xl lg:text-9xl font-serif text-stone-900 leading-[0.9] tracking-tight mb-8"
                    initial="hidden"
                    animate="visible"
                >
                    {'Darshika'.split('').map((char, i) => (
                        <motion.span
                            key={`first-${i}`}
                            className="inline-block"
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, delay: 0.5 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {char}
                        </motion.span>
                    ))}
                    <span className="inline-block w-[0.3em]" />
                    {'Jain'.split('').map((char, i) => (
                        <motion.span
                            key={`last-${i}`}
                            className="inline-block"
                            style={{ color: '#A34829' }}
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, delay: 0.85 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </motion.h1>

                {/* Tagline with reveal line */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-12"
                >
                    <p className="text-lg md:text-xl text-stone-500 font-light leading-relaxed max-w-lg mx-auto">
                        Crafting visual systems that clarify, educate, and inspire.
                    </p>
                    <p className="text-sm text-stone-400 mt-2 tracking-wide">
                        Specialized in academic identity & print production.
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                >
                    <a href="#work">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="group relative inline-flex items-center gap-3 px-10 py-4 text-sm tracking-[0.15em] uppercase font-semibold text-white rounded-full overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #A34829, #c75b35)',
                                boxShadow: '0 4px 0 0 #7a3520, 0 8px 30px rgba(163,72,41,0.25)',
                                transform: 'translateY(-2px)',
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <span className="relative">Explore My Work</span>
                            <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </motion.button>
                    </a>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400"
            >
                <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                    <ArrowDown className="w-3.5 h-3.5" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
