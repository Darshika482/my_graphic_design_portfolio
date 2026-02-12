import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Image as ImageIcon, Search } from 'lucide-react';
import { CATEGORIES } from '../../constants';
import { Category } from '../../types';
import DeleteConfirmModal from './DeleteConfirmModal';

const AdminGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingImage, setEditingImage] = useState<{ id: string; title: string } | null>(null);
  const [images, setImages] = useState<Array<{ id: string; title: string; url: string; category: string; thumbnail?: string }>>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; imageId: string; imageTitle: string }>({
    isOpen: false,
    imageId: '',
    imageTitle: '',
  });

  useEffect(() => {
    // Load all images from categories
    const allImages: Array<{ id: string; title: string; url: string; category: string; thumbnail?: string }> = [];
    
    CATEGORIES.forEach(category => {
      category.gallery.forEach(image => {
        allImages.push({
          id: image.id,
          title: image.title,
          url: image.url,
          category: category.id,
          thumbnail: image.thumbnail,
        });
      });
    });

    setImages(allImages);
  }, []);

  const filteredImages = images.filter(img => {
    const matchesCategory = selectedCategory === 'all' || img.category === selectedCategory;
    const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...CATEGORIES.map(cat => ({ value: cat.id, label: cat.title })),
  ];

  const handleDeleteClick = (imageId: string, imageTitle: string) => {
    setDeleteModal({
      isOpen: true,
      imageId,
      imageTitle,
    });
  };

  const handleDeleteConfirm = async () => {
    // TODO: Implement delete via API
    setMessage({ type: 'info', text: 'Delete functionality coming soon. For now, delete files manually from GitHub.' });
    
    // Remove from local state (for preview purposes)
    // setImages(prev => prev.filter(img => img.id !== deleteModal.imageId));
  };

  const handleEdit = (image: { id: string; title: string }) => {
    setEditingImage(image);
  };

  const handleSaveEdit = async () => {
    if (!editingImage) return;

    // TODO: Implement update via API
    setImages(prev => prev.map(img => 
      img.id === editingImage.id ? { ...img, title: editingImage.title } : img
    ));
    setEditingImage(null);
    setMessage({ type: 'success', text: 'Title updated (local only - API update coming soon)' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif text-stone-900 mb-2">Gallery Management</h2>
        <p className="text-stone-600">View and manage all portfolio images</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Search Images
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title..."
                className="w-full pl-10 p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-stone-200">
          <p className="text-sm text-stone-600">Total Images</p>
          <p className="text-2xl font-bold text-stone-900">{images.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-stone-200">
          <p className="text-sm text-stone-600">Filtered Results</p>
          <p className="text-2xl font-bold text-stone-900">{filteredImages.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-stone-200">
          <p className="text-sm text-stone-600">Categories</p>
          <p className="text-2xl font-bold text-stone-900">{CATEGORIES.length}</p>
        </div>
      </div>

      {/* Image Grid */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
          <ImageIcon className="w-12 h-12 mx-auto text-stone-400 mb-4" />
          <p className="text-stone-600">No images found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square bg-stone-100">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                {editingImage?.id === image.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingImage.title}
                      onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 bg-accent text-white rounded text-sm hover:bg-opacity-90"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingImage(null)}
                        className="px-3 py-1 bg-stone-200 text-stone-700 rounded text-sm hover:bg-stone-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium text-stone-900 mb-2 truncate">{image.title}</h3>
                    <p className="text-xs text-stone-500 mb-3">
                      {CATEGORIES.find(c => c.id === image.category)?.title}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(image)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-stone-100 text-stone-700 rounded text-sm hover:bg-stone-200 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(image.id, image.title)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800' 
              : message.type === 'error'
              ? 'bg-red-50 text-red-800'
              : 'bg-blue-50 text-blue-800'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, imageId: '', imageTitle: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Image"
        itemName={deleteModal.imageTitle}
      />
    </div>
  );
};

export default AdminGallery;
