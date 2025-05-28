import React, { useState, useEffect } from 'react';
import { Code, Trophy, Star, TrendingUp, GitBranch } from 'lucide-react';
import StudentLayout from './StudentLayout';
import Chart from 'react-apexcharts';
import axios from 'axios';


const CodingPerformance = () => {

  const userID = JSON.parse(localStorage.getItem("user")).user.userID;
  const [performanceData, setPerformanceData] = useState({
    loading: true,
    error: null,
    leetcode : {},
    gfg : {},
    codechef : {}
  });
  let  leetcodeStats;
  let gfgStats;
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        // Mock data for development
        let res = await axios.get(`/api/codingstats/getLeetcodeStats/${userID}`);
        leetcodeStats = res.data;
        console.log("leetcode stats",leetcodeStats);
        res = await axios.get(`/api/codingstats/getgfgStats/${userID}`);
        gfgStats = res.data;
        console.log("gfg stats",gfgStats);
        const data = {
          totalSolved: 342,
          ranking: {
            college: 15,
            global: 45892
          },
          platforms: {
            leetcode: {
              username: 'techmaster',
              solved: 145,
              ranking: 12543,
              streak: 15,
              recentSubmissions: [
                { date: '2024-03-01', count: 3 },
                { date: '2024-03-02', count: 2 },
                { date: '2024-03-03', count: 4 },
                { date: '2024-03-04', count: 1 },
                { date: '2024-03-05', count: 3 },
                { date: '2024-03-06', count: 2 },
                { date: '2024-03-07', count: 5 }
              ],
              difficultyStats: {
                easy: 45,
                medium: 85,
                hard: 15
              }
            },
            gfg: {
              username: 'codemaster',
              solved: 98,
              ranking: 8765,
              streak: 8,
              recentSubmissions: [
                { date: '2024-03-01', count: 2 },
                { date: '2024-03-02', count: 1 },
                { date: '2024-03-03', count: 3 },
                { date: '2024-03-04', count: 2 },
                { date: '2024-03-05', count: 1 },
                { date: '2024-03-06', count: 4 },
                { date: '2024-03-07', count: 2 }
              ],
              difficultyStats: {
                basic: 30,
                easy: 40,
                medium: 20,
                hard: 8
              }
            },
            hackerrank: {
              username: 'algopro',
              solved: 99,
              ranking: 5432,
              streak: 12,
              recentSubmissions: [
                { date: '2024-03-01', count: 1 },
                { date: '2024-03-02', count: 3 },
                { date: '2024-03-03', count: 2 },
                { date: '2024-03-04', count: 4 },
                { date: '2024-03-05', count: 2 },
                { date: '2024-03-06', count: 1 },
                { date: '2024-03-07', count: 3 }
              ],
              difficultyStats: {
                easy: 35,
                intermediate: 45,
                advanced: 19
              }
            }
          }
        };

        setPerformanceData({
          loading: false,
          error: null,
          leetcode : leetcodeStats,
          gfg : gfgStats
        });
      } catch (error) {
        console.error('Failed to fetch coding performance data:', error);
        setPerformanceData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load performance data'
        }));
      }
    };

    fetchPerformanceData();
  }, []);

  const submissionChartOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'dd MMM'
      }
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: (val) => Math.floor(val)
      }
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy'
      }
    },
    legend: {
      show: true,
      position: 'top'
    }
  };

  const difficultyChartOptions = {
    chart: {
      type: 'donut',
    },
    legend: {
      position: 'bottom'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  if (performanceData.loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary-200"></div>
            <div className="mt-4 text-gray-500">Loading performance data...</div>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (performanceData.error) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Code className="h-12 w-12 text-error-500 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Failed to load performance data</h2>
            <p className="mt-2 text-gray-600">{performanceData.error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        </div>
      </StudentLayout>
    );
  }

  const { stats } = performanceData;

  return (
    <StudentLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coding Performance</h1>
        <p className="text-gray-600 mt-1">Track your progress across different coding platforms</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 gap-10 mb-8 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <Code className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Problems Solved</dt>
                  <dd className="text-lg font-semibold text-gray-900">{40}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">College Rank</dt>
                  <dd className="text-lg font-semibold text-gray-900">#{1}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8">
        {/* LeetCode */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">LeetCode</h3>
            <p className="mt-1 text-sm text-gray-500">{performanceData.leetcode.userName}</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Problems Solved</span>
                <span className="text-sm font-medium text-gray-900">{performanceData.leetcode.totalSolved}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Ranking</span>
                <span className="text-sm font-medium text-gray-900">#{performanceData.leetcode.ranking}</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-5">Difficulty Distribution</h4>
              <Chart
                options={{
                  ...difficultyChartOptions,
                  labels: ['Easy', 'Medium', 'Hard'],
                  colors: ['#10b981', '#f59e0b', '#ef4444']
                }}
                series={[
                  performanceData.leetcode.easySolved,
                  performanceData.leetcode.mediumSolved,
                  performanceData.leetcode.hardSolved,
                ]}
                type="donut"
                height={250}
              />
            </div>
          </div>
        </div>

        {/* GeeksForGeeks */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">GeeksForGeeks</h3>
            <p className="mt-1 text-sm text-gray-500">{performanceData.gfg.userName}</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Problems Solved</span>
                <span className="text-sm font-medium text-gray-900">{performanceData.gfg.ProblemsSolved}</span>
              </div>   
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-5">Difficulty Distribution</h4>
              <Chart
                options={{
                  ...difficultyChartOptions,
                  labels: ['Basic', 'Easy', 'Medium', 'Hard'],
                  colors: ['#60a5fa', '#10b981', '#f59e0b', '#ef4444']
                }}
                series={[
                  performanceData.gfg.pd[0],
                  performanceData.gfg.pd[1],
                  performanceData.gfg.pd[2],
                  performanceData.gfg.pd[3]
                ]}
                type="donut"
                height={250}
              />
            </div>
          </div>
        </div>
       
      </div>
      
    </StudentLayout>
  );
};

export default CodingPerformance;