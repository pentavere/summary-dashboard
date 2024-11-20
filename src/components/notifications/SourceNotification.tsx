import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SourceNotification = ({ message, onClose, onPrevious, onNext, showNavigation }) => (
    <div className="flex items-center justify-between gap-4 px-4 py-2 bg-green-50 text-green-800 text-sm font-medium rounded-lg shadow-sm border border-green-200 animate-fadeIn">
      <Button
        variant="outline"
        className="text-green-800 border-green-800 hover:bg-green-100"
        onClick={onPrevious}
        disabled={!showNavigation}
      >
        Previous
      </Button>
      <span>{message}</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="text-green-800 border-green-800 hover:bg-green-100"
          onClick={onNext}
          disabled={!showNavigation}
        >
          Next
        </Button>
        <button
          onClick={onClose}
          className="text-green-800 hover:text-green-900"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

export default SourceNotification;