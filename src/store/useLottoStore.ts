import { create } from 'zustand';
import type { SimulationStatus, CameraView, ExtractedBall, SimulationHistory } from '../types/lotto';
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

  setStatus: (status: SimulationStatus) => void;
  setAirPower: (power: number) => void;
  setCameraView: (view: CameraView) => void;
  toggleSound: () => void;
  extractBall: (num: number) => boolean;
  resetSimulation: () => void;
}

export const useLottoStore = create<LottoStore>((set, get) => ({
  status: 'IDLE',
  extractedBalls: [],
  bonusBall: null,
  airPower: 5,
  cameraView: 'DEFAULT',
  isSoundEnabled: true,
  history: [],
  ballFrequencyMap: Array.from({ length: 45 }, (_, i) => i + 1).reduce(
    (acc, curr) => ({ ...acc, [curr]: 0 }),
    {} as Record<number, number>
  ),

  setStatus: (status) => set({ status }),
  setAirPower: (airPower) => set({ airPower }),
  setCameraView: (cameraView) => set({ cameraView }),
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),

  extractBall: (num: number) => {
    const { extractedBalls, bonusBall, status, ballFrequencyMap } = get();

    if (status !== 'MIXING' && status !== 'EXTRACTING') return false;
    const isAlreadyExtracted = extractedBalls.some((b) => b.number === num) || bonusBall?.number === num;
    if (isAlreadyExtracted) return false;

    const newBall: ExtractedBall = {
      number: num,
      color: getLottoColor(num),
      extractedAt: Date.now(),
    };

    const updatedFreq = {
      ...ballFrequencyMap,
      [num]: (ballFrequencyMap[num] || 0) + 1,
    };

    if (extractedBalls.length < 6) {
      const updatedList = [...extractedBalls, newBall];
      set({
        extractedBalls: updatedList,
        status: updatedList.length === 6 ? 'EXTRACTING' : 'MIXING',
        ballFrequencyMap: updatedFreq,
      });
      return true;
    } else if (!bonusBall) {
      newBall.isBonus = true;
      set((state) => {
        const newHistoryItem: SimulationHistory = {
          id: Date.now().toString(),
          round: state.history.length + 1,
          numbers: state.extractedBalls.map((b) => b.number).sort((a, b) => a - b),
          bonus: num,
          timestamp: Date.now(),
        };
        return {
          bonusBall: newBall,
          status: 'COMPLETED',
          history: [newHistoryItem, ...state.history],
          ballFrequencyMap: updatedFreq,
        };
      });
      return true;
    }

    return false;
  },

  resetSimulation: () =>
    set({
      status: 'IDLE',
      extractedBalls: [],
      bonusBall: null,
      cameraView: 'DEFAULT',
    }),
}));
