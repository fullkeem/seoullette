"use client";

import { useState, useEffect, useCallback } from "react";
import { Place, RouletteState } from "@/types";
import { rouletteEngine } from "@/lib/roulette-engine";
import { LocalStorageService } from "@/lib/storage";

// 스토리지 서비스 인스턴스
const storageService = new LocalStorageService();

// 초기 상태
const initialState: RouletteState = {
  places: [],
  isSpinning: false,
  result: null,
};

export function useRoulette() {
  const [state, setState] = useState<RouletteState>(initialState);

  // 컴포넌트 마운트 시 저장된 데이터 로드
  useEffect(() => {
    const savedPlaces = storageService.loadPlaces();
    if (savedPlaces.length > 0) {
      setState((prev) => ({
        ...prev,
        places: savedPlaces,
      }));
    }
  }, []);

  // places가 변경될 때마다 자동 저장
  useEffect(() => {
    if (state.places.length > 0) {
      storageService.savePlaces(state.places);
    }
  }, [state.places]);

  // 장소 추가
  const addPlace = useCallback(
    (placeName: string) => {
      const trimmedName = placeName.trim();
      if (!trimmedName) return false;

      // 기본 중복 체크
      const isDuplicate = state.places.some(
        (place) => place.name === trimmedName
      );

      if (isDuplicate) return false;

      // 최대 개수 체크 (10개 제한)
      if (state.places.length >= 10) return false;

      const newPlace: Place = {
        id: `place-${Date.now()}-${Math.random()}`,
        name: trimmedName,
        createdAt: new Date(),
      };

      setState((prev) => ({
        ...prev,
        places: [...prev.places, newPlace],
      }));

      return true;
    },
    [state.places]
  );

  // 장소 삭제
  const removePlace = useCallback((placeId: string) => {
    setState((prev) => ({
      ...prev,
      places: prev.places.filter((place) => place.id !== placeId),
    }));
  }, []);

  // 모든 장소 삭제
  const clearPlaces = useCallback(() => {
    setState((prev) => ({
      ...prev,
      places: [],
    }));
    storageService.clearData();
  }, []);

  // 룰렛 스핀 실행
  const spin = useCallback(async () => {
    // 유효성 검사
    if (state.isSpinning) return null;
    if (!rouletteEngine.validatePlaces(state.places)) return null;

    try {
      // 스핀 시작
      setState((prev) => ({
        ...prev,
        isSpinning: true,
        result: null,
      }));

      // 룰렛 엔진으로 결과 계산
      const result = await rouletteEngine.spin(state.places);

      // 결과 설정
      setState((prev) => ({
        ...prev,
        isSpinning: false,
        result,
      }));

      return result;
    } catch (error) {
      console.error("룰렛 스핀 실패:", error);

      // 에러 발생 시 상태 복구
      setState((prev) => ({
        ...prev,
        isSpinning: false,
      }));

      return null;
    }
  }, [state.isSpinning, state.places]);

  // 게임 재시작 (결과만 초기화)
  const restart = useCallback(() => {
    setState((prev) => ({
      ...prev,
      result: null,
      isSpinning: false,
    }));
  }, []);

  // 전체 게임 리셋 (모든 데이터 초기화)
  const reset = useCallback(() => {
    setState(initialState);
    storageService.clearData();
  }, []);

  // 장소 유효성 검사
  const canSpin = useCallback(() => {
    return rouletteEngine.validatePlaces(state.places) && !state.isSpinning;
  }, [state.places, state.isSpinning]);

  return {
    // 상태
    places: state.places,
    isSpinning: state.isSpinning,
    result: state.result,

    // 액션
    addPlace,
    removePlace,
    clearPlaces,
    spin,
    restart,
    reset,

    // 유틸리티
    canSpin: canSpin(),
  };
}
