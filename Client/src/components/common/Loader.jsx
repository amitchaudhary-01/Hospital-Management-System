import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
      <p className="text-xs text-slate-400 mt-3 font-medium">Loading...</p>
    </div>
  );
};

export default Loader;