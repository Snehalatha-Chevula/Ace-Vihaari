import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Filter } from 'lucide-react';
import axios from 'axios';
import StudentLayout from '../students/StudentLayout';
import FacultyLayout from '../faculty/FacultyLayout';

const LeaderboardPage = () => {
  const userID = JSON.parse(localStorage.getItem('user')).user.userID;
  const user = JSON.parse(localStorage.getItem('user')).user;
  const [leaderboardType, setLeaderboardType] = useState('cgpa');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    semester: 'all',
    branch: 'all',
  });

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        
        const res = await axios.get(`/api/leaderboard/${leaderboardType}`);
        
        const data = res.data.message.rows;

        const filteredData = data.filter(userData => {
          return (filters.semester === 'all' || userData.semester == filters.semester) &&
                                (filters.branch === 'all' || userData.branch === filters.branch);
        });
        
        setLeaderboardData(filteredData);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [leaderboardType,filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };



  // Layout based on user role
  const Layout = user?.role === 'faculty' ? FacultyLayout : StudentLayout;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-600 mt-1">View top performers across different categories</p>
      </div>

      {/* Leaderboard Type Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setLeaderboardType('cgpa')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                leaderboardType === 'cgpa'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Trophy className="h-5 w-5 mx-auto mb-1" />
              Academic (CGPA)
            </button>
            <button
              onClick={() => setLeaderboardType('coding')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                leaderboardType === 'coding'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Medal className="h-5 w-5 mx-auto mb-1" />
              Coding
            </button>
            <button
              onClick={() => setLeaderboardType('attendance')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                leaderboardType === 'attendance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Award className="h-5 w-5 mx-auto mb-1" />
              Attendance
            </button>
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 mr-2 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select
              id="semester"
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Semesters</option>
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
              <option value="3">3rd Semester</option>
              <option value="4">4th Semester</option>
              <option value="5">5th Semester</option>
              <option value="6">6th Semester</option>
              <option value="7">7th Semester</option>
              <option value="8">8th Semester</option>
            </select>
          </div>
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <select
              id="branch"
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="CSM">CSM</option>
              <option value="IOT">IOT</option>
              <option value="CSD">CSD</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="CIVIL">CIVIL</option>
              <option value="MECH">MECH</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
            <h2 className="mt-4 text-xl font-medium text-gray-900">Failed to load leaderboard</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                {leaderboardType === 'cgpa' && 'Academic Excellence Leaderboard'}
                {leaderboardType === 'coding' && 'Coding Champions Leaderboard'}
                {leaderboardType === 'attendance' && 'Attendance Stars Leaderboard'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th scope="col" className="px-20 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {leaderboardType === 'cgpa' && 'CGPA'}
                      {leaderboardType === 'coding' && 'Problems Solved'}
                      {leaderboardType === 'attendance' && 'Attendance'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboardData.map((student, index) => (
                    <tr key={index} className={index < 3 ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index === 0 && (
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                              <Trophy className="h-5 w-5 text-yellow-600" />
                            </div>
                          )}
                          {index === 1 && (
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <Medal className="h-5 w-5 text-gray-600" />
                            </div>
                          )}
                          {index === 2 && (
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-50 flex items-center justify-center">
                              <Award className="h-5 w-5 text-yellow-700" />
                            </div>
                          )}
                          {index > 2 && (
                            <div className="ml-2 text-sm font-medium text-gray-900">
                              {index + 1}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{student.userID}</div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                            {student.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.branch} - {student.semester} Semester</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {leaderboardType === 'cgpa' && `${student.cgpa} / 10`}
                          {leaderboardType === 'coding' && `${student.problemsSolved} problems`}
                          {leaderboardType === 'attendance' && `${student.attendance}%`}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};



export default LeaderboardPage;