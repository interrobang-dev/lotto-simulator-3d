import React, { useState } from 'react';
import { Play, RotateCcw, Wind, Eye, ChevronDown } from 'lucide-react';
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
      
      {/* ===== 패널 상단 중앙 돌출형 아치 탭 버튼 ===== */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30 bg-slate-950/95 border-t border-x border-amber-500/40 text-amber-400 hover:text-amber-300 px-5 py-0.5 rounded-t-xl text-xs font-bold flex items-center justify-center shadow-lg backdrop-blur-md transition-all active:scale-95 border-b-0 lotto-gold-glow group cursor-pointer"
        title={isCollapsed ? '조작 콘솔 펼치기' : '조작 콘솔 접기'}
      >
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out ${
            isCollapsed ? 'transform rotate-180 text-amber-400' : 'text-amber-400/80 group-hover:text-amber-300'
          }`}
        />
      </button>

      {/* 콘솔 패널 메인 하우징 (접힘 시 공간 0px 밀착) */}
      <div
        className={`rounded-2xl backdrop-blur-xl flex flex-col items-center lotto-gold-glow relative transition-all duration-300 ${
          isCollapsed
            ? 'p-2 bg-slate-950/90 border border-amber-500/20 shadow-lg gap-0'
            : 'p-3 sm:p-4 bg-slate-950/95 border border-amber-500/30 shadow-2xl gap-3'
        }`}
      >
        {/* 콘솔 메인 주 조작 버튼 그룹 */}
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
            className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs sm:text-sm border border-slate-750 transition-all active:scale-95 flex items-center gap-1.5 shadow-md"
            title="초기화"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">초기화</span>
          </button>
        </div>

        {/* 부드러운 아코디언 슬라이드 애니메이션 랙 (접힘 시 공간 0px 완전 제거) */}
        <div
          className={`w-full overflow-hidden transition-all duration-300 ease-in-out transform origin-top ${
            isCollapsed
              ? 'max-h-0 opacity-0 scale-y-95 pt-0 mt-0 border-t-0 border-transparent'
              : 'max-h-48 opacity-100 scale-y-100 pt-3 mt-0 border-t border-slate-850'
          }`}
        >
          <div className="w-full flex flex-wrap items-center justify-between gap-3">
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
        </div>
      </div>
    </div>
  );
};
