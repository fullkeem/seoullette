"use client";

import { useState } from "react";
import { useRoulette } from "@/hooks/use-roulette";
import { useRouletteAnimation } from "@/hooks/use-roulette-animation";
import { PlaceInput } from "@/components/forms/place-input";
import { PlaceList } from "@/components/forms/place-list";
import { RouletteWheel } from "./roulette-wheel";
import { SpinButton } from "./spin-button";
import { RouletteResult } from "./roulette-result";
import { Place } from "@/types";

export function RouletteGame() {
  const {
    places,
    isSpinning,
    result,
    addPlace,
    removePlace,
    clearPlaces,
    spin,
    restart,
    canSpin,
  } = useRoulette();

  const [showResult, setShowResult] = useState(false);
  const [animationResult, setAnimationResult] = useState<Place | null>(null);

  // 룰렛 애니메이션 훅
  const { rotation, isAnimating, startAnimation } = useRouletteAnimation({
    onAnimationComplete: (selectedPlace) => {
      setAnimationResult(selectedPlace);
      setShowResult(true);
    },
    duration: 3000, // 3초 애니메이션
  });

  // 장소 추가 핸들러
  const handleAddPlace = (placeName: string) => {
    const success = addPlace(placeName);
    if (!success) {
      // TODO: 토스트 메시지나 에러 표시 (향후 개선)
      console.warn("장소 추가 실패:", placeName);
    }
  };

  // 스핀 시작 핸들러
  const handleSpin = async () => {
    if (!canSpin || places.length < 2) return;

    try {
      // 룰렛 엔진으로 결과 계산
      const selectedPlace = await spin();

      if (selectedPlace) {
        // 애니메이션 시작
        startAnimation(places, selectedPlace);
      }
    } catch (error) {
      console.error("스핀 실행 실패:", error);
      // TODO: 에러 메시지 표시 (향후 개선)
    }
  };

  // 재시작 핸들러
  const handleRestart = () => {
    restart();
    setShowResult(false);
    setAnimationResult(null);
  };

  // 결과 모달 닫기 핸들러
  const handleCloseResult = () => {
    setShowResult(false);
  };

  // 장소명 배열 (PlaceInput에서 중복 체크용)
  const placeNames = places.map((place) => place.name);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 헤더 */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          🎰 서울렛 (Seoul-lette)
        </h1>
        <p className="text-gray-600">
          서울 어디로 갈까? 룰렛으로 결정해보세요!
        </p>
      </div>

      {/* 메인 게임 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* 왼쪽: 장소 입력 및 목록 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📍 장소 추가
            </h2>
            <PlaceInput
              onAddPlace={handleAddPlace}
              existingPlaces={placeNames}
              disabled={isSpinning || isAnimating}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📋 장소 목록
            </h2>
            <PlaceList
              places={places}
              onRemove={removePlace}
              onClearAll={clearPlaces}
              disabled={isSpinning || isAnimating}
            />
          </div>
        </div>

        {/* 오른쪽: 룰렛 휠 및 스핀 버튼 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              🎯 룰렛 휠
            </h2>

            <div className="flex flex-col items-center space-y-6">
              {/* 룰렛 휠 */}
              <RouletteWheel
                places={places}
                rotation={rotation}
                size={280}
                className="mx-auto"
              />

              {/* 스핀 버튼 */}
              <SpinButton
                places={places}
                isSpinning={isSpinning || isAnimating}
                onSpin={handleSpin}
                disabled={!canSpin}
              />

              {/* 상태 표시 */}
              {(isSpinning || isAnimating) && (
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    {isSpinning ? "결과 계산 중..." : "룰렛 돌아가는 중..."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 결과 모달 */}
      <RouletteResult
        isOpen={showResult}
        result={animationResult || result}
        onRestart={handleRestart}
        onClose={handleCloseResult}
      />
    </div>
  );
}
