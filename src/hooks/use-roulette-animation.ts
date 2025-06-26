"use client";

import { useState, useCallback, useRef } from "react";
import { Place } from "@/types";

interface UseRouletteAnimationOptions {
  onAnimationComplete?: (result: Place) => void;
  minSpins?: number;
  maxSpins?: number;
  duration?: number;
}

interface RouletteAnimationState {
  rotation: number;
  isAnimating: boolean;
  result: Place | null;
}

export function useRouletteAnimation({
  onAnimationComplete,
  minSpins = 6,
  maxSpins = 12,
  duration = 3000,
}: UseRouletteAnimationOptions = {}) {
  const [state, setState] = useState<RouletteAnimationState>({
    rotation: 0,
    isAnimating: false,
    result: null,
  });

  const animationRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  /**
   * 현재 회전 각도에서 화살표가 가리키는 섹션을 계산합니다.
   * @param places 장소 배열
   * @param currentRotation 현재 회전 각도
   * @returns 화살표가 가리키는 장소
   */
  const getPointedSection = useCallback(
    (places: Place[], currentRotation: number): Place | null => {
      if (places.length === 0) return null;

      const anglePerSection = 360 / places.length;

      // 현재 회전 각도를 0-360 범위로 정규화
      const normalizedRotation = ((currentRotation % 360) + 360) % 360;

      // 화살표는 12시 방향에 고정되어 있고, 룰렛이 회전함
      // 화살표가 가리키는 섹션 인덱스 계산
      const pointedSectionIndex =
        Math.floor((360 - normalizedRotation) / anglePerSection) %
        places.length;

      console.log("👉 화살표가 가리키는 섹션:", {
        currentRotation,
        normalizedRotation,
        anglePerSection,
        pointedSectionIndex,
        pointedPlace: places[pointedSectionIndex]?.name,
        allPlaces: places.map((p) => p.name),
      });

      return places[pointedSectionIndex] || null;
    },
    []
  );

  /**
   * 최종 회전 각도를 계산합니다.
   * 화살표(12시 방향)가 선택된 장소의 섹션 중앙을 정확히 가리키도록 계산합니다.
   * @param places 장소 배열
   * @param targetPlace 선택된 장소
   * @returns 최종 회전 각도
   */
  const calculateFinalRotation = useCallback(
    (places: Place[], targetPlace: Place): number => {
      const targetIndex = places.findIndex(
        (place) => place.id === targetPlace.id
      );
      if (targetIndex === -1) return 0;

      // 각 섹션의 각도 계산
      const anglePerSection = 360 / places.length;

      // 선택된 섹션의 중앙 각도 계산
      // SVG에서 첫 번째 섹션은 12시 방향(0°)에서 시작하므로
      const sectionCenterAngle =
        targetIndex * anglePerSection + anglePerSection / 2;

      // 추가 회전 (최소 3바퀴, 최대 6바퀴)
      const extraSpins = minSpins + Math.random() * (maxSpins - minSpins);
      const extraRotation = extraSpins * 360;

      // 화살표가 선택된 섹션의 중앙을 가리키도록 하는 회전 각도
      // 룰렛을 시계 방향으로 회전시켜서 화살표(고정)가 해당 섹션을 가리키게 함
      // 음수로 계산하는 이유: 섹션이 화살표 위치로 와야 하므로 역방향 회전
      const targetRotation = -sectionCenterAngle;

      // 최종 각도 = 현재 각도 + 추가 회전 + 타겟 회전
      const finalAngle = state.rotation + extraRotation + targetRotation;

      // 디버깅 정보 출력
      console.log("🎯 룰렛 각도 계산:", {
        targetPlace: targetPlace.name,
        targetIndex,
        anglePerSection,
        sectionCenterAngle,
        extraRotation,
        targetRotation,
        currentRotation: state.rotation,
        finalAngle,
        places: places.map((p) => p.name),
      });

      return finalAngle;
    },
    [state.rotation, minSpins, maxSpins]
  );

  /**
   * 룰렛 애니메이션을 시작합니다.
   * @param places 장소 배열
   * @param targetPlace 선택된 장소
   */
  const startAnimation = useCallback(
    (places: Place[], targetPlace: Place) => {
      if (state.isAnimating) return;

      const finalRotation = calculateFinalRotation(places, targetPlace);

      setState((prev) => ({
        ...prev,
        isAnimating: true,
        result: null,
      }));

      // CSS 애니메이션 시작
      const startTime = Date.now();
      const startRotation = state.rotation;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // ease-out 타이밍 함수 (3차 베지어 곡선 근사)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentRotation =
          startRotation + (finalRotation - startRotation) * easeOut;

        setState((prev) => ({
          ...prev,
          rotation: currentRotation,
        }));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // 애니메이션 완료 - 실제로 화살표가 가리키는 섹션을 결과로 설정
          const actualResult = getPointedSection(places, finalRotation);
          const finalResult = actualResult || targetPlace;

          console.log("🎯 최종 결과:", {
            intended: targetPlace.name,
            actual: actualResult?.name,
            final: finalResult.name,
            finalRotation,
          });

          setState((prev) => ({
            ...prev,
            rotation: finalRotation,
            isAnimating: false,
            result: finalResult,
          }));

          // 콜백 실행 (약간의 지연 후)
          timeoutRef.current = setTimeout(() => {
            onAnimationComplete?.(finalResult);
          }, 300);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    },
    [
      state.rotation,
      state.isAnimating,
      calculateFinalRotation,
      duration,
      onAnimationComplete,
    ]
  );

  /**
   * 애니메이션을 중단합니다.
   */
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    setState((prev) => ({
      ...prev,
      isAnimating: false,
    }));
  }, []);

  /**
   * 애니메이션 상태를 리셋합니다.
   */
  const resetAnimation = useCallback(() => {
    stopAnimation();
    setState({
      rotation: 0,
      isAnimating: false,
      result: null,
    });
  }, [stopAnimation]);

  // 컴포넌트 언마운트 시 정리
  const cleanup = useCallback(() => {
    stopAnimation();
  }, [stopAnimation]);

  return {
    rotation: state.rotation,
    isAnimating: state.isAnimating,
    result: state.result,
    startAnimation,
    stopAnimation,
    resetAnimation,
    cleanup,
    getPointedSection,
  };
}
