import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Settings, LogOut, Home } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: 'upload' | 'gallery' | 'settings';
  onLogout: () => void;
  onNavigate?: (page: 'upload' | 'gallery' | 'settings') => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage, onLogout, onNavigate }) => {
  const handleNavClick = (page: 'upload' | 'gallery' | 'settings', e: React.MouseEvent) => {
    e.preventDefault();
    const hash = page === 'upload' ? '#/admin' : `#/admin/${page}`;
    window.location.hash = hash;
    if (onNavigate) {
      onNavigate(page);
    }
  };
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async () => {
    if (!password) {
      setError('Please enter a password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_authenticated', 'true');
        setError('');
      } else {
        setError('Incorrect password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setPassword('');
    onLogout();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full"
        >
          <h1 className="text-3xl font-serif text-stone-900 mb-2">Admin Login</h1>
          <p className="text-stone-600 mb-6">Enter password to access admin panel</p>
          
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              disabled={!password}
              placeholder="Password"
              className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            
            {error && <p className="text-red-600 text-sm">{error}</p>}
            
            <button
              onClick={handleLogin}
              disabled={isLoading || !password}
              className="w-full p-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif text-stone-900">🎨 Portfolio Admin</h1>
          
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-2 text-stone-600 hover:text-accent transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">View Site</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-stone-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={(e) => handleNavClick('upload', e)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                currentPage === 'upload'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
            <button
              onClick={(e) => handleNavClick('gallery', e)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                currentPage === 'gallery'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery</span>
            </button>
            <button
              onClick={(e) => handleNavClick('settings', e)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                currentPage === 'settings'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
