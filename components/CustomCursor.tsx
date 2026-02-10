import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorVariant = 'default' | 'hover' | 'text' | 'image' | 'click';

const CustomCursor: React.FC = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [variant, setVariant] = useState<CursorVariant>('default');
    const [isVisible, setIsVisible] = useState(false);
    const [label, setLabel] = useState('');
    const rafRef = useRef<number>(0);

    // Smooth spring following
    const springX = useSpring(cursorX, { stiffness: 500, damping: 35, mass: 0.5 });
    const springY = useSpring(cursorY, { stiffness: 500, damping: 35, mass: 0.5 });

    useEffect(() => {
        // Hide custom cursor on touch devices
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        const moveCursor = (e: MouseEvent) => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                cursorX.set(e.clientX);
                cursorY.set(e.clientY);
            });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseDown = () => setVariant('click');
        const handleMouseUp = () => setVariant('default');
        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);
        document.documentElement.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [cursorX, cursorY, isVisible]);

    // Observe hover targets via MutationObserver-friendly delegation
    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        const handleOver = (e: MouseEvent) => {
            const el = e.target as HTMLElement;
            const interactive = el.closest('a, button, [data-cursor="hover"]');
            const imageEl = el.closest('img, video, [data-cursor="image"]');
            const textEl = el.closest('h1, h2, h3, p, span, [data-cursor="text"]');

            if (interactive) {
                setVariant('hover');
                const cursorLabel = (interactive as HTMLElement).dataset.cursorLabel;
                setLabel(cursorLabel || '');
            } else if (imageEl) {
                setVariant('image');
                setLabel('');
            } else if (textEl) {
                setVariant('text');
                setLabel('');
            } else {
                setVariant('default');
                setLabel('');
            }
        };

        document.addEventListener('mouseover', handleOver);
        return () => document.removeEventListener('mouseover', handleOver);
    }, []);

    // Variant styles
    const variants: Record<CursorVariant, {
        size: number;
        bg: string;
        border: string;
        mixBlend: string;
        scale: number;
    }> = {
        default: {
            size: 20,
            bg: 'transparent',
            border: '2px solid rgba(163, 72, 41, 0.6)',
            mixBlend: 'normal',
            scale: 1,
        },
        hover: {
            size: 56,
            bg: 'rgba(163, 72, 41, 0.1)',
            border: '2px solid rgba(163, 72, 41, 0.8)',
            mixBlend: 'normal',
            scale: 1,
        },
        text: {
            size: 4,
            bg: 'rgba(163, 72, 41, 0.8)',
            border: 'none',
            mixBlend: 'normal',
            scale: 1,
        },
        image: {
            size: 64,
            bg: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            mixBlend: 'difference',
            scale: 1,
        },
        click: {
            size: 16,
            bg: 'rgba(163, 72, 41, 0.3)',
            border: '2px solid rgba(163, 72, 41, 0.8)',
            mixBlend: 'normal',
            scale: 0.8,
        },
    };

    const v = variants[variant];

    // Don't render on touch devices
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        return null;
    }

    return (
        <>
            {/* Hide default cursor globally */}
            <style>{`
        *, *::before, *::after {
          cursor: none !important;
        }
      `}</style>

            {/* Dot center (instant follow) */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            >
                <motion.div
                    animate={{
                        width: 5,
                        height: 5,
                        opacity: isVisible ? (variant === 'text' ? 0 : 1) : 0,
                    }}
                    transition={{ duration: 0.15 }}
                    className="rounded-full"
                    style={{ background: '#A34829' }}
                />
            </motion.div>

            {/* Ring (spring follow) */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998]"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            >
                <motion.div
                    animate={{
                        width: v.size,
                        height: v.size,
                        scale: v.scale,
                        opacity: isVisible ? 1 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.5 }}
                    className="rounded-full flex items-center justify-center"
                    style={{
                        background: v.bg,
                        border: v.border,
                        mixBlendMode: v.mixBlend as any,
                    }}
                >
                    {label && variant === 'hover' && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-[8px] uppercase tracking-widest font-bold text-accent whitespace-nowrap"
                        >
                            {label}
                        </motion.span>
                    )}
                </motion.div>
            </motion.div>
        </>
    );
};

export default CustomCursor;
