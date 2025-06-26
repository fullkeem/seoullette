"use client";

import { Button } from "@/components/ui/button";
import { Place } from "@/types";
import { PlaceItem } from "./place-item";

interface PlaceListProps {
  places: Place[];
  onRemove: (placeId: string) => void;
  onClearAll: () => void;
  disabled?: boolean;
}

export function PlaceList({
  places,
  onRemove,
  onClearAll,
  disabled = false,
}: PlaceListProps) {
  const placeCount = places.length;
  const minPlaces = 2;
  const maxPlaces = 10;

  if (placeCount === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">아직 추가된 장소가 없습니다.</p>
        <p className="text-xs mt-1">
          최소 {minPlaces}개의 장소를 추가해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 상태 표시 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            장소 목록 ({placeCount}/{maxPlaces})
          </span>

          {placeCount < minPlaces && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              최소 {minPlaces - placeCount}개 더 필요
            </span>
          )}

          {placeCount >= minPlaces && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              룰렛 시작 가능
            </span>
          )}
        </div>

        {placeCount > 0 && (
          <Button
            onClick={onClearAll}
            disabled={disabled}
            variant="secondary"
            size="sm"
          >
            전체 삭제
          </Button>
        )}
      </div>

      {/* 장소 목록 */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {places.map((place) => (
          <PlaceItem
            key={place.id}
            place={place}
            onRemove={onRemove}
            disabled={disabled}
          />
        ))}
      </div>

      {/* 도움말 텍스트 */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          • 최소 {minPlaces}개, 최대 {maxPlaces}개까지 장소를 추가할 수
          있습니다.
        </p>
        <p>• 중복된 장소명은 추가할 수 없습니다.</p>
        <p>• 장소는 자동으로 저장되며, 다음 방문 시에도 유지됩니다.</p>
      </div>
    </div>
  );
}
