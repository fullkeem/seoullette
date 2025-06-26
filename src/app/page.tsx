"use client";

import { useState } from "react";
import { Button, Input, Modal, Loading } from "@/components/ui";
import { LocalStorageService, createPlace } from "@/lib";
import { Place } from "@/types";

const storageService = new LocalStorageService();

export default function HomePage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPlace = () => {
    if (inputValue.trim()) {
      const newPlace = createPlace(inputValue);
      const updatedPlaces = [...places, newPlace];
      setPlaces(updatedPlaces);
      storageService.savePlaces(updatedPlaces);
      setInputValue("");
    }
  };

  const handleLoadPlaces = () => {
    setIsLoading(true);
    setTimeout(() => {
      const loadedPlaces = storageService.loadPlaces();
      setPlaces(loadedPlaces);
      setIsLoading(false);
    }, 1000);
  };

  const handleClearData = () => {
    storageService.clearData();
    setPlaces([]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          🎯 서울룰렛 - 컴포넌트 테스트
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">장소 추가</h2>
          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <Input
                value={inputValue}
                onChange={setInputValue}
                placeholder="장소 이름을 입력하세요"
              />
            </div>
            <Button onClick={handleAddPlace}>추가</Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="secondary" onClick={handleLoadPlaces}>
              저장된 데이터 로드
            </Button>
            <Button variant="danger" onClick={() => setIsModalOpen(true)}>
              데이터 삭제
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <Loading text="데이터를 불러오는 중..." />
          </div>
        )}

        {places.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              저장된 장소 ({places.length}개)
            </h2>
            <ul className="space-y-2">
              {places.map((place) => (
                <li key={place.id} className="p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{place.name}</span>
                    <span className="text-sm text-gray-500">
                      {place.createdAt.toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="데이터 삭제"
        >
          <p className="mb-4">정말로 모든 데이터를 삭제하시겠습니까?</p>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              취소
            </Button>
            <Button variant="danger" onClick={handleClearData}>
              삭제
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
