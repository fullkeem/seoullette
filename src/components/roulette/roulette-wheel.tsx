"use client";

import { Place } from "@/types";
import { useMemo } from "react";

interface RouletteWheelProps {
  places: Place[];
  rotation?: number;
  size?: number;
  className?: string;
  responsive?: boolean;
}

export function RouletteWheel({
  places,
  rotation = 0,
  size = 300,
  className = "",
  responsive = true,
}: RouletteWheelProps) {
  // 색상 팔레트 (접근성 고려) - useMemo로 이동

  const wheelData = useMemo(() => {
    // 색상 팔레트 (접근성 고려)
    const colors = [
      "#3B82F6", // blue-500
      "#EF4444", // red-500
      "#10B981", // emerald-500
      "#F59E0B", // amber-500
      "#8B5CF6", // violet-500
      "#06B6D4", // cyan-500
      "#F97316", // orange-500
      "#84CC16", // lime-500
      "#EC4899", // pink-500
      "#6B7280", // gray-500
    ];

    if (places.length === 0)
      return {
        sections: [],
        centerX: size / 2,
        centerY: size / 2,
        radius: size * 0.4,
      };

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    const anglePerSection = 360 / places.length;

    const sections = places.map((place, index) => {
      // 12시 방향(위쪽)부터 시작하도록 -90도 오프셋 적용
      const startAngle = index * anglePerSection - 90;
      const endAngle = (index + 1) * anglePerSection - 90;
      const color = colors[index % colors.length];

      // 장소가 1개일 때는 전체 원으로 처리
      let pathData;
      if (places.length === 1) {
        // 전체 원을 그리기 위해 두 개의 반원 arc를 사용
        pathData = [
          `M ${centerX} ${centerY - radius}`,
          `A ${radius} ${radius} 0 0 1 ${centerX} ${centerY + radius}`,
          `A ${radius} ${radius} 0 0 1 ${centerX} ${centerY - radius}`,
          "Z",
        ].join(" ");
      } else {
        // SVG path 계산 (기존 로직)
        const startAngleRad = (startAngle * Math.PI) / 180;
        const endAngleRad = (endAngle * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(startAngleRad);
        const y1 = centerY + radius * Math.sin(startAngleRad);
        const x2 = centerX + radius * Math.cos(endAngleRad);
        const y2 = centerY + radius * Math.sin(endAngleRad);

        const largeArcFlag = anglePerSection > 180 ? 1 : 0;

        pathData = [
          `M ${centerX} ${centerY}`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          "Z",
        ].join(" ");
      }

      // 텍스트 위치 계산 (12시 방향 기준)
      const textAngle = startAngle + anglePerSection / 2;
      const textAngleRad = (textAngle * Math.PI) / 180;
      const textRadius = radius * 0.7;
      const textX = centerX + textRadius * Math.cos(textAngleRad);
      const textY = centerY + textRadius * Math.sin(textAngleRad);

      return {
        place,
        pathData,
        color,
        textX,
        textY,
        textAngle:
          textAngle > 90 && textAngle < 270 ? textAngle + 180 : textAngle,
      };
    });

    return { sections, centerX, centerY, radius };
  }, [places, size]);

  // 반응형 크기 계산
  const responsiveSize = responsive ? Math.min(size, 240) : size;

  if (places.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-full border-2 border-gray-300 ${className}`}
        style={{
          width: responsiveSize,
          height: responsiveSize,
          minWidth: responsive ? "200px" : "auto",
          minHeight: responsive ? "200px" : "auto",
        }}
      >
        <div className="text-center text-gray-500">
          <p className="text-xs sm:text-sm font-medium">룰렛 휠</p>
          <p className="text-xs mt-1">장소를 추가해주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: responsiveSize,
        height: responsiveSize,
        minWidth: responsive ? "200px" : "auto",
        minHeight: responsive ? "200px" : "auto",
      }}
    >
      <svg
        width={responsiveSize}
        height={responsiveSize}
        className="drop-shadow-lg w-full h-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          willChange: "transform",
          maxWidth: "100%",
          height: "auto",
        }}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* 룰렛 섹션들 */}
        {wheelData.sections.map((section) => (
          <g key={section.place.id}>
            {/* 섹션 배경 */}
            <path
              d={section.pathData}
              fill={section.color}
              stroke="#ffffff"
              strokeWidth="2"
              className="drop-shadow-sm"
            />

            {/* 텍스트 */}
            <text
              x={section.textX}
              y={section.textY}
              fill="white"
              fontSize={Math.max(8, size / 20)}
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${section.textAngle} ${section.textX} ${section.textY})`}
              className="pointer-events-none select-none"
              style={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              {section.place.name.length > 8
                ? `${section.place.name.substring(0, 6)}...`
                : section.place.name}
            </text>
          </g>
        ))}

        {/* 중앙 원 */}
        <circle
          cx={wheelData.centerX}
          cy={wheelData.centerY}
          r={size * 0.03}
          fill="#374151"
          stroke="#ffffff"
          strokeWidth="2"
          className="drop-shadow-md"
        />
      </svg>

      {/* 포인터 - 룰렛 내부를 가리키는 화살표 */}
      <div
        className="absolute -top-4 left-1/2 transform -translate-x-1/2"
        style={{
          marginTop: responsiveSize * 0.15, // 룰렛 내부로 이동
          zIndex: 10,
        }}
      >
        <div
          className="w-0 h-0 border-l-transparent border-r-transparent border-t-red-600 drop-shadow-lg"
          style={{
            borderTopWidth: responsiveSize * 0.12, // 더 큰 화살표
            borderLeftWidth: responsiveSize * 0.04,
            borderRightWidth: responsiveSize * 0.04,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        />
      </div>
    </div>
  );
}
