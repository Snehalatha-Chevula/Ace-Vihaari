import React from 'react';

const Toggle = ({ options, value, onChange }) => {
  return (
    <div className="bg-gray-200 p-1 rounded-lg inline-flex">
      {options.map((option) => (
        <button
          key={option.value}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer duration-300 ${
            value === option.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Toggle