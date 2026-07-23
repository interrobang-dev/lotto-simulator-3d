import React from 'react';
import { useLottoStore } from '../../store/useLottoStore';

export const ExtractedBallDeck: React.FC = () => {
  const { extractedBalls, bonusBall, status, activeExtractingBall } = useLottoStore();

  const getStatusText = () => {
    switch (status) {
      case 'IDLE':
        return '3D 로또 6/45 추첨 시뮬레이터 - 추첨 준비 완료';
      case 'MIXING':
        return '8방향 에어 제트 회오리 교반 작동 중...';
      case 'EXTRACTING':
        if (activeExtractingBall) {
          return `${activeExtractingBall.slotIndex === 6 ? '보너스' : activeExtractingBall.slotIndex + 1 + '번'} 공 추출 및 슬라이드 이송 중!`;
        }
        return '공기 진공 흡입 파이프 작동 중...';
      case 'COMPLETED':
        return '제 1회차 로또 6/45 추첨 완료!';
      default:
        return '';
    }
  };

  return (
    <div className="absolute top-3 sm:top-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2 sm:gap-3 w-[92%] sm:w-auto max-w-xl">
      {/* 방송 자막 바 (모바일 글자 크기 및 여백 조정) */}
      <div className="bg-gradient-to-r from-sky-900/90 via-indigo-900/90 to-sky-900/90 backdrop-blur-md px-3.5 py-1.5 sm:px-6 sm:py-2 rounded-full border border-sky-400/40 shadow-xl text-sky-200 font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 max-w-full truncate">
        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
        <span className="truncate">{getStatusText()}</span>
      </div>

      {/* 2D HUD 당첨 덱 (모바일 반응형 패딩 & 공 사이즈 반응형) */}
      <div className="flex items-center gap-1.5 sm:gap-3 bg-slate-900/80 backdrop-blur-md px-3 py-2 sm:px-6 sm:py-3 rounded-2xl border border-slate-700/50 shadow-2xl max-w-full overflow-x-auto">
        <div className="flex items-center gap-1 sm:gap-2.5">
          {Array.from({ length: 6 }).map((_, idx) => {
            const ball = extractedBalls[idx];
            return (
              <div
                key={idx}
                className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-base text-slate-950 transition-all duration-500 shadow-lg flex-shrink-0 ${
                  ball
                    ? 'scale-100 animate-bounce'
                    : 'bg-slate-800/80 border border-slate-700 text-slate-500 scale-95'
                }`}
                style={{
                  backgroundColor: ball ? ball.color : undefined,
                  boxShadow: ball ? `0 0 12px ${ball.color}aa` : undefined,
                }}
              >
                {ball ? ball.number : idx + 1}
              </div>
            );
          })}
        </div>

        <div className="text-slate-400 font-bold text-sm sm:text-xl px-0.5 sm:px-1 flex-shrink-0">+</div>

        <div
          className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-base text-slate-950 transition-all duration-500 shadow-lg flex-shrink-0 ${
            bonusBall
              ? 'scale-100 animate-pulse border-2 border-yellow-300'
              : 'bg-slate-800/80 border border-slate-700 text-slate-500 scale-95'
          }`}
          style={{
            backgroundColor: bonusBall ? bonusBall.color : undefined,
            boxShadow: bonusBall ? `0 0 12px ${bonusBall.color}aa` : undefined,
          }}
        >
          {bonusBall ? bonusBall.number : '+'}
        </div>
      </div>
    </div>
  );
};
