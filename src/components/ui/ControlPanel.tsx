import React, { useState } from 'react';
import { Play, RotateCcw, Wind, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useLottoStore } from '../../store/useLottoStore';
import type { CameraView } from '../../types/lotto';

interface ControlPanelProps {
  onOpenStats: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onOpenStats }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    { id: 'FREE', label: '자유 3D' },
  ];

  return (
    <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-[94%] sm:w-auto max-w-2xl transition-all duration-300">
      {/* 콘솔 패널 하우징 */}
      <div className="bg-slate-950/95 p-3 sm:p-4 rounded-2xl border border-amber-500/30 shadow-2xl backdrop-blur-xl flex flex-col items-center gap-3 lotto-gold-glow">
        
        {/* 콘솔 상단 헤더 & 주 조작 버튼 그룹 */}
        <div className="w-full flex items-center justify-between gap-2.5">
          {/* 추첨 시작 골드 버튼 */}
          <button
            onClick={startSimulation}
            disabled={status !== 'IDLE'}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xl active:scale-95 flex-1 ${
              status === 'IDLE'
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <span>{status === 'IDLE' ? '추첨 시작' : '추첨 진행 중...'}</span>
          </button>

          {/* 리셋 초기화 버튼 */}
          <button
            onClick={resetSimulation}
            className="px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs sm:text-sm border border-slate-750 transition-all active:scale-95 flex items-center gap-1.5 shadow-md"
            title="초기화"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">초기화</span>
          </button>

          {/* 접기/펼치기 탭 */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 px-3 py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition-all active:scale-95 border border-amber-500/30 shadow-md"
          >
            <span>{isCollapsed ? '옵션' : '접기'}</span>
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* 펼쳐지는 조작 랙 (바람 조절, 카메라, 통계) */}
        {!isCollapsed && (
          <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-850">
            {/* 바람 조작 랙 */}
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <Wind className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">회오리:</span>
              <span className="text-amber-400 font-bold w-4">{airPower}</span>
              <input
                type="range"
                min="1"
                max="10"
                value={airPower}
                onChange={(e) => setAirPower(Number(e.target.value))}
                className="w-16 sm:w-24 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* 카메라 시점 스위치 */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <Eye className="w-4 h-4 text-slate-500 ml-1.5 mr-0.5 hidden sm:inline" />
              {views.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setCameraView(v.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    cameraView === v.id
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* 통계 보고서 버튼 */}
            <button
              onClick={onOpenStats}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition-all border border-amber-500/40 shadow-sm"
            >
              통계 보고서
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
