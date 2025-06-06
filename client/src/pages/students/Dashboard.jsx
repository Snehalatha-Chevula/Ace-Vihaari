import React, { useEffect, useState } from 'react';
import { ChevronRight, Users, BookText, CheckCircle, X, AlertCircle } from 'lucide-react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import Home from './StudentLayout';
import { useUser } from '../../context/userContext';

const Dashboard = () => {
  const {user,loading}= useUser();
  if (loading) return <div>Loading...</div>;
  const [dashboardData, setDashboardData] = useState({
    user : 'Student',
    performance: {},
    attendance: {},
    totalProblemsSolved : 0,
    loading: true,
    error: null
  });
  let cgpas;
  useEffect(() => {
    if(!user)
        return;
    const fetchDashboardData = async () => {
      try {
        const {userID} = user;
        let performance = await axios.post('/api/dashboard/getPerformanceData',{userID});
        performance = performance.data.message;
        let attendance = await axios.post('/api/dashboard/getAttendanceData',{userID});
        attendance = attendance.data.message;
        let userName = await axios.post('/api/dashboard/getUserName',{userID});
        let fullName = userName.data.message.fullName;
        const res = await axios.get(`/api/dashboard/getTotalProblems/${userID}`);
        const {totalProblemsSolved} = res.data;
        cgpas = performance.cgpaHistory;
        while(cgpas.length < 8){
          cgpas.push(null);
        }
        performance.cgpaHistory = cgpas;

        setDashboardData({
          fullName,
          performance,
          attendance,
          totalProblemsSolved,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load dashboard data. Please try again later.'
        }));
      }
    };

    fetchDashboardData();
  }, []);

  // CGPA Chart options
  const cgpaChartOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#3b82f6'],
    xaxis: {
      categories: ["Sem1","Sem2","Sem3","Sem4","Sem5","Sem6","Sem7","Sem8"]
    },
    yaxis: {
      min: 0,
      max: 10,
      tickAmount: 5,
      labels: {
        formatter: function(val) {
          return val.toFixed(1);
        }
      }
    },
    markers: {
      size: 5,
      colors: ['#3b82f6'],
      strokeWidth: 0,
      hover: {
        size: 7
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val.toFixed(2) + ' CGPA';
        }
      }
    }
  };

  // Attendance Chart options
  const attendanceChartOptions = {
    chart: {
      type: 'radialBar',
      sparkline: {
        enabled: true
      }
    },
    colors: ['#10b981'],
    plotOptions: {
      radialBar: {
        hollow: {
          size: '65%',
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
          },
          value: {
            fontSize: '16px',
            fontWeight: 600,
            formatter: function(val) {
              return val + '%';
            }
          }
        }
      }
    },
    labels: ['Attendance']
  };

  if (dashboardData.loading) {
    return (
      <Home>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary-200"></div>
            <div className="mt-4 text-gray-500">Loading dashboard data...</div>
          </div>
        </div>
      </Home>
    );
  }

  if (dashboardData.error) {
    return (
      <Home>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-error-500 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Failed to load dashboard</h2>
            <p className="mt-2 text-gray-600">{dashboardData.error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        </div>
      </Home>
    );
  }

  return (
    <Home>
      {/* Welcome Message */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-tight text-gray-900">
            Welcome back, {dashboardData.user}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here's your academic performance overview
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Current CGPA</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">{dashboardData.performance.currentCGPA}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Attendance</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">{dashboardData.attendance.attendance}%</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-secondary-100 rounded-md p-3">
                <svg className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Coding Problems</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">{dashboardData.totalProblemsSolved}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <BookText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Semester</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">{dashboardData.performance.currentSem}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="flex justify-center align-middle">
        {/* CGPA Progress */}
        <div className="bg-white overflow-hidden shadow rounded-lg w-50 sm:w-70 md:w-50 lg:w-50 xl:w-200 ">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">CGPA Progression</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <Chart 
              options={cgpaChartOptions} 
              series={[{
                name: 'CGPA',
                data:  dashboardData.performance.cgpaHistory
              }]} 
              type="line" 
              height={320} 
            />
          </div>
        </div>
      </div>
    </Home>
  );
};


export default Dashboard;