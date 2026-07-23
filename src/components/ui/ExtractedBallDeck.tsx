import React from 'react';
import { useLottoStore } from '../../store/useLottoStore';

export const ExtractedBallDeck: React.FC = () => {
  const { extractedBalls, bonusBall, status, activeExtractingBall } = useLottoStore();

  const getStatusText = () => {
    switch (status) {
      case 'IDLE':
        return '추첨을 시작하려면 하단의 [추첨 시작] 버튼을 눌러주세요.';
      case 'MIXING':
        return '추첨기 내부에서 공을 강력하게 뒤섞고 있습니다...';
      case 'EXTRACTING':
        if (activeExtractingBall) {
          const isBonus = activeExtractingBall.slotIndex === 6;
          return `${isBonus ? '보너스' : activeExtractingBall.slotIndex + 1 + '번째'} ${activeExtractingBall.number}번 공이 추출되었습니다!`;
        }
        return '다음 당첨 공을 추첨하고 있습니다...';
      case 'COMPLETED':
        return '이번 회차 로또 6/45 당첨 번호 추첨이 모두 완료되었습니다.';
      default:
        return '';
    }
  };

  const statusText = getStatusText();

  return (
    <div className="absolute top-3 sm:top-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2 sm:gap-3 w-[94%] sm:w-auto max-w-2xl">
      {/* 1. 상단 심플 '3D Lotto Simulator' 전용 타이틀 바 */}
      <div className="flex items-center gap-2 bg-slate-950/90 border border-amber-500/30 px-5 py-1.5 rounded-full shadow-2xl backdrop-blur-md">
        <span className="text-xs sm:text-sm font-black tracking-widest text-amber-400 uppercase">
          Lotto Simulator
        </span>
      </div>

      {/* 2. 하이라이트 당첨 번호 전광판 & 하단 진행 상태 서브 바 */}
      <div className="w-full bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-amber-500/30 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-lg lotto-gold-glow flex flex-col items-center gap-2.5">
        <div className="text-[10px] sm:text-xs font-bold text-amber-400/80 tracking-widest uppercase">
          WINNING NUMBERS
        </div>

        {/* 당첨 공 6+1 배열 */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full overflow-x-auto py-1">
          {/* 메인 당첨 번호 6개 */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {Array.from({ length: 6 }).map((_, idx) => {
              const ball = extractedBalls[idx];
              return (
                <div key={idx} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-sm sm:text-lg text-slate-950 transition-all duration-500 shadow-xl relative ${
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
                </div>
              );
            })}
          </div>

          <div className="text-amber-400/60 font-black text-base sm:text-2xl px-1 flex-shrink-0 mb-4">+</div>

          {/* 영문 BONUS 뱃지 */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div
              className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-[9px] sm:text-xs tracking-tighter text-slate-950 transition-all duration-500 shadow-xl relative ${
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

        {/* 3. 각 공 하단의 현재 진행 상태 자연스러운 서브 캡션 바 */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-xl text-center text-[11px] sm:text-xs font-bold text-slate-300 tracking-wide flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
          <span className="truncate">{statusText}</span>
        </div>
      </div>
    </div>
  );
};
