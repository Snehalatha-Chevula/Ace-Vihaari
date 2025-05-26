import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Filter, Download, FileText, Plus, X,
  FilePlus, Loader2, ListFilter, SortAsc, SortDesc, FileUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import FacultyLayout from '../faculty/FacultyLayout';
import StudentLayout from '../students/StudentLayout';

const Notes = () => {
  const user = JSON.parse(localStorage.getItem('user')).user;
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    subject: 'all',
    type: 'all',
  });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'uploadedAt', direction: 'desc' });
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    subject: '',
    description: '',
    file: null,
    isUploading: false,
  });

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/notes/getNotes/${user.userID}`);
        let data = response.data;
        setNotes(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        setError('Failed to load notes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [filters]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const handleUploadFormChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'file' && files.length > 0) {
      setUploadFormData(prev => ({
        ...prev,
        file: files[0]
      }));
    } else {
      setUploadFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadFormData.file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    try {
      setUploadFormData(prev => ({ ...prev, isUploading: true }));
      
      const formData = new FormData();
      formData.append('file', uploadFormData.file);

      let response = await axios.post('/api/upload',formData);

      const data = await response.data;
      console.log(data);

      if (response.ok) {
        toast.success('Note uploaded successfully!');
        setUploadModalOpen(false);
        setUploadFormData({
          title: '',
          subject: '',
          description: '',
          semester: '',
          file: null,
          isUploading: false,
        });
      } 
      // Refresh notes list
      response = await axios.get(`/api/notes/getNotes/${user.userID}`);
      const newData = response.data;
      setNotes(newData);

    } catch (error) {
      console.error('Failed to upload note:', error);
      toast.error('Failed to upload note. Please try again.');
    } finally {
      setUploadFormData(prev => ({ ...prev, isUploading: false }));
    }
  };

  // Filter and sort notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.NotesSubject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = (filters.subject === 'all' || note.NotesSubject === filters.subject) &&
                          (filters.type === 'all' || note.fileType === filters.type);
    
    return matchesSearch && matchesFilters;
  });

  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortConfig.key === 'uploadedAt') {
      const dateA = new Date(a.uploadAt);
      const dateB = new Date(b.uploadAt);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortConfig.key === 'title') {
      return sortConfig.direction === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortConfig.key === 'downloads') {
      return sortConfig.direction === 'asc' 
        ? a.downloads - b.downloads
        : b.downloads - a.downloads;
    }
    return 0;
  });

  // Get unique values for filters
  const subjects = [...new Set(notes.map(note => note.NotesSubject))];
  const fileTypes = [...new Set(notes.map(note => note.fileType))];


  // Layout based on user role
  

  const Layout = user?.role == 'student' ? StudentLayout : FacultyLayout;

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes & Resources</h1>
          <p className="text-gray-600 mt-1">Access and share academic resources</p>
        </div>
        {user?.role === 'faculty' && (
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Upload Resource
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="flex-1 mb-4 md:mb-0">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search notes by title, subject, or faculty"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => handleSort('title')}
              >
                {sortConfig.key === 'title' ? (
                  sortConfig.direction === 'asc' ? (
                    <SortAsc className="h-5 w-5 text-gray-500" />
                  ) : (
                    <SortDesc className="h-5 w-5 text-gray-500" />
                  )
                ) : (
                  <ListFilter className="h-5 w-5 text-gray-500" />
                )}
                <span className="ml-2">Title</span>
              </button>
            </div>
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => handleSort('uploadedAt')}
              >
                {sortConfig.key === 'uploadedAt' ? (
                  sortConfig.direction === 'asc' ? (
                    <SortAsc className="h-5 w-5 text-gray-500" />
                  ) : (
                    <SortDesc className="h-5 w-5 text-gray-500" />
                  )
                ) : (
                  <ListFilter className="h-5 w-5 text-gray-500" />
                )}
                <span className="ml-2">Date</span>
              </button>
            </div>
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => handleSort('downloads')}
              >
                {sortConfig.key === 'downloads' ? (
                  sortConfig.direction === 'asc' ? (
                    <SortAsc className="h-5 w-5 text-gray-500" />
                  ) : (
                    <SortDesc className="h-5 w-5 text-gray-500" />
                  )
                ) : (
                  <ListFilter className="h-5 w-5 text-gray-500" />
                )}
                <span className="ml-2">Downloads</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="text-sm font-medium text-gray-500 mb-2 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter By:
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <select
                id="subject"
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All File Types</option>
                {fileTypes.map((type, index) => (
                  <option key={index} value={type}>{type.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Available Resources</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {filteredNotes.length} resources found
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse flex flex-col items-center justify-center">
              <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2.5"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <svg className="h-12 w-12 text-error-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-medium text-gray-900">Failed to load notes</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : sortedNotes.length === 0 ? (
          <div className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
            <h2 className="mt-4 text-xl font-medium text-gray-900">No resources found</h2>
            <p className="mt-2 text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search or filters' 
                : 'No resources match the selected filters'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {sortedNotes.map((note, index) => (
              <div key={index} className="bg-white overflow-hidden border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="px-4 pt-4 flex justify-between items-start">
                  <div className={`p-2 rounded-md ${getFileTypeColor(note.fileType)}`}>
                   {getFileTypeIcon(note.fileType)}
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    {formatDate(note.uploadAt)}
                  </div>
                </div>
                <div className="px-4 pb-2">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{note.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{note.Notesdescription}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                        {note.NotesSubject}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {note.size}
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{note.downloads}</span> downloads
                  </div>
                  <button 
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
                {note.uploadedBy && (
                  <div className="px-4 py-2 border-t border-gray-200 text-xs text-gray-500">
                    Uploaded by {note.uploadedBy}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity pointer-events-none" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-1"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FilePlus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Resource</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Share notes, assignments, or other academic resources with students.
                    </p>

                    <form onSubmit={handleUpload} className="mt-4">
                      <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={uploadFormData.title}
                          onChange={handleUploadFormChange}
                          required
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                          Subject
                        </label>
                        <input
                          type="text"
                          name="subject"
                          id="subject"
                          value={uploadFormData.subject}
                          onChange={handleUploadFormChange}
                          required
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                          Semester
                        </label>
                        <select
                          id="semester"
                          name="semester"
                          value={uploadFormData.semester}
                          onChange={handleUploadFormChange}
                          required
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="">Select Semester</option>
                          <option value="1st Semester">1st Semester</option>
                          <option value="2nd Semester">2nd Semester</option>
                          <option value="3rd Semester">3rd Semester</option>
                          <option value="4th Semester">4th Semester</option>
                          <option value="5th Semester">5th Semester</option>
                          <option value="6th Semester">6th Semester</option>
                          <option value="7th Semester">7th Semester</option>
                          <option value="8th Semester">8th Semester</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows="3"
                          value={uploadFormData.description}
                          onChange={handleUploadFormChange}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        ></textarea>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          File
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="file" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id="file" name="file" type="file" onChange={handleUploadFormChange} className="sr-only" />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF, DOC, DOCX, PPT, PPTX up to 10MB
                            </p>
                            {uploadFormData.file && (
                              <p className="text-xs text-gray-900 font-medium mt-2">
                                Selected: {uploadFormData.file.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploadFormData.isUploading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {uploadFormData.isUploading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  disabled={uploadFormData.isUploading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

// Helper functions for file display
function getFileTypeIcon(type) {
  switch (type.toLowerCase()) {
    case 'pdf':
      return <FileText className="h-6 w-6 text-white" />;
    case 'docx':
    case 'doc':
      return <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>;
    case 'pptx':
    case 'ppt':
      return <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>;
    default:
      return <FileText className="h-6 w-6 text-white" />;
  }
}

function getFileTypeColor(type) {
  switch (type.toLowerCase()) {
    case 'pdf':
      return 'bg-red-500';
    case 'docx':
    case 'doc':
      return 'bg-blue-600';
    case 'pptx':
    case 'ppt':
      return 'bg-orange-500';
    default:
      return 'bg-gray-600';
  }
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }).format(date);
}

export default Notes;