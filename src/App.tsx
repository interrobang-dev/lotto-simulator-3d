import React, { useState } from 'react';
import { CanvasContainer } from './components/3d/CanvasContainer';
import { ExtractedBallDeck } from './components/ui/ExtractedBallDeck';
import { ControlPanel } from './components/ui/ControlPanel';
import { StatisticsModal } from './components/ui/StatisticsModal';

export const App: React.FC = () => {
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 select-none relative font-sans">
      {/* 2D HUD UI Overlay */}
      <ExtractedBallDeck />
      <ControlPanel onOpenStats={() => setIsStatsOpen(true)} />
      <StatisticsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />

      {/* 메인 3D Physics Canvas */}
      <CanvasContainer />
    </div>
  );
};

export default App;
