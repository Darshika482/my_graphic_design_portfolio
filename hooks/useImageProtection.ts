import { useEffect } from 'react';

/**
 * Hook to prevent image downloads and protect images from being saved
 * This adds global event handlers to prevent common download methods
 */
export const useImageProtection = () => {
  useEffect(() => {
    // Prevent right-click context menu on images and videos
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'IMG' ||
        target.tagName === 'VIDEO' ||
        target.closest('img') ||
        target.closest('video')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Prevent drag and drop
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'IMG' ||
        target.tagName === 'VIDEO' ||
        target.closest('img') ||
        target.closest('video')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Prevent keyboard shortcuts for saving
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Ctrl+S (Save), Ctrl+P (Print), Ctrl+Shift+I (DevTools)
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        if (e.shiftKey && (e.key === 'i' || e.key === 'I')) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
      
      // Disable F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Disable Print Screen (though this is harder to prevent completely)
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Prevent image selection
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'IMG' ||
        target.tagName === 'VIDEO' ||
        target.closest('img') ||
        target.closest('video')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Prevent copy operation on images
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'IMG' ||
        target.tagName === 'VIDEO' ||
        target.closest('img') ||
        target.closest('video')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Add event listeners with capture phase for better coverage
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('selectstart', handleSelectStart, true);
    document.addEventListener('copy', handleCopy, true);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
      document.removeEventListener('copy', handleCopy, true);
    };
  }, []);
};
