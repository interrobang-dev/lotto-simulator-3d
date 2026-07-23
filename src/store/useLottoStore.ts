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
  triggerExtractionByBallNumber: (ballNumber: number) => boolean;
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

    // 3.5초 교반 후 추출 상태로 전환
    setTimeout(() => {
      set({ status: 'EXTRACTING' });
    }, 3500);
  },

  // 3D 씬에서 천장 출구(0, 3.2, 0)와 가장 가까운 실제 공 번호를 전달받아 추출
  triggerExtractionByBallNumber: (ballNumber: number) => {
    const { extractedBalls, bonusBall, ballFrequencyMap, status, activeExtractingBall } = get();
    if (status !== 'EXTRACTING' || activeExtractingBall !== null) return false;

    const extractedNumbers = [...extractedBalls.map((b) => b.number), bonusBall?.number].filter(Boolean) as number[];
    if (extractedNumbers.includes(ballNumber)) return false;

    const slotIdx = extractedBalls.length < 6 ? extractedBalls.length : 6;

    // 선택된 실제 천장 최단거리 공을 SLIDE_MODE로 전환
    set((state) => ({
      activeExtractingBall: { number: ballNumber, slotIndex: slotIdx },
      ballModes: {
        ...state.ballModes,
        [ballNumber]: 'SLIDE_MODE',
      },
    }));

    // 2.5초간 슬라이드 레일 이송 후 거치대 안착
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
        // 보너스 공까지 7개 모두 추출 완료
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
