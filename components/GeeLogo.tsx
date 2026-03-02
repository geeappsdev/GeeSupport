import React from 'react';

const GeeLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center font-bold bg-brand-600 text-white rounded-lg shadow-sm`}>
    G
  </div>
);

export default GeeLogo;