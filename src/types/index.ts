import { ReactNode } from "react";

// 장소 타입 정의
export interface Place {
  id: string;
  name: string;
  createdAt: Date;
}

// 룰렛 상태 타입 정의
export interface RouletteState {
  places: Place[];
  isSpinning: boolean;
  result: Place | null;
  history: Place[];
}

// 룰렛 엔진 인터페이스
export interface RouletteEngine {
  spin(places: Place[]): Promise<Place>;
  validatePlaces(places: Place[]): boolean;
  generateRandomResult(places: Place[]): Place;
}

// 스토리지 서비스 인터페이스
export interface StorageService {
  savePlaces(places: Place[]): void;
  loadPlaces(): Place[];
  clearData(): void;
}

// UI 컴포넌트 공통 타입
export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

// 게임 액션 타입
export type GameAction =
  | { type: "ADD_PLACE"; payload: string }
  | { type: "REMOVE_PLACE"; payload: string }
  | { type: "START_SPIN" }
  | { type: "SET_RESULT"; payload: Place }
  | { type: "RESET_GAME" }
  | { type: "LOAD_PLACES"; payload: Place[] };

// 애니메이션 상태 타입
export interface AnimationState {
  rotation: number;
  duration: number;
  isAnimating: boolean;
}
