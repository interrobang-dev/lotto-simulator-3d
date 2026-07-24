import React from 'react';
import { Play, RotateCcw, Wind, Eye } from 'lucide-react';
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
    startSimulation,
    resetSimulation,
    setAirPower,
    setCameraView,
  } = useLottoStore();

  const views: { id: CameraView; label: string }[] = [
    { id: 'FIXED', label: '정면 고정' },
    { id: 'FREE', label: '자유 이동' },
  ];

  return (
    <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-[96%] sm:w-auto max-w-2xl">
      {/* 슬림 컴팩트 콘솔 패널 메인 하우징 */}
      <div className="bg-slate-950/95 p-2.5 sm:p-3.5 rounded-2xl border border-amber-500/30 shadow-2xl backdrop-blur-xl flex flex-col items-center gap-2.5 lotto-gold-glow">
        
        {/* 1. 상단 메인 주 조작 버튼 그룹 */}
        <div className="w-full flex items-center justify-between gap-2">
          {/* 추첨 시작 골드 버튼 */}
          <button
            onClick={startSimulation}
            disabled={status !== 'IDLE'}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 sm:px-7 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xl active:scale-95 flex-1 ${
              status === 'IDLE'
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{status === 'IDLE' ? '추첨 시작' : '추첨 진행 중...'}</span>
          </button>

          {/* 리셋 초기화 버튼 */}
          <button
            onClick={resetSimulation}
            className="px-3.5 py-2.5 sm:px-5 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs sm:text-sm border border-slate-750 transition-all active:scale-95 flex items-center gap-1.5 shadow-md flex-shrink-0"
            title="초기화"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">초기화</span>
          </button>
        </div>

        {/* 2. 하단 촘촘한 중앙 응집(justify-center gap-2) 슬림 조작 랙 */}
        <div className="w-full flex items-center justify-center gap-2 sm:gap-3 pt-2 border-t border-slate-850 flex-nowrap overflow-x-auto">
          {/* 바람 조작 랙 */}
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px] sm:text-xs font-semibold bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 flex-shrink-0">
            <Wind className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 font-bold w-3.5 text-center">{airPower}</span>
            <input
              type="range"
              min="1"
              max="10"
              value={airPower}
              onChange={(e) => setAirPower(Number(e.target.value))}
              className="w-12 sm:w-16 accent-amber-400 cursor-pointer h-1.5"
            />
          </div>

          {/* 카메라 시점 스위치 */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800 flex-shrink-0">
            <Eye className="w-3.5 h-3.5 text-slate-500 ml-1 mr-0.5 hidden sm:inline" />
            {views.map((v) => (
              <button
                key={v.id}
                onClick={() => setCameraView(v.id)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                  cameraView === v.id
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* 통계 버튼 */}
          <button
            onClick={onOpenStats}
            className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-[11px] sm:text-xs transition-all border border-amber-500/40 shadow-sm flex-shrink-0 whitespace-nowrap"
          >
            통계
          </button>
        </div>
      </div>
    </div>
  );
};
