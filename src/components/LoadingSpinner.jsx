import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;