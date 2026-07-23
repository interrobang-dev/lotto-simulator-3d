import React from 'react';
import { X, BarChart3, History } from 'lucide-react';
import { useLottoStore } from '../../store/useLottoStore';
import { getLottoColor } from '../../utils/colorUtils';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({ isOpen, onClose }) => {
  const { ballFrequencyMap, history } = useLottoStore();

  if (!isOpen) return null;

  const maxFreq = Math.max(...Object.values(ballFrequencyMap), 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-[95%] sm:w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2 font-bold text-sm sm:text-lg text-sky-400">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>로또 추첨 번호 통계 & 이력</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 스크롤 영역 */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 sm:space-y-8">
          {/* 번호별 출현 빈도 차트 */}
          <div>
            <h3 className="font-semibold text-xs sm:text-sm text-slate-400 mb-3">1 ~ 45번 번호별 출현 빈도</h3>
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 sm:gap-2">
              {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
                const count = ballFrequencyMap[num] || 0;
                const percent = Math.round((count / maxFreq) * 100);
                const colorHex = getLottoColor(num);

                return (
                  <div key={num} className="bg-slate-800/60 p-1.5 sm:p-2 rounded-xl flex flex-col items-center border border-slate-700/50">
                    <div
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs text-slate-950 mb-1"
                      style={{ backgroundColor: colorHex }}
                    >
                      {num}
                    </div>
                    <div className="w-full bg-slate-700 h-1 sm:h-1.5 rounded-full overflow-hidden my-0.5 sm:my-1">
                      <div
                        className="h-full bg-sky-400 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">{count}회</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 추첨 이력 */}
          <div>
            <h3 className="font-semibold text-xs sm:text-sm text-slate-400 mb-3 flex items-center gap-1.5">
              <History className="w-4 h-4 text-sky-400" />
              <span>최근 추첨 회차 기록 ({history.length}회)</span>
            </h3>

            {history.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-500 py-4 text-center">아직 진행된 추첨 이력이 없습니다.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-800/40 p-2.5 sm:p-3 rounded-xl border border-slate-700/40 text-xs">
                    <span className="font-bold text-slate-300">#{item.round}회차</span>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {item.numbers.map((n) => (
                        <span
                          key={n}
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs text-slate-950"
                          style={{ backgroundColor: getLottoColor(n) }}
                        >
                          {n}
                        </span>
                      ))}
                      <span className="text-slate-500 font-bold px-0.5">+</span>
                      <span
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs text-slate-950 border border-yellow-300"
                        style={{ backgroundColor: getLottoColor(item.bonus) }}
                      >
                        {item.bonus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
