
import React from 'react';

interface AdSlotProps {
  width?: string;
  height?: string;
  className?: string;
}

const AdSlot: React.FC<AdSlotProps> = ({ width = 'w-full', height = 'h-24', className = '' }) => {
  return (
    <div
      className={`bg-gray-200 border border-dashed border-gray-400 flex items-center justify-center text-gray-500 rounded-lg ${width} ${height} ${className}`}
    >
      <span className="text-sm">Ad Placeholder</span>
    </div>
  );
};

export default AdSlot;
