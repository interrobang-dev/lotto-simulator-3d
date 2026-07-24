import React from 'react';
import { useLottoStore } from '../../store/useLottoStore';

export const ExtractedBallDeck: React.FC = () => {
  const { extractedBalls, bonusBall, status, activeExtractingBall } = useLottoStore();

  const getStatusText = () => {
    switch (status) {
      case 'IDLE':
        return '추첨이 준비되었습니다.';
      case 'MIXING':
        return '추첨기 내부에서 공을 강력하게 뒤섞고 있습니다...';
      case 'EXTRACTING':
        if (activeExtractingBall) {
          const isBonus = activeExtractingBall.slotIndex === 6;
          return `${isBonus ? '보너스' : activeExtractingBall.slotIndex + 1 + '번째'} ${activeExtractingBall.number}번 공이 추출되었습니다!`;
        }
        return '다음 당첨 공을 추첨하고 있습니다...';
      case 'COMPLETED':
        return '로또 6/45 당첨 번호 추첨이 모두 완료되었습니다.';
      default:
        return '';
    }
  };

  const statusText = getStatusText();

  return (
    <div className="absolute top-2.5 sm:top-5 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 w-[95%] sm:w-auto max-w-xl">
      {/* 1. 상단 미니 뱃지 */}
      <div className="flex items-center gap-1.5 bg-slate-950/90 border border-amber-500/30 px-3.5 py-0.5 sm:py-1 rounded-full shadow-lg backdrop-blur-md">
        <span className="text-[10px] sm:text-xs font-black tracking-widest text-amber-400 uppercase">
          Lotto Simulator
        </span>
      </div>

      {/* 2. 슬림 컴팩트 당첨 번호 전광판 */}
      <div className="w-full bg-slate-950/95 border border-amber-500/30 rounded-xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-md lotto-gold-glow flex flex-col items-center gap-1.5 sm:gap-2">
        {/* 당첨 공 6+1 배열 (7개 공 모두 완전 동일 크기로 패널 내부에 꽉 차게 동기화) */}
        <div className="flex items-center justify-between gap-0.5 xs:gap-1 sm:gap-2 w-full py-0.5 px-0.5 sm:px-1.5">
          {/* 메인 당첨 번호 6개 */}
          {Array.from({ length: 6 }).map((_, idx) => {
            const ball = extractedBalls[idx];
            return (
              <div key={idx} className="flex-1 flex flex-col items-center justify-center max-w-[44px]">
                <div
                  className={`w-full aspect-square max-w-[44px] max-h-[44px] rounded-full flex items-center justify-center transition-all duration-500 shadow-lg relative ${
                    ball
                      ? 'scale-100 ring-2 ring-amber-300/90 shadow-amber-500/20'
                      : 'bg-slate-900/90 border border-slate-700/60 scale-95'
                  }`}
                  style={{
                    backgroundColor: ball ? ball.color : '#192231',
                  }}
                >
                  {ball ? (
                    <>
                      {/* 3D 구형 광택 입체 반사 층 */}
                      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-black/60" />
                        <div className="absolute top-0.5 left-0.5 w-[35%] h-[20%] rounded-full bg-white/70 blur-[0.5px]" />
                      </div>

                      {/* 공 중앙 흰색 원형 숫자 뱃지 */}
                      <div className="w-[62%] h-[62%] rounded-full bg-white border border-slate-300 shadow-inner flex items-center justify-center z-10">
                        <span className="font-black text-xs sm:text-sm text-slate-900 tracking-tighter">
                          {ball.number}
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="font-bold text-xs sm:text-sm text-slate-500">
                      {idx + 1}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          <div className="text-amber-400/80 font-black text-xs sm:text-xl px-0.2 sm:px-0.5 flex-shrink-0 flex items-center justify-center">+</div>

          {/* 보너스 공 번호 (메인 공과 100% 동일한 flex-1 max-w-[44px] 직경 동기화) */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-[44px]">
            <div
              className={`w-full aspect-square max-w-[44px] max-h-[44px] rounded-full flex items-center justify-center transition-all duration-500 shadow-lg relative ${
                bonusBall
                  ? 'scale-100 ring-2 sm:ring-3 ring-amber-400 shadow-amber-400/50 animate-pulse'
                  : 'bg-slate-900/90 border border-slate-700/60 scale-95'
              }`}
              style={{
                backgroundColor: bonusBall ? bonusBall.color : '#192231',
              }}
            >
              {bonusBall ? (
                <>
                  {/* 3D 구형 광택 입체 반사 층 */}
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-black/60" />
                    <div className="absolute top-0.5 left-0.5 w-[35%] h-[20%] rounded-full bg-white/70 blur-[0.5px]" />
                  </div>

                  {/* 공 중앙 흰색 원형 숫자 뱃지 */}
                  <div className="w-[62%] h-[62%] rounded-full bg-white border border-slate-300 shadow-inner flex items-center justify-center z-10">
                    <span className="font-black text-xs sm:text-sm text-slate-900 tracking-tighter">
                      {bonusBall.number}
                    </span>
                  </div>
                </>
              ) : (
                <span className="font-bold text-[8px] xs:text-[9px] sm:text-xs text-slate-500 tracking-tight">
                  보너스
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. 슬림 서브 캡션 바 */}
        <div className="w-full bg-slate-950/80 border border-slate-800/80 px-2.5 py-1 rounded-lg text-center text-[10px] sm:text-[11px] font-bold text-slate-300 tracking-wide flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
          <span className="truncate">{statusText}</span>
        </div>
      </div>
    </div>
  );
};
