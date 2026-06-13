import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Image as ImageIcon, Search, GripVertical } from 'lucide-react';
import { CATEGORIES } from '../../constants';
import { Category } from '../../types';
import DeleteConfirmModal from './DeleteConfirmModal';

type GalleryImage = {
  id: string;
  title: string;
  url: string;
  category: string;
  thumbnail?: string;
  filePath?: string;
};

const AdminGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingImage, setEditingImage] = useState<{ id: string; title: string } | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; imageId: string; imageTitle: string; filePath?: string }>({
    isOpen: false,
    imageId: '',
    imageTitle: '',
  });

  // Drag-and-drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    const allImages: GalleryImage[] = [];
    CATEGORIES.forEach(category => {
      category.gallery.forEach(image => {
        allImages.push({
          id: image.id,
          title: image.title,
          url: image.url,
          category: category.id,
          thumbnail: image.thumbnail,
          filePath: image.filePath,
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

  const handleDeleteClick = (image: GalleryImage) => {
    setDeleteModal({
      isOpen: true,
      imageId: image.id,
      imageTitle: image.title,
      filePath: image.filePath,
    });
  };

  const handleDeleteConfirm = async () => {
    const { imageId, filePath } = deleteModal;

    if (!filePath) {
      setMessage({ type: 'error', text: 'Cannot delete: file path unknown for this image.' });
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch('/api/delete-from-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Delete failed');
      }

      setImages(prev => prev.filter(img => img.id !== imageId));
      setMessage({ type: 'success', text: 'Image deleted from GitHub. It will disappear from the public site after the next deployment.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: `Delete failed: ${err.message}` });
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, imageId: '', imageTitle: '' });
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage({ id: image.id, title: image.title });
  };

  const handleSaveEdit = () => {
    if (!editingImage) return;
    setImages(prev => prev.map(img =>
      img.id === editingImage.id ? { ...img, title: editingImage.title } : img
    ));
    setEditingImage(null);
    setMessage({ type: 'success', text: 'Title updated in this view. To persist the change, rename the file on GitHub.' });
  };

  // Drag-and-drop handlers
  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== draggedId) setDragOverId(id);
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    setImages(prev => {
      const next = [...prev];
      const fromIdx = next.findIndex(img => img.id === draggedId);
      const toIdx = next.findIndex(img => img.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });

    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
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

      {/* Drag hint */}
      {filteredImages.length > 1 && (
        <p className="text-xs text-stone-400 flex items-center gap-1">
          <GripVertical className="w-3 h-3" />
          Drag cards to reorder within this view
        </p>
      )}

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
              draggable
              onDragStart={() => handleDragStart(image.id)}
              onDragOver={(e) => handleDragOver(e, image.id)}
              onDrop={() => handleDrop(image.id)}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-white rounded-lg border overflow-hidden transition-all cursor-grab active:cursor-grabbing ${
                draggedId === image.id
                  ? 'opacity-40 border-stone-300'
                  : dragOverId === image.id
                  ? 'border-accent shadow-lg ring-2 ring-accent/30'
                  : 'border-stone-200 hover:shadow-lg'
              }`}
            >
              <div className="relative aspect-square bg-stone-100">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute top-2 left-2 p-1 bg-white/80 rounded text-stone-400">
                  <GripVertical className="w-3 h-3" />
                </div>
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
                        onClick={() => handleDeleteClick(image)}
                        disabled={isDeleting}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
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
