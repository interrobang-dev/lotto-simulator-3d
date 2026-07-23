import { create } from 'zustand';
import type { SimulationStatus, CameraView, ExtractedBall, SimulationHistory, BallMode } from '../types/lotto';
import { getLottoColor } from '../utils/colorUtils';

// 예약된 비동기 타이머들을 추적 관리하여 초기화 시 일괄 파기
type TimeoutType = ReturnType<typeof setTimeout>;
const activeTimeouts: TimeoutType[] = [];

const addTimeout = (fn: () => void, delay: number) => {
  const timeoutId = setTimeout(() => {
    fn();
    const idx = activeTimeouts.indexOf(timeoutId);
    if (idx !== -1) activeTimeouts.splice(idx, 1);
  }, delay);
  activeTimeouts.push(timeoutId);
  return timeoutId;
};

const clearAllTimeouts = () => {
  activeTimeouts.forEach((id) => clearTimeout(id));
  activeTimeouts.length = 0;
};

interface LottoStore {
  status: SimulationStatus;
  extractedBalls: ExtractedBall[];
  bonusBall: ExtractedBall | null;
  airPower: number;
  cameraView: CameraView;
  history: SimulationHistory[];
  ballFrequencyMap: Record<number, number>;
  activeExtractingBall: { number: number; slotIndex: number } | null;
  ballModes: Record<number, BallMode>;

  startSimulation: () => void;
  resetSimulation: () => void;
  setStatus: (status: SimulationStatus) => void;
  setAirPower: (power: number) => void;
  setCameraView: (view: CameraView) => void;
  triggerExtractionByBallNumber: (ballNumber: number) => boolean;
}

export const useLottoStore = create<LottoStore>((set, get) => ({
  status: 'IDLE',
  extractedBalls: [],
  bonusBall: null,
  airPower: 7,
  cameraView: 'FIXED',
  history: [],
  ballFrequencyMap: Array.from({ length: 45 }, (_, i) => i + 1).reduce(
    (acc, curr) => ({ ...acc, [curr]: 0 }),
    {} as Record<number, number>
  ),
  activeExtractingBall: null,
  ballModes: Array.from({ length: 45 }, (_, i) => i + 1).reduce(
    (acc, curr) => ({ ...acc, [curr]: 'PHYSICS_MODE' }),
    {} as Record<number, BallMode>
  ),

  setStatus: (status) => set({ status }),
  setAirPower: (airPower) => set({ airPower }),
  setCameraView: (cameraView) => set({ cameraView }),

  startSimulation: () => {
    const { status } = get();
    if (status !== 'IDLE') return;

    clearAllTimeouts(); // 기존 타이머 클리어
    set({ status: 'MIXING' });

    // 3.5초 교반 후 추출 단계 전환
    addTimeout(() => {
      if (get().status === 'MIXING') {
        set({ status: 'EXTRACTING' });
      }
    }, 3500);
  },

  triggerExtractionByBallNumber: (ballNumber: number) => {
    const { extractedBalls, bonusBall, ballFrequencyMap, status, activeExtractingBall } = get();
    if (status !== 'EXTRACTING' || activeExtractingBall !== null) return false;

    const extractedNumbers = [...extractedBalls.map((b) => b.number), bonusBall?.number].filter(Boolean) as number[];
    if (extractedNumbers.includes(ballNumber)) return false;

    const slotIdx = extractedBalls.length < 6 ? extractedBalls.length : 6;

    set((state) => ({
      activeExtractingBall: { number: ballNumber, slotIndex: slotIdx },
      ballModes: {
        ...state.ballModes,
        [ballNumber]: 'SLIDE_MODE',
      },
    }));

    // 2.5초간 비행 궤적 이송 후 안착
    addTimeout(() => {
      // 타이머 실행 순간 status 검증 (중간 초기화 시 차단)
      if (get().status !== 'EXTRACTING') return;

      const isBonus = slotIdx === 6;
      const newBall: ExtractedBall = {
        number: ballNumber,
        color: getLottoColor(ballNumber),
        extractedAt: Date.now(),
        slotIndex: slotIdx,
        isBonus,
      };

      const updatedFreq = {
        ...ballFrequencyMap,
        [ballNumber]: (ballFrequencyMap[ballNumber] || 0) + 1,
      };

      if (!isBonus) {
        set((state) => ({
          extractedBalls: [...state.extractedBalls, newBall],
          activeExtractingBall: null,
          ballFrequencyMap: updatedFreq,
          ballModes: {
            ...state.ballModes,
            [ballNumber]: 'DOCKED_MODE',
          },
        }));
      } else {
        set((state) => {
          const newHistoryItem: SimulationHistory = {
            id: Date.now().toString(),
            round: state.history.length + 1,
            numbers: state.extractedBalls.map((b) => b.number).sort((a, b) => a - b),
            bonus: ballNumber,
            timestamp: Date.now(),
          };
          return {
            bonusBall: newBall,
            activeExtractingBall: null,
            status: 'COMPLETED',
            history: [newHistoryItem, ...state.history],
            ballFrequencyMap: updatedFreq,
            ballModes: {
              ...state.ballModes,
              [ballNumber]: 'DOCKED_MODE',
            },
          };
        });
      }
    }, 2500);

    return true;
  },

  resetSimulation: () => {
    // 1. 모든 비동기 타이머 즉시 취소 및 파기
    clearAllTimeouts();

    // 2. 스토어 상태 완전 초기화
    set({
      status: 'IDLE',
      extractedBalls: [],
      bonusBall: null,
      activeExtractingBall: null,
      cameraView: 'FIXED',
      ballModes: Array.from({ length: 45 }, (_, i) => i + 1).reduce(
        (acc, curr) => ({ ...acc, [curr]: 'PHYSICS_MODE' }),
        {} as Record<number, BallMode>
      ),
    });
  },
}));
