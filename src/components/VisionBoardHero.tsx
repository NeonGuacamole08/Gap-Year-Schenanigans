import React from 'react';
import { Mountain, Sun, RefreshCw, Heart, Plus } from 'lucide-react';
import { BoardSummary, ExtractedGoal } from '../types/serene';

interface VisionBoardHeroProps {
  summary: BoardSummary;
  boardTitle: string;
  boardSubtitle?: string;
  goals: ExtractedGoal[];
  onOpenUpload: () => void;
  onOpenSoftPause: () => void;
  onSwitchSample?: () => void;
  onAddGoal?: () => void;
}

export const VisionBoardHero: React.FC<VisionBoardHeroProps> = ({
  summary,
  boardTitle,
  goals,
  onOpenSoftPause,
  onSwitchSample,
  onAddGoal,
}) => {
  // Use nullish coalescing so 0 stays 0
  const totalIllumination = goals.reduce((acc, g) => acc + (g.illumination_level ?? 0), 0);
  const averageIllumination = goals.length > 0 ? Math.round(totalIllumination / goals.length) : 0;
  const completedCount = goals.filter((g) => (g.illumination_level ?? 0) >= 70).length;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-[#BFDBEE] p-5 sm:p-7 mb-8 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        {/* Left Column: Board Summary */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#2C5E8A] bg-[#E8F2F8] border border-[#BFDBEE]">
              <Mountain className="w-3.5 h-3.5 text-[#E5A952]" />
              Active Vision Board
            </span>
            {onSwitchSample && (
              <button
                onClick={onSwitchSample}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-[#4F718F] hover:text-[#132E4A] bg-[#F4F9FC] hover:bg-[#E8F2F8] border border-[#CFE2EE] transition-colors"
                title="Switch sample board"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Switch Board</span>
              </button>
            )}
            {onAddGoal && (
              <button
                onClick={onAddGoal}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#1E3A5F] bg-[#E8F2F8] hover:bg-[#DDEBF5] border border-[#CFE2EE] transition-colors"
                title="Add a goal or section the AI missed"
              >
                <Plus className="w-3 h-3" />
                <span>Add Goal</span>
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#132E4A] tracking-tight mb-2">
            {boardTitle}
          </h1>

          <p className="text-sm text-[#476885] leading-relaxed mb-4">
            {summary.overall_vision_statement}
          </p>

          {/* Theme tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {summary.detected_themes.map((theme, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#F0F6FA] text-[#2C5E8A] border border-[#CFE2EE]"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Progress & Rest Day */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[260px]">
          {/* Progress Card */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CFE2EE] flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#2C5E8A] mb-0.5">
                <Sun className="w-3.5 h-3.5 text-[#E5A952]" />
                <span>Board Progress</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#132E4A]">
                  {averageIllumination}%
                </span>
                <span className="text-xs text-[#5C7D99]">complete</span>
              </div>
              <p className="text-xs text-[#6E8DA7] mt-0.5">
                {completedCount} of {goals.length} goals unlocked
              </p>
            </div>

            {/* Circular progress meter */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="#E1EEF6"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="#E5A952"
                  strokeWidth="5"
                  strokeDasharray={138.2}
                  strokeDashoffset={138.2 - (138.2 * averageIllumination) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <Sun className="w-4 h-4 text-[#E5A952] absolute" />
            </div>
          </div>

          {/* Rest Day Card */}
          <div className="p-3.5 rounded-xl bg-white border border-[#CFE2EE] flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FDF7EE] flex items-center justify-center text-[#B07B37] shrink-0 border border-[#F4E5D2]">
                <Heart className="w-3.5 h-3.5 text-[#D4984F]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#132E4A]">Need a break today?</p>
                <p className="text-[11px] text-[#6E8DA7]">Pause your streak without losing progress.</p>
              </div>
            </div>
            <button
              onClick={onOpenSoftPause}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#8F5E24] bg-[#FCF5EB] hover:bg-[#F8ECE0] border border-[#F4E2D0] transition-colors shrink-0"
            >
              Rest Day
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
