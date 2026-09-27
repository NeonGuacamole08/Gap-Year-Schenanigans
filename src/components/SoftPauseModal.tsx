import React, { useState } from 'react';
import { X, Heart, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface SoftPauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSoftPause: (reason: string) => void;
}

const REST_REASONS = [
  'Resting and recharging today',
  'Busy traveling or commuting',
  'Spending time with family or friends',
  'Taking a planned day off',
];

export const SoftPauseModal: React.FC<SoftPauseModalProps> = ({
  isOpen,
  onClose,
  onConfirmSoftPause,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(REST_REASONS[0]);

  if (!isOpen) return null;

  const handleTakePause = () => {
    sound.playCelestialBell();
    onConfirmSoftPause(selectedReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2742]/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white border border-[#BFDBEE] shadow-xl p-5 sm:p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#5B7B99] hover:text-[#1E3A5F] hover:bg-[#E8F2F8]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-[#FDF4EA] border border-[#F4E2D0] flex items-center justify-center text-[#B07B37] mb-3">
          <Heart className="w-5 h-5" />
        </div>

        <h2 className="text-xl font-bold text-[#132E4A] mb-1">
          Take a Rest Day
        </h2>

        <p className="text-xs sm:text-sm text-[#52728F] mb-4 leading-relaxed">
          Need a break today? Rest Days pause your streaks without penalty so you don't lose any progress.
        </p>

        {/* Reason options */}
        <div className="space-y-2 mb-5">
          {REST_REASONS.map((reason, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedReason(reason)}
              className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between font-medium ${
                selectedReason === reason
                  ? 'bg-[#F0F6FA] border-[#7EAED1] text-[#132E4A]'
                  : 'bg-white border-[#CFE2EE] text-[#557796] hover:bg-[#F9FBFC]'
              }`}
            >
              <span>{reason}</span>
              {selectedReason === reason && <Check className="w-4 h-4 text-[#2C5E8A]" />}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#DFEDF5] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#5B7B99] hover:bg-[#E8F2F8]"
          >
            I will continue today
          </button>

          <button
            onClick={handleTakePause}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-[#132E4A] bg-[#FCECD7] hover:bg-[#F8DFC0] border border-[#E5A952] transition-colors shadow-2xs"
          >
            <Heart className="w-3.5 h-3.5 text-[#B07B37]" />
            <span>Confirm Rest Day</span>
          </button>
        </div>
      </div>
    </div>
  );
};
