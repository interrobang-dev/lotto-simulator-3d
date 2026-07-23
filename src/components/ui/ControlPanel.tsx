import React, { useState } from 'react';
import { Play, RotateCcw, Wind, Eye, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
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
    isSoundEnabled,
    startSimulation,
    resetSimulation,
    setAirPower,
    setCameraView,
    toggleSound,
  } = useLottoStore();

  const views: { id: CameraView; label: string }[] = [
    { id: 'FIXED', label: '정면 고정' },
    { id: 'FREE', label: '자유 시점' },
  ];

  return (
    <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-[94%] sm:w-auto max-w-2xl transition-all duration-300">
      <div className="bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-700/60 shadow-2xl flex flex-col items-center gap-3">
        {/* 접기/펼치기 및 헤더 탭 (접힌 상태에서도 추첨 시작 가능) */}
        <div className="w-full flex items-center justify-between gap-2">
          {/* 추첨 시작 버튼 */}
          <button
            onClick={startSimulation}
            disabled={status !== 'IDLE'}
            className={`flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex-1 ${
              status === 'IDLE'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white animate-pulse'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <span>{status === 'IDLE' ? '추첨 시작' : '추첨 진행 중...'}</span>
          </button>

          {/* 초기화 버튼 */}
          <button
            onClick={resetSimulation}
            className="p-2 sm:px-3 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-1"
            title="초기화"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">초기화</span>
          </button>

          {/* 패널 접기/펼치기 토글 버튼 */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sky-400 font-bold text-xs transition-all active:scale-95 border border-sky-500/30"
          >
            <span>{isCollapsed ? '옵션 펼치기' : '접기'}</span>
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* 접히지 않았을 때 펼쳐지는 상세 컨트롤 옵션들 */}
        {!isCollapsed && (
          <div className="w-full flex flex-wrap items-center justify-center sm:justify-between gap-3 pt-2 border-t border-slate-800/80">
            {/* 바람 강도 슬라이더 */}
            <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm font-medium bg-slate-800/50 px-3 py-1.5 rounded-xl">
              <Wind className="w-4 h-4 text-sky-400" />
              <span>바람: {airPower}</span>
              <input
                type="range"
                min="1"
                max="10"
                value={airPower}
                onChange={(e) => setAirPower(Number(e.target.value))}
                className="w-16 sm:w-20 accent-sky-400 cursor-pointer"
              />
            </div>

            {/* 카메라 모드 토글 */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
              <Eye className="w-4 h-4 text-slate-400 ml-1 mr-0.5 hidden sm:inline" />
              {views.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setCameraView(v.id)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    cameraView === v.id
                      ? 'bg-sky-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* 사운드 및 통계 모달 */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                title="음소거 토글"
              >
                {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>

              <button
                onClick={onOpenStats}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs transition-all border border-sky-500/30"
              >
                통계 보기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
