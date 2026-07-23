import React from 'react';
import { Play, RotateCcw, Wind, Eye, Volume2, VolumeX } from 'lucide-react';
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
    startSimulation,
    resetSimulation,
    setAirPower,
    setCameraView,
    toggleSound,
  } = useLottoStore();

  const views: { id: CameraView; label: string }[] = [
    { id: 'FIXED', label: '방송 정면 (고정)' },
    { id: 'FREE', label: '자유 시점' },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-wrap items-center gap-4 bg-slate-900/85 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-700/60 shadow-2xl">
      {/* 추첨 시작 버튼 */}
      <button
        onClick={startSimulation}
        disabled={status !== 'IDLE'}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 ${
          status === 'IDLE'
            ? 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white animate-pulse'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        <Play className="w-5 h-5 fill-current" />
        <span>{status === 'IDLE' ? '추첨 시작' : '추첨 진행 중...'}</span>
      </button>

      {/* 초기화 (Reset) */}
      <button
        onClick={resetSimulation}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all active:scale-95"
        title="초기화"
      >
        <RotateCcw className="w-4 h-4" />
        <span>초기화</span>
      </button>

      <div className="h-6 w-px bg-slate-700/80 mx-1" />

      {/* 바람 강도 슬라이더 */}
      <div className="flex items-center gap-2.5 text-slate-300 text-sm font-medium">
        <Wind className="w-4 h-4 text-sky-400" />
        <span>회오리 강도: {airPower}</span>
        <input
          type="range"
          min="1"
          max="10"
          value={airPower}
          onChange={(e) => setAirPower(Number(e.target.value))}
          className="w-20 accent-sky-400 cursor-pointer"
        />
      </div>

      <div className="h-6 w-px bg-slate-700/80 mx-1" />

      {/* 카메라 모드 토글 */}
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
