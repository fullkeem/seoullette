import { Place, RouletteEngine } from "@/types";

export class BasicRouletteEngine implements RouletteEngine {
  private readonly MIN_PLACES = 1;
  private readonly MAX_PLACES = 10;
  private readonly MIN_SPIN_DURATION = 2000; // 2초
  private readonly MAX_SPIN_DURATION = 4000; // 4초

  /**
   * 룰렛을 돌려서 무작위로 장소를 선택합니다.
   * @param places 선택할 장소 배열
   * @returns 선택된 장소
   */
  async spin(places: Place[]): Promise<Place> {
    if (!this.validatePlaces(places)) {
      throw new Error("유효하지 않은 장소 목록입니다.");
    }

    // 스핀 시간 시뮬레이션 (2-4초)
    const spinDuration = this.generateSpinDuration();

    // 결과를 미리 계산
    const result = this.generateRandomResult(places);

    // 스핀 시간만큼 대기
    await this.delay(spinDuration);

    return result;
  }

  /**
   * 장소 배열의 기본 유효성을 검증합니다.
   * @param places 검증할 장소 배열
   * @returns 유효성 여부
   */
  validatePlaces(places: Place[]): boolean {
    // null/undefined 체크
    if (!places || !Array.isArray(places)) {
      return false;
    }

    // 개수 체크 (최소 1개)
    if (places.length < this.MIN_PLACES) {
      return false;
    }

    // 각 장소의 기본 유효성 체크
    for (const place of places) {
      if (!place || !place.name || !place.name.trim()) {
        return false;
      }
    }

    return true;
  }

  /**
   * 무작위로 장소를 선택합니다.
   * @param places 선택할 장소 배열
   * @returns 선택된 장소
   */
  generateRandomResult(places: Place[]): Place {
    if (!this.validatePlaces(places)) {
      throw new Error("유효하지 않은 장소 목록입니다.");
    }

    // Math.random()을 사용한 균등 분포 보장
    const randomIndex = Math.floor(Math.random() * places.length);
    return places[randomIndex];
  }

  /**
   * 스핀 지속 시간을 무작위로 생성합니다.
   * @returns 스핀 지속 시간 (밀리초)
   */
  private generateSpinDuration(): number {
    const duration =
      this.MIN_SPIN_DURATION +
      Math.random() * (this.MAX_SPIN_DURATION - this.MIN_SPIN_DURATION);
    return Math.round(duration);
  }

  /**
   * 지정된 시간만큼 대기합니다.
   * @param ms 대기 시간 (밀리초)
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 룰렛 엔진의 공정성을 테스트합니다.
   * @param places 테스트할 장소 배열
   * @param iterations 테스트 반복 횟수 (기본값: 1000)
   * @returns 각 장소별 선택 횟수와 확률
   */
  async testFairness(
    places: Place[],
    iterations: number = 1000
  ): Promise<{
    results: { place: Place; count: number; percentage: number }[];
    isUniform: boolean;
    chiSquare: number;
  }> {
    if (!this.validatePlaces(places)) {
      throw new Error("유효하지 않은 장소 목록입니다.");
    }

    const counts = new Map<string, number>();

    // 각 장소의 카운트 초기화
    places.forEach((place) => counts.set(place.id, 0));

    // 반복 테스트 실행
    for (let i = 0; i < iterations; i++) {
      const result = this.generateRandomResult(places);
      counts.set(result.id, (counts.get(result.id) || 0) + 1);
    }

    // 결과 계산
    const results = places.map((place) => ({
      place,
      count: counts.get(place.id) || 0,
      percentage: ((counts.get(place.id) || 0) / iterations) * 100,
    }));

    // 카이제곱 검정으로 균등성 확인
    const expected = iterations / places.length;
    const chiSquare = places.reduce((sum, place) => {
      const observed = counts.get(place.id) || 0;
      return sum + Math.pow(observed - expected, 2) / expected;
    }, 0);

    // 자유도 = 장소수 - 1, 유의수준 5%에서의 임계값 대략 계산
    // 정확한 통계적 검정보다는 대략적인 균등성 판단
    const degreesOfFreedom = places.length - 1;
    const isUniform = chiSquare < degreesOfFreedom * 2; // 단순화된 기준

    return {
      results,
      isUniform,
      chiSquare,
    };
  }
}

// 기본 룰렛 엔진 인스턴스 생성
export const rouletteEngine = new BasicRouletteEngine();
