
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Telescope, Home, Zap } from 'lucide-react';

interface GalaxyControlsProps {
  view: 'galaxy' | 'solar';
  onBackToGalaxy: () => void;
  onZoomToSolar: () => void;
}

export const GalaxyControls = ({ view, onBackToGalaxy, onZoomToSolar }: GalaxyControlsProps) => {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
      {view === 'solar' && (
        <Button
          onClick={onBackToGalaxy}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Galaxy
        </Button>
      )}
      
      {view === 'galaxy' && (
        <Button
          onClick={onZoomToSolar}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Telescope size={16} />
          Zoom to Solar System
        </Button>
      )}

      <div className="bg-black/70 text-white p-3 rounded-lg max-w-xs">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <Zap size={16} className="text-yellow-400" />
          Controls
        </h3>
        <ul className="text-sm space-y-1">
          <li>• Click and drag to rotate</li>
          <li>• Scroll to zoom in/out</li>
          <li>• Click planets for voice info</li>
          <li>• Click green marker to explore</li>
        </ul>
      </div>
    </div>
  );
};
