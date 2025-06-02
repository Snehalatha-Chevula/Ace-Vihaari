import { useState, useEffect } from 'react';
import Button from './ui/Button';
import { DEFAULT_COLUMN_MAP, STUDENT_FIELD_LABELS, REQUIRED_STUDENT_FIELDS } from '../utils/constants';

function ColumnMapping({ headers, onComplete, onCancel }) {
  const [columnMap, setColumnMap] = useState({ ...DEFAULT_COLUMN_MAP });
  const [error, setError] = useState('');
  
  // Auto-map columns that match or contain target field names
  useEffect(() => {
    if (!headers || headers.length === 0) return;
    
    const autoMap = { ...DEFAULT_COLUMN_MAP };
    
    Object.keys(DEFAULT_COLUMN_MAP).forEach(targetField => {
      // Try to find exact match
      const exactMatch = headers.find(
        header => header.toLowerCase() === targetField.toLowerCase() ||
                  header.toLowerCase() === STUDENT_FIELD_LABELS[targetField].toLowerCase()
      );
      
      if (exactMatch) {
        autoMap[targetField] = exactMatch;
        return;
      }
      
      // Try to find partial match
      const partialMatch = headers.find(
        header => header.toLowerCase().includes(targetField.toLowerCase()) ||
                  header.toLowerCase().includes(STUDENT_FIELD_LABELS[targetField].toLowerCase())
      );
      
      if (partialMatch) {
        autoMap[targetField] = partialMatch;
      }
    });
    
    setColumnMap(autoMap);
  }, [headers]);
  
  const handleSelectChange = (targetField, sourceField) => {
    setColumnMap(prev => ({
      ...prev,
      [targetField]: sourceField
    }));
    setError('');
  };
  
  const handleComplete = () => {
    // Validate that all required fields have been mapped
    const missingRequiredFields = REQUIRED_STUDENT_FIELDS.filter(
      field => !columnMap[field]
    );
    
    if (missingRequiredFields.length > 0) {
      setError(`Please map all required fields: ${missingRequiredFields.map(field => STUDENT_FIELD_LABELS[field]).join(', ')}`);
      return;
    }
    
    onComplete(columnMap);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Map Columns</h2>
      
      <p className="text-sm text-gray-600 mb-6">
        Match the columns from your Excel file to the required student fields. 
        Fields marked with * are required.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4 mb-6">
        {Object.keys(columnMap).map(targetField => (
          <div key={targetField} className="flex flex-col sm:flex-row sm:items-center">
            <label className="w-full sm:w-1/3 text-sm font-medium text-gray-700 mb-1 sm:mb-0">
              {STUDENT_FIELD_LABELS[targetField]}
              {REQUIRED_STUDENT_FIELDS.includes(targetField) && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <div className="w-full sm:w-2/3">
              <select
                value={columnMap[targetField]}
                onChange={(e) => handleSelectChange(targetField, e.target.value)}
                className={`
                  block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                  ${REQUIRED_STUDENT_FIELDS.includes(targetField) && !columnMap[targetField] ? 'border-red-300' : ''}
                `}
              >
                <option value="">-- Select Column --</option>
                {headers.map(header => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={handleComplete}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default ColumnMapping;