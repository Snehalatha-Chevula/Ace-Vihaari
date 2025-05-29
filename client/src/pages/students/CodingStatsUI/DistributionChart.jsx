import React from 'react';
import Chart from 'react-apexcharts';

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

const DistributionChart = ({ platforms, viewMode, totalValue }) => {
  let values = platforms.map((platform) => {
                return Number((viewMode == 'problems') ? platform.problemsSolved : platform.score);
            })

  console.log(values);
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          {viewMode == 'problems' ? 'Problem Distribution' : 'Score Distribution'}
        </h2>
        <div className="text-2xl font-bold text-gray-900">
          {totalValue}
        </div>
      </div>
      <Chart
            options={{
                ...difficultyChartOptions,
                labels: ['LeetCode', 'GeeksForGeeks', 'CodeChef'],
                colors: [platforms[0].color, platforms[1].color, platforms[2].color]
            }}
            series={values}
            type="donut"
            height={270}
        /> 

    </div>
  );
};

export default DistributionChart