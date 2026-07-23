import React from 'react';
import { useLottoStore } from '../../store/useLottoStore';

export const ExtractedBallDeck: React.FC = () => {
  const { extractedBalls, bonusBall } = useLottoStore();

  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-700/50 shadow-2xl">
      <div className="flex items-center gap-2.5">
        {Array.from({ length: 6 }).map((_, idx) => {
          const ball = extractedBalls[idx];
          return (
            <div
              key={idx}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-slate-900 transition-all duration-500 shadow-lg ${
                ball
                  ? 'scale-100 animate-bounce'
                  : 'bg-slate-800/80 border border-slate-700 text-slate-500 scale-95'
              }`}
              style={{
                backgroundColor: ball ? ball.color : undefined,
                boxShadow: ball ? `0 0 15px ${ball.color}aa` : undefined,
              }}
            >
              {ball ? ball.number : '?'}
            </div>
          );
        })}
      </div>

      {/* 보너스 공 구분자 */}
      <div className="text-slate-400 font-bold text-xl px-1">+</div>

      {/* 보너스 공 슬롯 */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-slate-900 transition-all duration-500 shadow-lg ${
          bonusBall
            ? 'scale-100 animate-pulse border-2 border-yellow-300'
            : 'bg-slate-800/80 border border-slate-700 text-slate-500 scale-95'
        }`}
        style={{
          backgroundColor: bonusBall ? bonusBall.color : undefined,
          boxShadow: bonusBall ? `0 0 15px ${bonusBall.color}aa` : undefined,
        }}
      >
        {bonusBall ? bonusBall.number : '보너스'}
      </div>
    </div>
  );
};
