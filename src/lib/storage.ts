import { Place, StorageService } from "@/types";

const STORAGE_KEY = "seoullette-places";

export class LocalStorageService implements StorageService {
  savePlaces(places: Place[]): void {
    try {
      const data = JSON.stringify(places);
      localStorage.setItem(STORAGE_KEY, data);
    } catch (error) {
      console.error("장소 저장 실패:", error);
      throw new Error("데이터 저장에 실패했습니다.");
    }
  }

  loadPlaces(): Place[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const places = JSON.parse(data);
      return this.validatePlaces(places);
    } catch (error) {
      console.error("장소 로드 실패:", error);
      return [];
    }
  }

  clearData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("데이터 삭제 실패:", error);
    }
  }

  private validatePlaces(data: unknown): Place[] {
    if (!Array.isArray(data)) return [];

    return data
      .filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          item.createdAt
      )
      .map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
      }));
  }
}
