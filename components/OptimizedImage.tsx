import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * In-memory image cache.
 * Once an image URL has been fully loaded, its blob URL (or original URL) is stored here
 * so subsequent renders / navigations re-use the cached version instantly.
 */
const imageCache = new Map<string, string>();
const loadingPromises = new Map<string, Promise<string>>();

function loadAndCacheImage(src: string): Promise<string> {
    // Already cached
    if (imageCache.has(src)) {
        return Promise.resolve(imageCache.get(src)!);
    }

    // Already loading — return existing promise
    if (loadingPromises.has(src)) {
        return loadingPromises.get(src)!;
    }

    const promise = new Promise<string>((resolve) => {
        const img = new Image();
        img.onload = () => {
            imageCache.set(src, src);
            loadingPromises.delete(src);
            resolve(src);
        };
        img.onerror = () => {
            // On error, fall through to src anyway
            loadingPromises.delete(src);
            resolve(src);
        };
        img.src = src;
    });

    loadingPromises.set(src, promise);
    return promise;
}

/**
 * Check if an image is already cached (synchronous).
 */
export function isImageCached(src: string): boolean {
    return imageCache.has(src);
}

interface OptimizedImageProps {
    src: string;
    thumbnail?: string;
    alt: string;
    className?: string;
    onClick?: () => void;
    /** Distance (px) before the viewport at which the full image begins loading. */
    rootMargin?: string;
    /** Controls how images fit their container. Default: 'cover'. Use 'contain' to prevent cropping. */
    objectFit?: 'cover' | 'contain';
    /**
     * If true, skip intersection observer and load the full image immediately.
     * Use this for above-the-fold / hero images you want to show as fast as possible.
     */
    eager?: boolean;
    /**
     * If true, don't show the blurred thumbnail, only the skeleton.
     * This reduces the visual "blur" effect duration.
     */
    disableBlur?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    thumbnail,
    alt,
    className = '',
    onClick,
    rootMargin = '300px',
    objectFit = 'cover',
    eager = false,
    disableBlur = false,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    // For eager images or cached ones, treat them as "in view" from the start
    const [isInView, setIsInView] = useState(() => eager || imageCache.has(src));
    const [isFullLoaded, setIsFullLoaded] = useState(() => eager || imageCache.has(src));

    // Intersection Observer — triggers when element nears viewport
    useEffect(() => {
        // For eager images or already loaded ones, we don't need the observer at all
        if (eager || isFullLoaded) return;

        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [rootMargin, isFullLoaded, eager]);

    // Load full image once in view (or if already cached / eager)
    useEffect(() => {
        if (!isInView && !imageCache.has(src)) return;

        loadAndCacheImage(src).then(() => {
            setIsFullLoaded(true);
        });
    }, [isInView, src]);

    return (
        <div ref={containerRef} className={`relative overflow-hidden ${className}`} onClick={onClick}>
            {/* Blurred thumbnail placeholder */}
            {thumbnail && !isFullLoaded && !disableBlur && (
                <img
                    src={thumbnail}
                    alt=""
                    aria-hidden
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    onSelectStart={(e) => e.preventDefault()}
                    className={`absolute inset-0 w-full h-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} select-none`}
                    style={{ filter: 'blur(8px)', transform: 'scale(1.05)', userSelect: 'none', WebkitUserSelect: 'none', WebkitUserDrag: 'none' }}
                />
            )}

            {/* Full-resolution image */}
            {(isFullLoaded || isInView) && (
                <img
                    src={src}
                    alt={alt}
                    loading={eager ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    onSelectStart={(e) => e.preventDefault()}
                    className={`w-full h-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} block transition-opacity duration-500 ease-out select-none ${isFullLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitUserDrag: 'none' }}
                    onLoad={() => {
                        imageCache.set(src, src);
                        setIsFullLoaded(true);
                    }}
                />
            )}

            {/* Pulse skeleton if no thumbnail and not loaded */}
            {!thumbnail && !isFullLoaded && (
                <div className="absolute inset-0 bg-stone-200 animate-pulse" />
            )}
        </div>
    );
};

export default OptimizedImage;
