import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminUpload from './AdminUpload';
import AdminGallery from './AdminGallery';
import AdminSettings from './AdminSettings';

const Admin: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'upload' | 'gallery' | 'settings'>('upload');

  useEffect(() => {
    // Parse hash route
    const parseHash = () => {
      const hash = window.location.hash;
      if (hash.includes('/admin/gallery')) {
        setCurrentPage('gallery');
      } else if (hash.includes('/admin/settings')) {
        setCurrentPage('settings');
      } else {
        setCurrentPage('upload');
      }
    };

    // Parse on mount
    parseHash();

    // Listen for hash changes
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const handleNavigate = (page: 'upload' | 'gallery' | 'settings') => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    window.location.hash = '';
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'gallery':
        return <AdminGallery />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminUpload />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onLogout={handleLogout} onNavigate={handleNavigate}>
      {renderPage()}
    </AdminLayout>
  );
};

export default Admin;
