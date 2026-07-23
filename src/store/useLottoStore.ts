import { create } from 'zustand';
import type { SimulationStatus, CameraView, ExtractedBall, SimulationHistory, BallMode } from '../types/lotto';
import { getLottoColor } from '../utils/colorUtils';

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

    set({ status: 'MIXING' });

    setTimeout(() => {
      set({ status: 'EXTRACTING' });
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

    setTimeout(() => {
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
