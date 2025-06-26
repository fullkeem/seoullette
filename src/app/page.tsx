import { RouletteGame } from "@/components/roulette/roulette-game";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-0">
      <RouletteGame />
    </div>
  );
}
