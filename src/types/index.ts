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
