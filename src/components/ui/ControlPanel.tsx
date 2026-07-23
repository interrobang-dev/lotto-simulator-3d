import React from 'react';
import { Play, RotateCcw, Wind, Eye, Pause, Volume2, VolumeX } from 'lucide-react';
import { useLottoStore } from '../../store/useLottoStore';
import type { CameraView } from '../../types/lotto';

interface ControlPanelProps {
  onOpenStats: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onOpenStats }) => {
  const {
    status,
    airPower,
    cameraView,
    isSoundEnabled,
    setStatus,
    setAirPower,
    setCameraView,
    toggleSound,
    resetSimulation,
  } = useLottoStore();

  const handleStartToggle = () => {
    if (status === 'IDLE') setStatus('MIXING');
    else if (status === 'MIXING') setStatus('IDLE');
    else if (status === 'COMPLETED') {
      resetSimulation();
      setStatus('MIXING');
    }
  };

  const views: { id: CameraView; label: string }[] = [
    { id: 'DEFAULT', label: '정면' },
    { id: 'TOP', label: '상단' },
    { id: 'TUBE_ZOOM', label: '추출구' },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-wrap items-center gap-4 bg-slate-900/85 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-700/60 shadow-2xl">
      <button
        onClick={handleStartToggle}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md active:scale-95"
      >
        {status === 'MIXING' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        {status === 'MIXING' ? '일시정지' : status === 'COMPLETED' ? '재추첨' : '추첨 시작'}
      </button>

      <button
        onClick={resetSimulation}
        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95"
        title="초기화"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      <div className="h-6 w-px bg-slate-700/80 mx-1" />

      <div className="flex items-center gap-2.5 text-slate-300 text-sm font-medium">
        <Wind className="w-4 h-4 text-sky-400" />
        <span>바람: {airPower}</span>
        <input
          type="range"
          min="1"
          max="10"
          value={airPower}
          onChange={(e) => setAirPower(Number(e.target.value))}
          className="w-24 accent-sky-400 cursor-pointer"
        />
      </div>

      <div className="h-6 w-px bg-slate-700/80 mx-1" />

      <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl">
        <Eye className="w-4 h-4 text-slate-400 ml-1.5 mr-0.5" />
        {views.map((v) => (
          <button
            key={v.id}
            onClick={() => setCameraView(v.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              cameraView === v.id
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-slate-700/80 mx-1" />

      <button
        onClick={toggleSound}
        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
      >
        {isSoundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
      </button>

      <button
        onClick={onOpenStats}
        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-sm transition-all border border-sky-500/30"
      >
        통계 보기
      </button>
    </div>
  );
};
