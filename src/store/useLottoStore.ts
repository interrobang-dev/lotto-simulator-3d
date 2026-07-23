import { create } from 'zustand';
import type { SimulationStatus, CameraView, ExtractedBall, SimulationHistory, BallMode } from '../types/lotto';
import { getLottoColor } from '../utils/colorUtils';

interface LottoStore {
  status: SimulationStatus;
  extractedBalls: ExtractedBall[];
  bonusBall: ExtractedBall | null;
  airPower: number;
  cameraView: CameraView;
  isSoundEnabled: boolean;
  history: SimulationHistory[];
  ballFrequencyMap: Record<number, number>;
  activeExtractingBall: { number: number; slotIndex: number } | null;
  ballModes: Record<number, BallMode>;

  startSimulation: () => void;
  resetSimulation: () => void;
  setStatus: (status: SimulationStatus) => void;
  setAirPower: (power: number) => void;
  setCameraView: (view: CameraView) => void;
  toggleSound: () => void;
  triggerNextExtraction: () => void;
}

export const useLottoStore = create<LottoStore>((set, get) => ({
  status: 'IDLE',
  extractedBalls: [],
  bonusBall: null,
  airPower: 7,
  cameraView: 'FIXED',
  isSoundEnabled: true,
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
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),

  startSimulation: () => {
    const { status } = get();
    if (status !== 'IDLE') return;

    // 바람이 불기 시작하며 믹싱 상태 전환
    set({ status: 'MIXING' });

    setTimeout(() => {
      set({ status: 'EXTRACTING' });
      get().triggerNextExtraction();
    }, 3000);
  },

  triggerNextExtraction: () => {
    const { extractedBalls, bonusBall, ballFrequencyMap, status } = get();
    if (status !== 'EXTRACTING') return;

    const extractedNumbers = [...extractedBalls.map((b) => b.number), bonusBall?.number].filter(Boolean) as number[];
    const availableNumbers = Array.from({ length: 45 }, (_, i) => i + 1).filter((n) => !extractedNumbers.includes(n));

    if (availableNumbers.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const targetNum = availableNumbers[randomIndex];
    const slotIdx = extractedBalls.length < 6 ? extractedBalls.length : 6;

    set((state) => ({
      activeExtractingBall: { number: targetNum, slotIndex: slotIdx },
      ballModes: {
        ...state.ballModes,
        [targetNum]: 'SLIDE_MODE',
      },
    }));

    setTimeout(() => {
      const isBonus = slotIdx === 6;
      const newBall: ExtractedBall = {
        number: targetNum,
        color: getLottoColor(targetNum),
        extractedAt: Date.now(),
        slotIndex: slotIdx,
        isBonus,
      };

      const updatedFreq = {
        ...ballFrequencyMap,
        [targetNum]: (ballFrequencyMap[targetNum] || 0) + 1,
      };

      if (!isBonus) {
        set((state) => ({
          extractedBalls: [...state.extractedBalls, newBall],
          activeExtractingBall: null,
          ballFrequencyMap: updatedFreq,
          ballModes: {
            ...state.ballModes,
            [targetNum]: 'DOCKED_MODE',
          },
        }));

        setTimeout(() => {
          get().triggerNextExtraction();
        }, 1500);
      } else {
        set((state) => {
          const newHistoryItem: SimulationHistory = {
            id: Date.now().toString(),
            round: state.history.length + 1,
            numbers: state.extractedBalls.map((b) => b.number).sort((a, b) => a - b),
            bonus: targetNum,
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
              [targetNum]: 'DOCKED_MODE',
            },
          };
        });
      }
    }, 2500);
  },

  resetSimulation: () =>
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
    }),
}));
