import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Code, BarChart3, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../../constants';

const AdminSettings: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    // TODO: Implement password change via API
    setMessage({ type: 'success', text: 'Password change functionality coming soon. Update VITE_ADMIN_PASSWORD in Vercel environment variables.' });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Calculate statistics
  const totalImages = CATEGORIES.reduce((sum, cat) => sum + cat.gallery.length, 0);
  const totalCategories = CATEGORIES.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif text-stone-900 mb-2">Settings</h2>
        <p className="text-stone-600">Manage your admin panel settings</p>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-medium text-stone-900">Change Password</h3>
        </div>
        
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          
          <button
            onClick={handlePasswordChange}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* GitHub Configuration */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-medium text-stone-900">GitHub Configuration</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-stone-600">Repository</span>
            <span className="font-mono text-sm">Darshika482/my_graphic_design_portfolio</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-600">Status</span>
            <span className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-600">Branch</span>
            <span className="font-mono text-sm">main</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-medium text-stone-900">Statistics</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-stone-50 rounded-lg p-4">
            <p className="text-sm text-stone-600 mb-1">Total Images</p>
            <p className="text-3xl font-bold text-stone-900">{totalImages}</p>
          </div>
          <div className="bg-stone-50 rounded-lg p-4">
            <p className="text-sm text-stone-600 mb-1">Categories</p>
            <p className="text-3xl font-bold text-stone-900">{totalCategories}</p>
          </div>
          <div className="bg-stone-50 rounded-lg p-4">
            <p className="text-sm text-stone-600 mb-1">Platform</p>
            <p className="text-lg font-semibold text-stone-900">Vercel</p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </motion.div>
      )}
    </div>
  );
};

export default AdminSettings;
