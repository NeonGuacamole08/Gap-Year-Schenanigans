import React from 'react';
import {
  Mountain,
  Sun,
  ShieldCheck,
  Code2,
  Volume2,
  VolumeX,
  Plus,
  Heart,
  Play
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  onOpenUpload: () => void;
  onOpenProof: () => void;
  onOpenJson: () => void;
  onOpenSafety: () => void;
  onOpenSoftPause: () => void;
  onOpenDemoModal: () => void;
  onResetToZero?: () => void;
  onAddGoal?: () => void;
  hasActiveBoard: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  softPausesTaken: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenUpload,
  onOpenProof,
  onOpenJson,
  onOpenSafety,
  onOpenSoftPause,
  onOpenDemoModal,
  onResetToZero,
  onAddGoal,
  hasActiveBoard,
  soundEnabled,
  setSoundEnabled,
  softPausesTaken,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playCelestialBell();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#CFE2EE] bg-[#F4F8FA]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7EAED1] via-[#E1EEF6] to-[#FCECD7] p-[1.5px] shadow-xs flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
              <Mountain className="w-5 h-5 text-[#2C5E8A]" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xl tracking-tight text-[#132E4A]">
                Ascent
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EBF4F9] text-[#2C5E8A] border border-[#CFE2EE] font-medium">
                Goal Tracker
              </span>
            </div>
            <p className="text-xs text-[#557796]">
              Turn your vision board into simple daily habits
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Audio Chime Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute sound' : 'Turn sound on'}
            className="p-2 rounded-lg text-[#52728F] hover:text-[#132E4A] hover:bg-[#E8F2F8] border border-[#CFE2EE] transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
          </button>

          {/* Interactive Live Demo */}
          <button
            onClick={onOpenDemoModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#8F5E24] bg-[#FCF5EB] hover:bg-[#F8ECE0] border border-[#F4E2D0] transition-colors shadow-2xs"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>How it Works</span>
          </button>

          {/* Privacy & Safety */}
          <button
            onClick={onOpenSafety}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#2F613E] bg-[#EEF6F1] hover:bg-[#E2F0E7] border border-[#CFE4D7] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#3DA35B]" />
            <span>Privacy</span>
          </button>

          {/* JSON Data */}
          <button
            onClick={onOpenJson}
            title="Inspect Structured JSON Output"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#446682] bg-[#EAF2F8] hover:bg-[#DDEBF5] border border-[#CFE2EE] transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-[#6D91AF]" />
            <span className="hidden md:inline">JSON</span>
          </button>

          {/* Add Missing Goal Button */}
          {hasActiveBoard && onAddGoal && (
            <button
              onClick={onAddGoal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1E3A5F] bg-[#E8F2F8] hover:bg-[#DDEBF5] border border-[#CFE2EE] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Goal</span>
            </button>
          )}

          {/* Rest Day */}
          {hasActiveBoard && (
            <button
              onClick={onOpenSoftPause}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#7C5A2B] bg-[#FDF7EE] hover:bg-[#F8EFE0] border border-[#F4E5D2] transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-[#D4984F]" />
              <span>Rest Day ({softPausesTaken})</span>
            </button>
          )}

          {/* Start Over */}
          {hasActiveBoard && onResetToZero && (
            <button
              onClick={onResetToZero}
              title="Clear current board and start over"
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#68859E] hover:text-[#132E4A] hover:bg-[#E8F2F8] transition-colors"
            >
              <span>Start Over</span>
            </button>
          )}

          {/* Photo Check-in */}
          {hasActiveBoard && (
            <button
              onClick={onOpenProof}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#132E4A] bg-[#FCECD7] hover:bg-[#F8DFC0] border border-[#E5A952] transition-colors shadow-2xs"
            >
              <Sun className="w-3.5 h-3.5 text-[#A66E22]" />
              <span>Photo Check-In</span>
            </button>
          )}

          {/* Upload Board Button */}
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1E3A5F] hover:bg-[#2A4F7C] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{hasActiveBoard ? 'New Board' : 'Upload Board'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
