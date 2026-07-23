import React from 'react';
import { useLottoStore } from '../../store/useLottoStore';

export const ExtractedBallDeck: React.FC = () => {
  const { extractedBalls, bonusBall, status, activeExtractingBall } = useLottoStore();

  const getStatusBadge = () => {
    switch (status) {
      case 'IDLE':
        return { tag: 'STANDBY', text: '추첨 준비 완료', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'MIXING':
        return { tag: 'MIXING', text: '8방향 회오리 교반 진행 중', color: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
      case 'EXTRACTING':
        if (activeExtractingBall) {
          const isBonus = activeExtractingBall.slotIndex === 6;
          return {
            tag: isBonus ? 'BONUS DRAW' : `DRAW NO.${activeExtractingBall.slotIndex + 1}`,
            text: `${isBonus ? '보너스' : activeExtractingBall.slotIndex + 1 + '번'} 공 추출 이송 중!`,
            color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse',
          };
        }
        return { tag: 'AIR SUCTION', text: '진공 캡 공 흡입 중', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      case 'COMPLETED':
        return { tag: 'OFFICIAL RESULT', text: '제 1회차 당첨 번호 추첨 완료', color: 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold' };
      default:
        return { tag: 'SIMULATOR', text: '', color: 'bg-slate-700 text-slate-300' };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="absolute top-3 sm:top-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2 sm:gap-3 w-[94%] sm:w-auto max-w-2xl">
      {/* 헤더 자막 바 */}
      <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 px-4 py-1.5 rounded-full shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[11px] sm:text-xs font-black tracking-wider text-amber-400 uppercase">LOTTO 6/45</span>
        </div>
        <div className="h-3 w-px bg-slate-800" />
        <span className="text-[11px] sm:text-xs font-bold text-slate-300 tracking-wide">3D Physics Simulator</span>
        <div className="h-3 w-px bg-slate-800" />
        <div className={`px-2.5 py-0.5 rounded-full border text-[10px] sm:text-xs font-bold tracking-tight ${badge.color}`}>
          {badge.text}
        </div>
      </div>

      {/* 하이라이트 당첨 번호 전광판 */}
      <div className="w-full bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-amber-500/30 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-lg lotto-gold-glow flex flex-col items-center gap-2">
        <div className="text-[10px] sm:text-xs font-bold text-amber-400/80 tracking-widest uppercase">WINNING NUMBERS</div>

        <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full overflow-x-auto py-1">
          {/* 메인 당첨 번호 6개 */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {Array.from({ length: 6 }).map((_, idx) => {
              const ball = extractedBalls[idx];
              return (
                <div
                  key={idx}
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-sm sm:text-lg text-slate-950 transition-all duration-500 shadow-xl flex-shrink-0 relative ${
                    ball
                      ? 'scale-100 ring-2 ring-amber-300/80'
                      : 'bg-slate-850 border border-slate-800 text-slate-600 scale-95'
                  }`}
                  style={{
                    backgroundColor: ball ? ball.color : '#1e293b',
                    color: ball ? '#090d16' : '#475569',
                  }}
                >
                  {ball ? ball.number : idx + 1}
                </div>
              );
            })}
          </div>

          <div className="text-amber-400/60 font-black text-base sm:text-2xl px-1 flex-shrink-0">+</div>

          {/* 영문 BONUS 뱃지 */}
          <div
            className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-[9px] sm:text-xs tracking-tighter text-slate-950 transition-all duration-500 shadow-xl flex-shrink-0 relative ${
              bonusBall
                ? 'scale-100 ring-4 ring-amber-400 animate-pulse text-sm sm:text-lg'
                : 'bg-slate-850 border border-slate-800 text-slate-500 scale-95'
            }`}
            style={{
              backgroundColor: bonusBall ? bonusBall.color : '#1e293b',
              color: bonusBall ? '#090d16' : '#64748b',
            }}
          >
            {bonusBall ? bonusBall.number : 'BONUS'}
          </div>
        </div>
      </div>
    </div>
  );
};
