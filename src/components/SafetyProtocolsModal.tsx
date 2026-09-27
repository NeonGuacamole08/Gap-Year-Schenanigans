import React from 'react';
import { X, ShieldCheck, Heart, EyeOff, Scale, UserCheck } from 'lucide-react';

interface SafetyProtocolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyProtocolsModal: React.FC<SafetyProtocolsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2742]/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white border border-[#BFDBEE] shadow-xl p-5 sm:p-7 max-h-[90vh] flex flex-col justify-between overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#5B7B99] hover:text-[#1E3A5F] hover:bg-[#E8F2F8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          {/* Header */}
          <div className="mb-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E6B40] px-2.5 py-0.5 rounded-full bg-[#EEF6F1] border border-[#CFE4D7]">
              Safety & Privacy
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#132E4A] mt-2 mb-1">
              Safety Rules & Privacy
            </h2>
            <p className="text-xs sm:text-sm text-[#52728F] leading-relaxed">
              How Ascent protects your personal information and supports healthy habit building.
            </p>
          </div>

          {/* 4 Protocol Cards */}
          <div className="space-y-3 mb-5">
            {/* 1. Anti-Burnout */}
            <div className="p-3.5 rounded-xl bg-white border border-[#CFE2EE] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FDF4EA] flex items-center justify-center text-[#B07B37] shrink-0 mt-0.5 border border-[#F4E2D0]">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#132E4A] mb-0.5">
                  1. No Guilt Tracking
                </h3>
                <p className="text-xs text-[#52728F] leading-relaxed">
                  No red penalty marks or lost streaks if you miss a day. You can take a <strong>Rest Day</strong> anytime you need a break without losing your progress.
                </p>
              </div>
            </div>

            {/* 2. Privacy & PII Masking */}
            <div className="p-3.5 rounded-xl bg-[#F0F8F4] border border-[#C5E5D0] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#DDF1E4] flex items-center justify-center text-[#285A3A] shrink-0 mt-0.5 border border-[#BCE1C7]">
                <EyeOff className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1B4228] mb-0.5">
                  2. Privacy Protection
                </h3>
                <p className="text-xs text-[#2E6B40] leading-relaxed">
                  When you upload photos of tickets, IDs, or letters, sensitive details (like passport numbers, addresses, and account balances) are automatically detected and blurred.
                </p>
              </div>
            </div>

            {/* 3. Scope Boundaries */}
            <div className="p-3.5 rounded-xl bg-white border border-[#CFE2EE] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E8F2F8] flex items-center justify-center text-[#2C5E8A] shrink-0 mt-0.5 border border-[#CFE2EE]">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#132E4A] mb-0.5">
                  3. Habit Tracking Only
                </h3>
                <p className="text-xs text-[#52728F] leading-relaxed">
                  This app is a personal habit and organization tool. It does not provide medical, legal, or financial advice.
                </p>
              </div>
            </div>

            {/* 4. Human-In-The-Loop */}
            <div className="p-3.5 rounded-xl bg-white border border-[#CFE2EE] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FDF4EA] flex items-center justify-center text-[#B07B37] shrink-0 mt-0.5 border border-[#F4E2D0]">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#132E4A] mb-0.5">
                  4. Easy Manual Confirmation
                </h3>
                <p className="text-xs text-[#52728F] leading-relaxed">
                  If the app isn't sure which goal your photo matches, it will simply ask: <em>"Which goal does this photo belong to?"</em> so you can confirm it with one click.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#DFEDF5] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#1E3A5F] hover:bg-[#2A4F7C] transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
