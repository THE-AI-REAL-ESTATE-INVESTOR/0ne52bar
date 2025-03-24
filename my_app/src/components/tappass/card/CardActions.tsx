'use client';

import React from 'react';

interface CardActionsProps {
  onDownload: () => void;
  onEmail: () => void;
  isGenerating?: boolean;
}

const CardActions: React.FC<CardActionsProps> = ({ onDownload, onEmail, isGenerating = false }) => {
  return (
    <div className="flex justify-end space-x-2 mt-4">
      <button
        onClick={onDownload}
        disabled={isGenerating}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating...' : 'Download Card'}
      </button>
      <button
        onClick={onEmail}
        disabled={isGenerating}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating...' : 'Email Card'}
      </button>
    </div>
  );
};

export default CardActions; 