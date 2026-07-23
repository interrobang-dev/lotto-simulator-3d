export type SimulationStatus =
  | 'READY_RACK'
  | 'DROPPING'
  | 'MIXING'
  | 'EXTRACTING'
  | 'COMPLETED';

export type CameraView = 'DEFAULT' | 'RACK_ZOOM' | 'TUBE_ZOOM' | 'FOLLOW_BALL';

export type BallMode = 'RACK_MODE' | 'PHYSICS_MODE' | 'SLIDE_MODE' | 'DOCKED_MODE';

export interface LottoBallState {
  id: number;
  number: number;
  color: string;
  mode: BallMode;
  slotIndex?: number;
}

export interface ExtractedBall {
  number: number;
  color: string;
  extractedAt: number;
  slotIndex: number;
  isBonus?: boolean;
}

export interface SimulationHistory {
  id: string;
  round: number;
  numbers: number[];
  bonus: number;
  timestamp: number;
}
