import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  if (!isOpen) return null;

  const colors = {
    danger: {
      button: 'bg-red-500 hover:bg-red-600',
      icon: 'text-red-500',
      border: 'border-red-500/30',
    },
    warning: {
      button: 'bg-yellow-500 hover:bg-yellow-600',
      icon: 'text-yellow-500',
      border: 'border-yellow-500/30',
    },
    success: {
      button: 'bg-green-500 hover:bg-green-600',
      icon: 'text-green-500',
      border: 'border-green-500/30',
    },
  };

  const colorStyle = colors[type] || colors.warning;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative bg-black/90 backdrop-blur-xl rounded-2xl max-w-md w-full p-6 border ${colorStyle.border} shadow-2xl`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          >
            <FiX size={20} />
          </button>
          
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full bg-white/10 ${colorStyle.icon}`}>
              <FiAlertTriangle size={28} />
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-playfair font-bold text-white text-center mb-2">
            {title || 'Confirm Action'}
          </h3>
          
          {/* Message */}
          <p className="text-gray-300 text-center mb-6">
            {message || 'Are you sure you want to proceed?'}
          </p>
          
          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 rounded-full text-white font-semibold transition ${colorStyle.button}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;