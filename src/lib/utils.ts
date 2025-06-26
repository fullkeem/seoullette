import { Place } from "@/types";

// 고유 ID 생성
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 새로운 장소 생성
export function createPlace(name: string): Place {
  return {
    id: generateId(),
    name: name.trim(),
    createdAt: new Date(),
  };
}

// 브라우저 localStorage 지원 확인
export function isLocalStorageAvailable(): boolean {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
