import React from 'react';
import {
  Sun,
  ShieldCheck,
  Clock,
  Camera,
  CheckCircle2,
  Flame,
  Edit2,
  Sparkles
} from 'lucide-react';
import { ExtractedGoal } from '../types/serene';

interface VisionTileProps {
  goal: ExtractedGoal;
  onOfferProof: (goal: ExtractedGoal) => void;
  onQuickCheckIn: (goal: ExtractedGoal) => void;
  onEditGoal?: (goal: ExtractedGoal) => void;
}

export const VisionTile: React.FC<VisionTileProps> = ({
  goal,
  onOfferProof,
  onQuickCheckIn,
  onEditGoal,
}) => {
  // Starts from 0% unless recorded
  const progress = goal.illumination_level ?? 0;
  const is100Percent = progress >= 100;
  const isUnlocked = progress >= 70;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white border transition-all duration-300 flex flex-col justify-between shadow-2xs hover:shadow-xs ${
        is100Percent
          ? 'border-[#E5A952] ring-2 ring-[#E5A952]/20 bg-gradient-to-b from-[#FFFDF9] to-[#FDF8EE]'
          : isUnlocked
          ? 'border-[#E8C58D] bg-gradient-to-b from-white to-[#FDFBF7]'
          : 'border-[#CFE2EE] hover:border-[#96C0DE]'
      }`}
    >
      {/* Tile Image */}
      {goal.tile_image_url && (
        <div className="relative h-48 w-full overflow-hidden bg-[#DCEBF4]">
          <img
            src={goal.tile_image_url}
            alt={goal.actionable_goal}
            className={`w-full h-full object-cover transition-all duration-500 ${
              is100Percent
                ? 'filter-none opacity-100 scale-102'
                : isUnlocked
                ? 'filter-none opacity-95'
                : 'blur-[2px] opacity-75'
            }`}
          />

          {/* Progress Badge */}
          <div
            className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs border ${
              is100Percent
                ? 'bg-[#FCF5EB] text-[#8F5E24] border-[#E5A952] ring-1 ring-[#E5A952]/50'
                : 'bg-white/95 text-[#132E4A] border-[#CFE2EE]'
            }`}
          >
            {is100Percent ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#E5A952] animate-pulse" />
                <span>100% Summit!</span>
              </>
            ) : (
              <>
                <Sun className={`w-3.5 h-3.5 ${isUnlocked ? 'text-[#E5A952]' : 'text-[#7EAED1]'}`} />
                <span>{progress}% {isUnlocked ? 'Unlocked' : 'Progress'}</span>
              </>
            )}
          </div>

          {/* Category Chip & Edit Button */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-white/90 text-[#2C5E8A] border border-[#CFE2EE]">
              {goal.category}
            </span>

            {onEditGoal && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditGoal(goal);
                }}
                title="Edit this goal"
                className="p-1 rounded-lg bg-white/90 hover:bg-white text-[#52728F] hover:text-[#132E4A] border border-[#CFE2EE] transition-colors shadow-2xs"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Goal Title */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-bold text-[#132E4A] leading-snug">
              {goal.actionable_goal}
            </h3>
            {!goal.tile_image_url && onEditGoal && (
              <button
                onClick={() => onEditGoal(goal)}
                className="p-1 rounded-lg text-[#52728F] hover:text-[#132E4A] hover:bg-[#F0F6FA]"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Frequency & Streak */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F0F6FA] text-[#335675] border border-[#DCEBF4]">
              <Clock className="w-3 h-3 text-[#7EAED1]" />
              <span className="capitalize">{goal.suggested_frequency}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F0F6FA] text-[#335675] border border-[#DCEBF4]">
              <span>Target: {goal.target_metric.default_target} {goal.target_metric.unit}</span>
            </span>

            {goal.streak_count !== undefined && goal.streak_count > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FCF5EB] text-[#8F5E24] border border-[#F4E2D0] font-semibold">
                <Flame className="w-3 h-3 text-[#E5A952]" />
                <span>{goal.streak_count} day streak</span>
              </span>
            )}
          </div>

          {/* Motivation Nudge */}
          <p className="text-xs text-[#52728F] leading-relaxed mb-3 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#DFECF5]">
            "{goal.motivational_nudge_template}"
          </p>

          {/* Safety note */}
          {goal.safety_flags.contains_pii_risk && (
            <div className="flex items-center gap-1 text-[11px] text-[#2F613E] bg-[#EEF6F1] px-2 py-1 rounded-md border border-[#CFE4D7] mb-3">
              <ShieldCheck className="w-3 h-3 text-[#3DA35B] shrink-0" />
              <span>Personal details on uploaded photos are automatically blurred.</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-[#DFEDF5] flex items-center justify-between gap-2">
          <button
            onClick={() => onQuickCheckIn(goal)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-[#385B7A] hover:text-[#132E4A] bg-[#F0F6FA] hover:bg-[#E4EEF5] border border-[#CFE2EE] transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7EAED1]" />
            <span>Check In</span>
          </button>

          <button
            onClick={() => onOfferProof(goal)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-[#132E4A] bg-[#FCECD7] hover:bg-[#F8DFC0] border border-[#E5A952] transition-colors shadow-2xs"
          >
            <Camera className="w-3.5 h-3.5 text-[#A66E22]" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
