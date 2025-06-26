import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            🎯 서울렛
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            서울의 맛집을 랜덤으로 선택해주는 룰렛 게임
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <p className="text-gray-500">
              룰렛 게임 컴포넌트가 여기에 추가될 예정입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
