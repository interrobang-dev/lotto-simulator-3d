export type SimulationStatus = 'IDLE' | 'MIXING' | 'EXTRACTING' | 'COMPLETED';

export type CameraView = 'DEFAULT' | 'TOP' | 'TUBE_ZOOM' | 'FOLLOW_BALL';

export interface LottoBallData {
  id: number;
  number: number;
  color: string;
  isExtracted: boolean;
}

export interface ExtractedBall {
  number: number;
  color: string;
  extractedAt: number;
  isBonus?: boolean;
}

export interface SimulationHistory {
  id: string;
  round: number;
  numbers: number[];
  bonus: number;
  timestamp: number;
}
