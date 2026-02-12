import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-stone-600 mb-2">
                  Are you sure you want to delete <span className="font-semibold text-stone-900">{itemName}</span>?
                </p>
                <p className="text-sm text-stone-500">
                  This action cannot be undone. The image will be permanently removed from your portfolio.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-6 border-t border-stone-200">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
