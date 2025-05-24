import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Filter } from 'lucide-react';
import axios from 'axios';
import  Home  from './Home';
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
        
        setLeaderboardData(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [leaderboardType]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Layout based on user role
  //const Layout = user?.role === 'faculty' ? FacultyLayout : StudentLayout;

  return (
    <Home>
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
              <option value="cse">CSE</option>
              <option value="ece">CSM</option>
              <option value="me">IOT</option>
              <option value="ce">CSD</option>
              <option value="ee">IT</option>
              <option value="me">ECE</option>
              <option value="ce">EEE</option>
              <option value="ee">CIVIL</option>
              <option value="ee">MECH</option>
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
    </Home>
  );
};

// Mock data for development
function getMockLeaderboardData(type) {
  if (type === 'cgpa') {
    return [
      { name: 'Emma Johnson', branch: 'CSE', semester: '5th', cgpa: 9.82, trend: [9.2, 9.4, 9.6, 9.7, 9.82], trendDirection: 'up', lastChange: '+0.12' },
      { name: 'Alex Chen', branch: 'CSE', semester: '5th', cgpa: 9.75, trend: [9.3, 9.5, 9.6, 9.7, 9.75], trendDirection: 'up', lastChange: '+0.05' },
      { name: 'Sophia Martinez', branch: 'ECE', semester: '7th', cgpa: 9.68, trend: [9.4, 9.5, 9.55, 9.6, 9.68], trendDirection: 'up', lastChange: '+0.08' },
      { name: 'James Wilson', branch: 'CSE', semester: '5th', cgpa: 9.64, trend: [9.7, 9.65, 9.6, 9.62, 9.64], trendDirection: 'up', lastChange: '+0.02' },
      { name: 'Ava Thompson', branch: 'ME', semester: '5th', cgpa: 9.61, trend: [9.65, 9.63, 9.62, 9.6, 9.61], trendDirection: 'up', lastChange: '+0.01' },
      { name: 'Noah Williams', branch: 'CSE', semester: '7th', cgpa: 9.58, trend: [9.65, 9.62, 9.6, 9.59, 9.58], trendDirection: 'down', lastChange: '-0.01' },
      { name: 'Isabella Brown', branch: 'ECE', semester: '5th', cgpa: 9.55, trend: [9.4, 9.45, 9.5, 9.52, 9.55], trendDirection: 'up', lastChange: '+0.03' },
      { name: 'Liam Davis', branch: 'CE', semester: '7th', cgpa: 9.52, trend: [9.58, 9.56, 9.54, 9.53, 9.52], trendDirection: 'down', lastChange: '-0.01' },
      { name: 'Mia Rodriguez', branch: 'CSE', semester: '5th', cgpa: 9.48, trend: [9.38, 9.42, 9.44, 9.46, 9.48], trendDirection: 'up', lastChange: '+0.02' },
      { name: 'Ethan Garcia', branch: 'EE', semester: '7th', cgpa: 9.45, trend: [9.35, 9.38, 9.4, 9.42, 9.45], trendDirection: 'up', lastChange: '+0.03' },
    ];
  } else if (type === 'coding') {
    return [
      { name: 'Noah Williams', branch: 'CSE', semester: '7th', problemsSolved: 512, trend: [450, 468, 485, 498, 512], trendDirection: 'up', lastChange: '+14' },
      { name: 'Emma Johnson', branch: 'CSE', semester: '5th', problemsSolved: 487, trend: [420, 440, 455, 470, 487], trendDirection: 'up', lastChange: '+17' },
      { name: 'Liam Davis', branch: 'CE', semester: '7th', problemsSolved: 456, trend: [430, 438, 445, 450, 456], trendDirection: 'up', lastChange: '+6' },
      { name: 'Sophia Martinez', branch: 'ECE', semester: '7th', problemsSolved: 432, trend: [410, 418, 425, 430, 432], trendDirection: 'up', lastChange: '+2' },
      { name: 'Alex Chen', branch: 'CSE', semester: '5th', problemsSolved: 415, trend: [425, 422, 420, 418, 415], trendDirection: 'down', lastChange: '-3' },
      { name: 'Isabella Brown', branch: 'ECE', semester: '5th', problemsSolved: 398, trend: [380, 385, 390, 395, 398], trendDirection: 'up', lastChange: '+3' },
      { name: 'James Wilson', branch: 'CSE', semester: '5th', problemsSolved: 387, trend: [365, 370, 378, 382, 387], trendDirection: 'up', lastChange: '+5' },
      { name: 'Mia Rodriguez', branch: 'CSE', semester: '5th', problemsSolved: 362, trend: [350, 355, 358, 360, 362], trendDirection: 'up', lastChange: '+2' },
      { name: 'Ethan Garcia', branch: 'EE', semester: '7th', problemsSolved: 345, trend: [350, 348, 346, 345, 345], trendDirection: 'down', lastChange: '0' },
      { name: 'Ava Thompson', branch: 'ME', semester: '5th', problemsSolved: 324, trend: [310, 315, 318, 322, 324], trendDirection: 'up', lastChange: '+2' },
    ];
  } else { // attendance
    return [
      { name: 'Sophia Martinez', branch: 'ECE', semester: '7th', attendance: 99.2, trend: [98.5, 98.8, 99.0, 99.1, 99.2], trendDirection: 'up', lastChange: '+0.1%' },
      { name: 'Emma Johnson', branch: 'CSE', semester: '5th', attendance: 98.8, trend: [98.2, 98.4, 98.6, 98.7, 98.8], trendDirection: 'up', lastChange: '+0.1%' },
      { name: 'Alex Chen', branch: 'CSE', semester: '5th', attendance: 98.5, trend: [98.3, 98.4, 98.4, 98.5, 98.5], trendDirection: 'up', lastChange: '0%' },
      { name: 'Isabella Brown', branch: 'ECE', semester: '5th', attendance: 98.1, trend: [97.8, 97.9, 98.0, 98.0, 98.1], trendDirection: 'up', lastChange: '+0.1%' },
      { name: 'James Wilson', branch: 'CSE', semester: '5th', attendance: 97.9, trend: [98.2, 98.1, 98.0, 97.9, 97.9], trendDirection: 'down', lastChange: '0%' },
      { name: 'Liam Davis', branch: 'CE', semester: '7th', attendance: 97.4, trend: [97.6, 97.5, 97.5, 97.4, 97.4], trendDirection: 'down', lastChange: '0%' },
      { name: 'Mia Rodriguez', branch: 'CSE', semester: '5th', attendance: 97.2, trend: [96.8, 96.9, 97.0, 97.1, 97.2], trendDirection: 'up', lastChange: '+0.1%' },
      { name: 'Noah Williams', branch: 'CSE', semester: '7th', attendance: 96.8, trend: [97.0, 96.9, 96.9, 96.8, 96.8], trendDirection: 'down', lastChange: '0%' },
      { name: 'Ava Thompson', branch: 'ME', semester: '5th', attendance: 96.5, trend: [96.2, 96.3, 96.4, 96.4, 96.5], trendDirection: 'up', lastChange: '+0.1%' },
      { name: 'Ethan Garcia', branch: 'EE', semester: '7th', attendance: 96.2, trend: [96.0, 96.0, 96.1, 96.1, 96.2], trendDirection: 'up', lastChange: '+0.1%' },
    ];
  }
}

export default LeaderboardPage;