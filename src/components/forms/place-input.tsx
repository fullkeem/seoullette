"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PlaceInputProps {
  onAddPlace: (placeName: string) => void;
  existingPlaces: string[];
  disabled?: boolean;
}

// 서울 인기 지역 목록
const POPULAR_PLACES = [
  "명동",
  "이태원",
  "성수",
  "연남",
  "홍대",
  "강남",
  "신사",
  "잠실",
  "합정",
  "을지로",
  "압구정",
  "신촌",
];

export function PlaceInput({
  onAddPlace,
  existingPlaces,
  disabled = false,
}: PlaceInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string>("");

  const validateInput = (value: string): string => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "장소명을 입력해주세요.";
    }

    if (trimmedValue.length < 2) {
      return "장소명은 2글자 이상 입력해주세요.";
    }

    if (trimmedValue.length > 20) {
      return "장소명은 20글자 이하로 입력해주세요.";
    }

    if (existingPlaces.includes(trimmedValue)) {
      return "이미 추가된 장소입니다.";
    }

    return "";
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);

    // 실시간 검증
    if (value.trim()) {
      const validationError = validateInput(value);
      setError(validationError);
    } else {
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateInput(inputValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    onAddPlace(inputValue.trim());
    setInputValue("");
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as React.FormEvent);
    }
  };

  const handlePopularPlaceClick = (placeName: string) => {
    if (disabled || existingPlaces.includes(placeName)) {
      return;
    }
    onAddPlace(placeName);
  };

  const isValid = !error && inputValue.trim().length >= 2;

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              placeholder="장소명을 입력하세요 (예: 강남역)"
              disabled={disabled}
              error={error}
              onKeyDown={handleKeyPress}
            />
          </div>
          <Button
            type="submit"
            disabled={disabled || !isValid}
            variant="primary"
            size="md"
            className="w-full sm:w-auto min-w-[80px]"
          >
            추가
          </Button>
        </div>

        {existingPlaces.length >= 10 && (
          <p className="text-xs sm:text-sm text-amber-600">
            최대 10개까지 장소를 추가할 수 있습니다.
          </p>
        )}
      </form>

      {/* 추천 지역 목록 */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          💡 서울 인기 지역 (클릭해서 추가)
        </h3>
        <div className="flex flex-wrap gap-2">
          {POPULAR_PLACES.map((place) => {
            const isAlreadyAdded = existingPlaces.includes(place);
            const isDisabled = disabled || isAlreadyAdded;

            return (
              <button
                key={place}
                onClick={() => handlePopularPlaceClick(place)}
                disabled={isDisabled}
                className={`
                  px-3 py-1.5 text-xs sm:text-sm rounded-full border transition-all duration-200
                  ${
                    isDisabled
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 cursor-pointer"
                  }
                `}
              >
                {place}
                {isAlreadyAdded && (
                  <span className="ml-1 text-gray-400">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
