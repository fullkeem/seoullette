"use client";

import { useState, useEffect, useCallback } from "react";
import { Place } from "@/types";
import { PlaceInput } from "@/components/forms/place-input";
import { PlaceList } from "@/components/forms/place-list";
import { RouletteWheel } from "@/components/roulette/roulette-wheel";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { Modal } from "@/components/ui/modal";
import { LocalStorageService } from "@/lib/storage";
import { rouletteEngine } from "@/lib/roulette-engine";
import { useRouletteAnimation } from "@/hooks/use-roulette-animation";

export default function HomePage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Place | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string>("");

  const storage = new LocalStorageService();

  const { rotation, isAnimating, startAnimation, resetAnimation, cleanup } =
    useRouletteAnimation({
      onAnimationComplete: (selectedPlace) => {
        setResult(selectedPlace);
        setShowResult(true);
        setIsSpinning(false);
      },
      duration: 3000,
    });

  // 컴포넌트 마운트 시 저장된 장소 로드
  useEffect(() => {
    try {
      const savedPlaces = storage.loadPlaces();
      setPlaces(savedPlaces);
    } catch (error) {
      console.error("장소 로드 실패:", error);
      setError("저장된 데이터를 불러오는데 실패했습니다.");
    }
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // 장소 변경 시 자동 저장
  useEffect(() => {
    if (places.length > 0) {
      try {
        storage.savePlaces(places);
      } catch (error) {
        console.error("장소 저장 실패:", error);
        setError("데이터 저장에 실패했습니다.");
      }
    }
  }, [places]);

  const handleAddPlace = useCallback((placeName: string) => {
    const newPlace: Place = {
      id: `place-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: placeName,
      createdAt: new Date(),
    };

    setPlaces((prev) => [...prev, newPlace]);
    setError("");
  }, []);

  const handleRemovePlace = useCallback((placeId: string) => {
    setPlaces((prev) => prev.filter((place) => place.id !== placeId));
  }, []);

  const handleClearAll = useCallback(() => {
    setPlaces([]);
    storage.clearData();
    resetAnimation();
    setResult(null);
    setShowResult(false);
  }, [resetAnimation]);

  const handleSpin = useCallback(async () => {
    if (places.length < 2) {
      setError("최소 2개의 장소가 필요합니다.");
      return;
    }

    if (isSpinning || isAnimating) {
      return;
    }

    try {
      setIsSpinning(true);
      setError("");
      setResult(null);
      setShowResult(false);

      // 룰렛 엔진으로 결과 계산
      const selectedPlace = await rouletteEngine.spin(places);

      // 애니메이션 시작
      startAnimation(places, selectedPlace);
    } catch (error) {
      console.error("룰렛 실행 실패:", error);
      setError("룰렛 실행 중 오류가 발생했습니다.");
      setIsSpinning(false);
    }
  }, [places, isSpinning, isAnimating, startAnimation]);

  const canSpin = places.length >= 2 && !isSpinning && !isAnimating;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎯 서울렛</h1>
          <p className="text-lg text-gray-600">
            어디 갈지 고민될 때, 룰렛이 정해드려요!
          </p>
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 장소 관리 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                장소 추가
              </h2>
              <PlaceInput
                onAddPlace={handleAddPlace}
                existingPlaces={places.map((place) => place.name)}
                disabled={isSpinning || places.length >= 10}
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                장소 목록
              </h2>
              <PlaceList
                places={places}
                onRemove={handleRemovePlace}
                onClearAll={handleClearAll}
                disabled={isSpinning}
              />
            </div>
          </div>

          {/* 오른쪽: 룰렛 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                룰렛
              </h2>

              <div className="flex flex-col items-center space-y-6">
                {/* 룰렛 휠 */}
                <div className="relative">
                  <RouletteWheel
                    places={places}
                    rotation={rotation}
                    size={300}
                    className="mx-auto"
                  />

                  {/* 스피닝 상태 표시 */}
                  {isSpinning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white bg-opacity-90 rounded-full p-4">
                        <Loading size="lg" />
                      </div>
                    </div>
                  )}
                </div>

                {/* 룰렛 버튼 */}
                <Button
                  onClick={handleSpin}
                  disabled={!canSpin}
                  variant="primary"
                  size="lg"
                  loading={isSpinning}
                  className="min-w-32"
                >
                  {isSpinning ? "돌리는 중..." : "룰렛 돌리기"}
                </Button>

                {/* 상태 메시지 */}
                {places.length < 2 && (
                  <p className="text-sm text-amber-600 text-center">
                    룰렛을 돌리려면 최소 2개의 장소가 필요합니다.
                  </p>
                )}
              </div>
            </div>

            {/* 최근 결과 */}
            {result && !isSpinning && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  🎉 선택된 장소
                </h3>
                <p className="text-green-700 text-xl font-bold">
                  {result.name}
                </p>
                <p className="text-green-600 text-sm mt-1">
                  {result.createdAt.toLocaleString("ko-KR")}
                </p>
                {/* 디버깅 정보 */}
                <div className="mt-2 text-xs text-green-500">
                  인덱스: {places.findIndex((p) => p.id === result.id)} / 총{" "}
                  {places.length}개
                  <br />
                  회전각도: {rotation.toFixed(1)}°
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="max-w-6xl mx-auto mt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* 결과 모달 */}
        <Modal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          title="룰렛 결과"
        >
          {result && (
            <div className="text-center py-6">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {result.name}
              </h3>
              <p className="text-gray-600 mb-6">선택된 장소입니다!</p>
              <Button
                onClick={() => setShowResult(false)}
                variant="primary"
                size="lg"
              >
                확인
              </Button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
