"use client";

import { Button } from "@/components/ui/button";
import { Place } from "@/types";

interface SpinButtonProps {
  places: Place[];
  isSpinning: boolean;
  onSpin: () => void;
  disabled?: boolean;
}

export function SpinButton({
  places,
  isSpinning,
  onSpin,
  disabled = false,
}: SpinButtonProps) {
  // 스핀 가능 여부 확인
  const canSpin = places.length >= 2 && !isSpinning && !disabled;

  // 버튼 상태에 따른 텍스트 결정
  const getButtonText = () => {
    if (isSpinning) return "스핀 중...";
    if (places.length < 2) return "장소를 2개 이상 입력하세요";
    return "룰렛 돌리기! 🎰";
  };

  // 버튼 클릭 핸들러
  const handleClick = () => {
    if (canSpin) {
      onSpin();
    }
  };

  // 키보드 접근성 지원
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={canSpin ? 0 : -1}
        className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
      >
        <Button
          onClick={handleClick}
          disabled={!canSpin}
          loading={isSpinning}
          variant="primary"
          size="lg"
          className="min-w-44 sm:min-w-48 text-base sm:text-lg font-bold min-h-[44px]"
          aria-label={
            isSpinning
              ? "룰렛이 돌아가는 중입니다"
              : canSpin
              ? "룰렛을 돌려서 장소를 선택합니다"
              : "스핀하려면 장소를 2개 이상 입력하세요"
          }
        >
          {getButtonText()}
        </Button>
      </div>

      {places.length > 0 && places.length < 2 && (
        <p className="text-xs sm:text-sm text-amber-600 text-center">
          현재 {places.length}개 장소 등록됨 (최소 2개 필요)
        </p>
      )}

      {places.length >= 2 && (
        <p className="text-xs sm:text-sm text-green-600 text-center">
          {places.length}개 장소 중에서 선택됩니다
        </p>
      )}
    </div>
  );
}
