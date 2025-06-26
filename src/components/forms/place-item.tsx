"use client";

import { Button } from "@/components/ui/button";
import { Place } from "@/types";

interface PlaceItemProps {
  place: Place;
  onRemove: (placeId: string) => void;
  disabled?: boolean;
}

export function PlaceItem({
  place,
  onRemove,
  disabled = false,
}: PlaceItemProps) {
  const handleRemove = () => {
    onRemove(place.id);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-gray-900 truncate">
          {place.name}
        </span>
        <div className="text-xs text-gray-500 mt-1">
          {place.createdAt.toLocaleDateString("ko-KR", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      <Button
        onClick={handleRemove}
        disabled={disabled}
        variant="danger"
        size="sm"
        aria-label={`${place.name} 삭제`}
      >
        삭제
      </Button>
    </div>
  );
}
