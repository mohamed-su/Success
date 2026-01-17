import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface ConfirmationToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const ConfirmationToast: React.FC<ConfirmationToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-400',
          textColor: 'text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-400'
        };
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-400',
          textColor: 'text-red-800',
          icon: XCircle,
          iconColor: 'text-red-400'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-400',
          textColor: 'text-yellow-800',
          icon: AlertCircle,
          iconColor: 'text-yellow-400'
        };
      case 'info':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-400',
          textColor: 'text-blue-800',
          icon: Info,
          iconColor: 'text-blue-400'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-400',
          textColor: 'text-gray-800',
          icon: Info,
          iconColor: 'text-gray-400'
        };
    }
  };

  const config = getToastConfig();
  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`max-w-sm w-full ${config.bgColor} border-l-4 ${config.borderColor} p-4 rounded-md shadow-lg`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
          </div>
          <div className="ml-3">
            <p className={`text-sm font-medium ${config.textColor}`}>
              {message}
            </p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${config.textColor} hover:bg-opacity-20 focus:outline-none`}
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationToast;
