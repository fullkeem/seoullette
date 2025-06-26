"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Place } from "@/types";

interface RouletteResultProps {
  isOpen: boolean;
  result: Place | null;
  onRestart: () => void;
  onClose: () => void;
}

export function RouletteResult({
  isOpen,
  result,
  onRestart,
  onClose,
}: RouletteResultProps) {
  if (!result) return null;

  // 축하 메시지 배열
  const congratsMessages = [
    "🎉 축하합니다!",
    "🎊 당첨되었습니다!",
    "✨ 선택되었습니다!",
    "🎯 결정되었습니다!",
    "🌟 운명의 선택!",
  ];

  // 무작위 축하 메시지 선택
  const congratsMessage =
    congratsMessages[Math.floor(Math.random() * congratsMessages.length)];

  // 재시작 핸들러
  const handleRestart = () => {
    onRestart();
    onClose();
  };

  // 결과 생성 시간 포맷팅
  const formatTime = (date: Date) => {
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="룰렛 결과">
      <div className="text-center space-y-4 sm:space-y-6">
        {/* 축하 메시지 */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-indigo-600">
            {congratsMessage}
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            서울렛이 선택한 장소는...
          </p>
        </div>

        {/* 선택된 장소 강조 표시 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 sm:p-6 border-2 border-indigo-200">
          <div className="text-2xl sm:text-4xl font-bold text-indigo-700 mb-2">
            📍 {result.name}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            등록일: {formatTime(result.createdAt)}
          </div>
        </div>

        {/* 추가 메시지 */}
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            즐거운 시간 보내세요! 🎈
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            다른 장소를 선택하고 싶다면 다시 돌려보세요.
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleRestart}
            variant="primary"
            size="lg"
            className="flex-1 min-h-[48px]"
          >
            🎰 다시 돌리기
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            size="lg"
            className="flex-1 min-h-[48px]"
          >
            ✅ 확인
          </Button>
        </div>

        {/* 소셜 공유 힌트 (향후 확장 가능) */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            💡 팁: 친구들과 함께 룰렛을 돌려보세요!
          </p>
        </div>
      </div>
    </Modal>
  );
}
