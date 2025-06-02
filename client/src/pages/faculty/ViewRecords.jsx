import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Button from '../../components/ui/Button';
import FeedbackMessage from '../../components/FeedbackMessage';

function ViewRecords() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Sample student data
  const sampleStudents = [
    {
      rollNumber: '20CS01',
      branch: 'Computer Science',
      semester: '4',
      attendance: '85',
      section: 'A',
      cgpa: '8.5'
    },
    {
      rollNumber: '20CS02',
      branch: 'Computer Science',
      semester: '4',
      attendance: '92',
      section: 'B',
      cgpa: '9.2'
    },
    {
      rollNumber: '20EC01',
      branch: 'Electronics',
      semester: '4',
      attendance: '78',
      section: 'A',
      cgpa: '7.8'
    },
    {
      rollNumber: '20EC090',
      branch: 'civil',
      semester: '6',
      attendance: '78',
      section: 'A',
      cgpa: '7.8'
    }
  ];
  
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const storedData = localStorage.getItem('studentData');
        const data = storedData ? JSON.parse(storedData) : sampleStudents;
        setStudents(data);
      } catch (err) {
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  const getFilteredStudents = () => {
    if (activeFilter === 'all') return students;
    return students.filter(student => student.branch === activeFilter);
  };

  const uniqueBranches = [...new Set(students.map(student => student.branch))].filter(Boolean);
  
  const getHeaders = () => {
    if (students.length === 0) return [];
    return Object.keys(students[0]);
  };

  const handleExport = () => {
    const filteredStudents = getFilteredStudents();
    
    if (filteredStudents.length === 0) {
      setError('No data to export');
      return;
    }
    
    const headers = getHeaders();
    const csvRows = [headers.join(',')];
    
    filteredStudents.forEach(student => {
      const values = headers.map(header => {
        const value = student[header] || '';
        return value.toString().includes(',') ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Records</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage student data</p>
      </header>
      
      {error && (
        <FeedbackMessage
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by Branch:</span>
          
          <Button
            variant={activeFilter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            All
          </Button>
          
          {uniqueBranches.map(branch => (
            <Button
              key={branch}
              variant={activeFilter === branch ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(branch)}
            >
              {branch}
            </Button>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="inline-flex items-center"
        >
          Export to CSV
        </Button>
      </div>
      
      {loading ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student data...</p>
        </div>
      ) : (
        <DataTable
          data={getFilteredStudents()}
          headers={getHeaders()}
        />
      )}
    </div>
  );
}

export default ViewRecords;