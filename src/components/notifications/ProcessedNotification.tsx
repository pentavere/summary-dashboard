import { X } from 'lucide-react';

const ProcessedNotification = ({ message, onClose }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-800 text-sm font-medium rounded-lg shadow-sm border border-green-200 animate-fadeIn w-fit">
    {message}
    <button
      onClick={onClose}
      className="text-green-800 hover:text-green-900 flex-shrink-0"
      aria-label="Close notification"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

export default ProcessedNotification;