import { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import ColumnMapping from '../../components/ColumnMapping';
import DataTable from '../../components/DataTable';
import Button from '../../components/ui/Button';
import FeedbackMessage from '../../components/FeedbackMessage';
import { parseExcelFile, mapColumns, validateData } from '../../utils/excelParser';
import { REQUIRED_STUDENT_FIELDS } from '../../utils/constants';
import axios from 'axios';

// Upload steps
const STEPS = {
  UPLOAD: 'upload',
  MAP_COLUMNS: 'map_columns',
  PREVIEW: 'preview',
  COMPLETE: 'complete'
};

function UploadPage() {
  const [currentStep, setCurrentStep] = useState(STEPS.UPLOAD);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [excelData, setExcelData] = useState({ headers: [], data: [] });
  const [mappedData, setMappedData] = useState([]);
  const [columnMap, setColumnMap] = useState({});
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setFeedback({ type: '', message: '' });
    setIsLoading(true);
    
    try {
      const parsedData = await parseExcelFile(file);
      setExcelData(parsedData);
      setCurrentStep(STEPS.MAP_COLUMNS);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: `Failed to parse Excel file: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleColumnMappingComplete = (mappingResult) => {
    setColumnMap(mappingResult);
    
    // Map the data using the column mapping
    const mapped = mapColumns(excelData.data, mappingResult);
    setMappedData(mapped);
    
    // Validate the mapped data
    const validation = validateData(mapped, REQUIRED_STUDENT_FIELDS);
    
    if (!validation.valid) {
      setFeedback({
        type: 'warning',
        message: `There are issues with the data: ${validation.errors[0]}${
          validation.errors.length > 1 ? ` and ${validation.errors.length - 1} more errors` : ''
        }`
      });
    }
    
    setCurrentStep(STEPS.PREVIEW);
  };
  
  const handleColumnMappingCancel = () => {
    setCurrentStep(STEPS.UPLOAD);
    setExcelData({ headers: [], data: [] });
  };
  
  const handleSaveData = async () => {
    // In a real app, this would save the data to a database
    setIsLoading(true);
    localStorage.setItem('studentData',JSON.stringify(mappedData));
    const res = await axios.post('/api/studentData/setData',mappedData);
    console.log(res);
    setTimeout(() => {
      console.log(mappedData);
      setIsLoading(false);
      setCurrentStep(STEPS.COMPLETE);
      setFeedback({
        type: 'success',
        message: `Successfully imported ${mappedData.length} student records.`
      });
    }, 1000);
  };
  
  const handleReset = () => {
    setCurrentStep(STEPS.UPLOAD);
    setUploadedFile(null);
    setExcelData({ headers: [], data: [] });
    setMappedData([]);
    setColumnMap({});
    setFeedback({ type: '', message: '' });
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.UPLOAD:
        return (
          <div className="max-w-2xl mx-auto">
            <FileUploader onFileUpload={handleFileUpload} />
          </div>
        );
      
      case STEPS.MAP_COLUMNS:
        return (
          <div className="max-w-2xl mx-auto">
            <ColumnMapping 
              headers={excelData.headers}
              onComplete={handleColumnMappingComplete}
              onCancel={handleColumnMappingCancel}
            />
          </div>
        );
      
      case STEPS.PREVIEW:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Preview</h2>
              <p className="text-sm text-gray-600">
                Review the data below before saving. The data has been mapped according to your selections.
              </p>
            </div>
            
            <DataTable 
              data={mappedData}
              headers={Object.keys(columnMap).filter(key => columnMap[key])}
            />
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(STEPS.MAP_COLUMNS)}
              >
                Back
              </Button>
              <Button
                onClick={handleSaveData}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Data'}
              </Button>
            </div>
          </div>
        );
      
      case STEPS.COMPLETE:
        return (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-gray-800">Upload Complete!</h2>
              <p className="mt-2 text-gray-600">
                You have successfully imported {mappedData.length} student records.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button onClick={handleReset}>
                Upload Another File
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Student Data</h1>
        <p className="mt-1 text-sm text-gray-500">Import student records from an Excel file</p>
      </header>
      
      <div className="bg-white shadow rounded-lg p-6">
        {feedback.message && (
          <div className="mb-6">
            <FeedbackMessage
              type={feedback.type}
              message={feedback.message}
              onClose={() => setFeedback({ type: '', message: '' })}
            />
          </div>
        )}
        
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {Object.values(STEPS).map((step, index) => {
                const isActive = currentStep === step;
                const isComplete = 
                  Object.values(STEPS).indexOf(currentStep) > 
                  Object.values(STEPS).indexOf(step);
                
                return (
                  <li key={step} className={`relative ${index !== 0 ? 'ml-5 sm:ml-10' : ''}`}>
                    <div className="flex items-center">
                      {index !== 0 && (
                        <div className="hidden sm:block absolute top-1/2 left-0 w-full h-0.5 transform -translate-x-full -translate-y-1/2 bg-gray-300">
                          <div 
                            className={`h-0.5 bg-blue-600 transition-all duration-300 ${
                              isComplete || isActive ? 'w-full' : 'w-0'
                            }`}
                          ></div>
                        </div>
                      )}
                      <div
                        className={`
                          relative flex items-center justify-center w-8 h-8 rounded-full
                          ${isActive ? 'bg-blue-100 border-2 border-blue-600' : ''}
                          ${isComplete ? 'bg-blue-600' : 'bg-gray-100'}
                          transition-colors duration-300
                        `}
                      >
                        {isComplete ? (
                          <svg className="w-4 h-4 text-white\" xmlns="http://www.w3.org/2000/svg\" viewBox="0 0 20 20\" fill="currentColor">
                            <path fillRule="evenodd\" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                            {index + 1}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="hidden sm:block mt-2">
                      <span className={`text-xs font-medium ${
                        isActive ? 'text-blue-600' : isComplete ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
        
        {renderStepContent()}
      </div>
    </div>
  );
}

export default UploadPage;