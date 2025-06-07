import React, { useState, useEffect } from 'react';
import { Code, Trophy, Star, TrendingUp, GitBranch } from 'lucide-react';
import StudentLayout from './StudentLayout';
import Chart from 'react-apexcharts';
import Toggle from './CodingStatsUI/Toggle';
import DistributionChart from './CodingStatsUI/DistributionChart';
import PlatformCard from './CodingStatsUI/PlatformCard';
import axios from 'axios';
import { useUser } from '../../context/userContext';

const CodingPerformance = () => {
  const {user,loading}= useUser();
  const userID = user?.userID;
  const [performanceData, setPerformanceData] = useState({
    loading: true,
    error: null,
    platforms : [
      {},
      {},
      {}
    ],
    totalProblems : 0,
    totalScore : 0,
  });
  const [viewMode, setViewMode] = useState('problems');

  useEffect(() => {
    if(!user)
      return;
    const fetchData = async () => {

      try {
        let response = await axios.get(`/api/codingstats/getCodingStats/${userID}`);
        const data = response.data.platforms;

        const leetcode = data[0];
        const gfg = data[1];
        const codechef = data[2];

        const leetcodeScore = Number((leetcode.easySolved * 1 + leetcode.mediumSolved * 2.5 + leetcode.hardSolved * 4).toFixed(0));
        const gfgScore = Number((Number(gfg.pd[0]) * 0.33 + Number(gfg.pd[1]) * 0.5 + Number(gfg.pd[2]) * 1 + Number(gfg.pd[3]) * 2.5 + Number(gfg.pd[4]) * 4).toFixed(0));
        const codechefScore = Number((Number(codechef.totalProblems) * 1 + (Number(codechef.rating) - 1000)/25).toFixed(0)); 
   
        let tp = Number(leetcode.totalSolved) + Number(gfg.problemsSolved) + Number(codechef.totalProblems);
        let ts = Number((leetcodeScore + gfgScore + codechefScore).toFixed(0));

        setPerformanceData(prev => ({
          ...prev,
          loading : false,
          platforms : [
            {
              id: "leetcode",
              name: "LeetCode",
              icon: "Code",
              color: "#FFA116",
              username : leetcode.leetcode,  
              problemsSolved: leetcode.totalSolved,
              score: leetcodeScore
            },
            {
              id: "geeksforgeeks",
              name: "GeeksForGeeks",
              username : gfg.gfg, 
              icon: "BookOpen",
              color: "#2F8D46",
              problemsSolved: gfg.problemsSolved,
              score: gfgScore
            },
            {
              id: "codechef",
              name: "CodeChef",
              username : codechef.codechef, 
              icon: "ChefHat",
              color: "#5B4638",
              problemsSolved: codechef.totalProblems,
              score: codechefScore
            }
          ],
          totalProblems : tp,
          totalScore : ts,
        }));
      }
      catch(e) {
        console.log('Error while fetching stats...', e);
      }

    };

    fetchData();
  },[]);


  if (performanceData.loading || loading) {
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

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Coding Platform Dashboard
          </h1>
          
          <Toggle
            options={[
              { value: 'problems', label: 'Problems Solved' },
              { value: 'scores', label: 'Scores' }
            ]}
            value={viewMode}
            onChange={(value) => setViewMode(value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-10">
          {performanceData.platforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              viewMode={viewMode}
              totalValue={viewMode == 'problems' ? performanceData.totalProblems : performanceData.totalScore}
            />
          ))}
        </div>

        <DistributionChart
          platforms={performanceData.platforms}
          viewMode={viewMode}
          totalValue={viewMode == 'problems' ? performanceData.totalProblems : performanceData.totalScore}
        />
      </div>
    </div>
    </StudentLayout>
  );
};

export default CodingPerformance;