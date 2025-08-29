import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface DemoModeToggleProps {
  isDemoMode: boolean;
  onToggle: () => void;
}

const DemoModeToggle: React.FC<DemoModeToggleProps> = ({ isDemoMode, onToggle }) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Demo Mode</span>
          <button
            onClick={onToggle}
            className="flex items-center space-x-1 text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {isDemoMode ? (
              <>
                <ToggleRight className="w-3 h-3 text-green-600" />
                <span className="text-green-600">ON</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-3 h-3 text-gray-500" />
                <span className="text-gray-500">OFF</span>
              </>
            )}
          </button>
        </div>
        {isDemoMode && (
          <div className="mt-2 text-xs text-gray-500">
            Using demo credentials
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoModeToggle;
