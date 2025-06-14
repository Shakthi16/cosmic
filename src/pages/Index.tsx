
import React from 'react';
import { GalaxyExplorer } from '@/components/GalaxyExplorer';

const Index = () => {
  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
          Cosmic Voyage Explorer
        </h1>
        <p className="text-gray-300 text-sm">
          Journey from the Milky Way to our Solar System
        </p>
      </div>
      
      <GalaxyExplorer />
    </div>
  );
};

export default Index;
