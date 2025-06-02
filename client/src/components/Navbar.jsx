import React from 'react';
import { Upload, Database } from 'lucide-react';

function Navbar({ activeView, onViewChange }) {
  return (
    <nav className="bg-white shadow-md px-4 py-3">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-3 sm:mb-0">
          <h1 className="text-xl font-bold text-gray-800">Student Data Manager</h1>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => onViewChange('upload')}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              activeView === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Upload size={18} className="mr-2" />
            Upload Data
          </button>
          
          <button
            onClick={() => onViewChange('view')}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              activeView === 'view'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Database size={18} className="mr-2" />
            View Records
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;