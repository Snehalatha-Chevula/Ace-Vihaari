import React from 'react';
import * as LucideIcons from 'lucide-react';

const PlatformCard = ({ platform, viewMode, totalValue }) => {
  const Icon = LucideIcons[platform.icon];
  const value = viewMode === 'problems' ? platform.problemsSolved : platform.score;
  const contribution = ((value / totalValue) * 100).toFixed(1);
  let link = '';
  if(platform.id == 'leetcode') {
    link = `https://leetcode.com/${platform.username}`;
  }
  else if(platform.id == 'codechef') {
    link = `https://codechef.com/users/${platform.username}`;
  }
  else {
    link = `https://auth.geeksforgeeks.org/user/${platform.username}`
  }
  
  return (
    <div 
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
      style={{ borderTop: `6px solid ${platform.color}` }}
    >
    <a href={link} target = '_blank'>
        <div className="flex items-center gap-3 mb-4">
            <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${platform.color}15` }}
            >
            <Icon size={24} style={{ color: platform.color }} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{platform.name}</h2>
        </div>
      </a>
      
      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-3xl font-bold" style={{ color: platform.color }}>
            {value}
          </span>
          <span className="text-sm text-gray-500">
            {viewMode === 'problems' ? 'problems solved' : 'total score'}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-600">Contribution</span>
            <span className="font-medium text-gray-900">{contribution}%</span>
          </div>
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${contribution}%`,
                backgroundColor: platform.color
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformCard