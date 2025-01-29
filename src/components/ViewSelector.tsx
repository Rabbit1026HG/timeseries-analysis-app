import React from 'react';
import { ViewMode } from '../types';

interface ViewSelectorProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({ activeView, onViewChange }) => {
  const views: ViewMode[] = ['daily', 'monthly', 'yearly'];
  
  return (
    <div className="flex space-x-2 mb-6">
      {views.map((view) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className={`px-4 py-2 rounded-md capitalize ${
            activeView === view
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {view}
        </button>
      ))}
    </div>
  );
};