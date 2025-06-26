"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PlaceInputProps {
  onAddPlace: (placeName: string) => void;
  existingPlaces: string[];
  disabled?: boolean;
}

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

  const isValid = !error && inputValue.trim().length >= 2;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
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
        >
          추가
        </Button>
      </div>

      {existingPlaces.length >= 10 && (
        <p className="text-sm text-amber-600">
          최대 10개까지 장소를 추가할 수 있습니다.
        </p>
      )}
    </form>
  );
}
