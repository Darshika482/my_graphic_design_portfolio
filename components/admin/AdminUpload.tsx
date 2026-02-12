import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../../constants';

interface FileWithPreview extends File {
  preview?: string;
  customTitle?: string;
}

const AdminUpload: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryOptions = CATEGORIES.map(cat => ({
    value: cat.id,
    label: cat.title,
  }));

  const categoryFolderMap: Record<string, string> = {
    'poster-banner': 'new poster',
    'academic-book': 'books',
    'school-branding': 'detailed graphics',
    'stationery': 'letterhead',
    'event-branding': 'websites',
    'logo-design': 'logos',
    'classroom-visual': 'only graphics',
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles).map(file => {
      const fileWithPreview: FileWithPreview = file;
      fileWithPreview.preview = URL.createObjectURL(file);
      fileWithPreview.customTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      return fileWithPreview;
    });

    setFiles(prev => [...prev, ...newFiles].slice(0, 10)); // Max 10 files
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateFileTitle = (index: number, title: string) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles[index].customTitle = title;
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one image' });
      return;
    }

    if (!category) {
      setMessage({ type: 'error', text: 'Please select a category' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // Convert files to base64
      const fileData = await Promise.all(
        files.map(async (file) => {
          return new Promise<{ name: string; content: string; title: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = reader.result as string;
              const base64Content = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix
              resolve({
                name: file.name,
                content: base64Content,
                title: file.customTitle || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      const response = await fetch('/api/upload-to-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          files: fileData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `✅ Successfully uploaded ${files.length} image(s)!` });
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setMessage({ type: 'error', text: `❌ Upload failed: ${data.error || 'Unknown error'}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif text-stone-900 mb-2">Upload New Design</h2>
        <p className="text-stone-600">Upload 1-10 images to your portfolio</p>
      </div>

      {/* File Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-stone-300 rounded-xl p-12 text-center cursor-pointer hover:border-accent hover:bg-stone-50 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <Upload className="w-12 h-12 mx-auto text-stone-400 mb-4" />
        <p className="text-stone-600 mb-2">
          Click to select images or drag and drop
        </p>
        <p className="text-sm text-stone-400">PNG, JPG, WEBP up to 10MB each</p>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Category *
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Select a category</option>
          {categoryOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-stone-900">Selected Images ({files.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-stone-200 rounded-lg p-4"
              >
                <div className="relative mb-3">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Image Title
                  </label>
                  <input
                    type="text"
                    value={file.customTitle || ''}
                    onChange={(e) => updateFileTitle(index, e.target.value)}
                    placeholder="Enter title"
                    className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-stone-400 mt-1">{file.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0 || !category}
          className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload to GitHub
            </>
          )}
        </button>
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

export default AdminUpload;
