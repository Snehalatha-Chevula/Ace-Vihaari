import { useState, useRef } from 'react';
import Button from './ui/Button';
import FeedbackMessage from './FeedbackMessage';

function FileUploader({ onFileUpload, acceptedFileTypes = '.xlsx,.xls' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError('');
    
    const files = e.dataTransfer.files;
    validateAndProcessFile(files[0]);
  };
  
  const handleFileSelect = (e) => {
    setError('');
    validateAndProcessFile(e.target.files[0]);
  };
  
  const validateAndProcessFile = (file) => {
    if (!file) return;
    
    // Check file type
    const fileType = file.name.split('.').pop().toLowerCase();
    const isAcceptedType = acceptedFileTypes
      .split(',')
      .some(type => type.includes(fileType));
    
    if (!isAcceptedType) {
      setError(`Invalid file type. Please upload one of these formats: ${acceptedFileTypes}`);
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB. Please upload a smaller file.');
      return;
    }
    
    // Process the file
    onFileUpload(file);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="w-full">
      {error && <FeedbackMessage type="error" message={error} onClose={() => setError('')} />}
      
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-200 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={acceptedFileTypes}
          className="hidden"
        />
        
        <svg 
          className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} 
          stroke="currentColor" 
          fill="none" 
          viewBox="0 0 48 48"
        >
          <path 
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        
        <div className="mt-4 flex text-sm text-gray-600 flex-col items-center">
          <span className="font-medium text-blue-600 hover:text-blue-500">
            Click to upload
          </span>
          <span className="pl-1">or drag and drop</span>
        </div>
        
        <p className="mt-1 text-xs text-gray-500">
          Excel files up to 5MB
        </p>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={triggerFileInput}
          className="w-full sm:w-auto"
        >
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Select File
        </Button>
      </div>
    </div>
  );
}

export default FileUploader;