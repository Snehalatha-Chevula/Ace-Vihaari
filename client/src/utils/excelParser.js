import * as XLSX from 'xlsx';

/**
 * Parses an Excel file and returns the data as an array of objects
 * @param {File} file - The Excel file to parse
 * @returns {Promise<{headers: string[], data: any[]}>} The parsed data
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Assume the first sheet is the one we want
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Separate headers and data
        if (jsonData.length === 0) {
          throw new Error('No data found in the Excel file');
        }
        
        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        
        // Convert rows to objects
        const formattedData = rows.map(row => {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });
        
        resolve({ headers, data: formattedData });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Maps the columns in the imported data to the required fields
 * @param {any[]} data - The imported data
 * @param {Object} columnMap - A mapping of required fields to imported columns
 * @returns {any[]} The mapped data
 */
export const mapColumns = (data, columnMap) => {
  return data.map(row => {
    const mappedRow = {};
    
    Object.entries(columnMap).forEach(([targetField, sourceField]) => {
      if (sourceField && row[sourceField] !== undefined) {
        mappedRow[targetField] = row[sourceField];
      } else {
        mappedRow[targetField] = '';
      }
    });
    
    return mappedRow;
  });
};

/**
 * Validates the required fields in the data
 * @param {any[]} data - The data to validate
 * @param {string[]} requiredFields - The required fields
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
export const validateData = (data, requiredFields) => {
  const errors = [];
  
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field] && row[field] !== 0) {
        errors.push(`Row ${index + 1}: Missing required field "${field}"`);
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};