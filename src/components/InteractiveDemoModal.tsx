import React, { useState } from 'react';
import {
  X,
  Mountain,
  Sun,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Camera
} from 'lucide-react';
import { VisionBoardPayload } from '../types/serene';
import { SAMPLE_BOARDS } from '../data/sampleBoards';
import { sound } from '../utils/audio';

interface InteractiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDemoBoard: (payload: VisionBoardPayload, title: string, coverImage?: string) => void;
}

export const InteractiveDemoModal: React.FC<InteractiveDemoModalProps> = ({
  isOpen,
  onClose,
  onLaunchDemoBoard,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [demoProofVerified, setDemoProofVerified] = useState<boolean>(false);
  const [tileProgress, setTileProgress] = useState<number>(45);

  if (!isOpen) return null;

  const handleNext = () => {
    sound.playMountainChime();
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    sound.playMountainChime();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSimulateProof = () => {
    sound.playCelestialBell();
    setDemoProofVerified(true);
    setTileProgress(85);
  };

  const handleDeploy = () => {
    sound.playCelestialBell();
    const demoBoard = SAMPLE_BOARDS[0];
    onLaunchDemoBoard(demoBoard.payload, demoBoard.title, demoBoard.coverImage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2742]/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white border border-[#BFDBEE] shadow-xl p-5 sm:p-7 max-h-[90vh] flex flex-col justify-between overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#5B7B99] hover:text-[#1E3A5F] hover:bg-[#E8F2F8] transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#2C5E8A] bg-[#E1EEF6] border border-[#BFDBEE] mb-1.5">
            Interactive Demo
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#132E4A]">
            How Ascent Works
          </h2>
          <p className="text-xs sm:text-sm text-[#4A6B88] mt-0.5">
            Follow the 3 steps below to see how a vision board becomes daily habits.
          </p>

          {/* Simple Step Indicator */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <button
              onClick={() => setCurrentStep(1)}
              className={`p-2 rounded-lg text-left text-xs transition-colors border ${
                currentStep === 1
                  ? 'bg-[#EAF2F8] border-[#7EAED1] text-[#132E4A] font-bold'
                  : 'bg-[#F9FBFC] border-[#CFE2EE] text-[#557796]'
              }`}
            >
              1. Upload Board
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className={`p-2 rounded-lg text-left text-xs transition-colors border ${
                currentStep === 2
                  ? 'bg-[#EAF2F8] border-[#7EAED1] text-[#132E4A] font-bold'
                  : 'bg-[#F9FBFC] border-[#CFE2EE] text-[#557796]'
              }`}
            >
              2. Daily Habits
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className={`p-2 rounded-lg text-left text-xs transition-colors border ${
                currentStep === 3
                  ? 'bg-[#EAF2F8] border-[#7EAED1] text-[#132E4A] font-bold'
                  : 'bg-[#F9FBFC] border-[#CFE2EE] text-[#557796]'
              }`}
            >
              3. Check-In
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 my-1">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="animate-fade-in space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-[#BFDBEE] bg-[#0F2742] h-52">
                <img
                  src="/src/assets/images/heavenly_mountain_summit_1790528027865.jpg"
                  alt="Vision Board Photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2742]/85 via-transparent to-transparent flex flex-col justify-end p-4">
                  <p className="text-xs font-semibold text-white">
                    Sample Vision Board: Mountain Goals & Study Notes
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F0F6FA] border border-[#CFE2EE] text-xs text-[#2A5277]">
                <p className="font-semibold mb-1">What happens when you upload:</p>
                <ul className="list-disc pl-4 space-y-1 text-[#476885]">
                  <li><strong>Quotes & Mindsets:</strong> Turned into short daily reflections.</li>
                  <li><strong>Courses & Grades:</strong> Turned into study streaks and weekly targets.</li>
                  <li><strong>Travel & Passports:</strong> Turned into savings milestones.</li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="animate-fade-in space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#F4F9FC] border border-[#CFE2EE]">
                  <span className="text-[10px] font-bold uppercase text-[#2C5E8A] bg-white px-2 py-0.5 rounded border border-[#CFE2EE] inline-block mb-1.5">
                    Language Habit
                  </span>
                  <h4 className="text-sm font-bold text-[#132E4A] mb-1">
                    Practice French for 25 Mins
                  </h4>
                  <p className="text-xs text-[#52728F] leading-relaxed">
                    Listen to a podcast or practice speaking each morning.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F4F9FC] border border-[#CFE2EE]">
                  <span className="text-[10px] font-bold uppercase text-[#8F5E24] bg-white px-2 py-0.5 rounded border border-[#F4E2D0] inline-block mb-1.5">
                    Academic Goal
                  </span>
                  <h4 className="text-sm font-bold text-[#132E4A] mb-1">
                    Scholarship Essays
                  </h4>
                  <p className="text-xs text-[#52728F] leading-relaxed">
                    Write or edit one essay section twice a week.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#EEF6F1] border border-[#CFE4D7] text-xs text-[#2E6B40] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#3DA35B]" />
                <span><strong>No Guilt Policy:</strong> Missing a day won't break your progress. Take a Rest Day anytime.</span>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="animate-fade-in space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative rounded-xl overflow-hidden border border-[#CFE2EE] bg-[#0F2742] h-48">
                  <img
                    src="/src/assets/images/alpine_journal_proof_1790528053411.jpg"
                    alt="Study journal proof"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2.5 inset-x-2.5 p-2 rounded-lg bg-white/95 text-xs text-[#132E4A] flex items-center justify-between border border-[#CFE2EE]">
                    <span className="text-[11px] font-medium text-[#2E6B40]">
                      Personal IDs auto-blurred
                    </span>
                    <span className="text-[11px] font-semibold text-[#2C5E8A]">Photo Verified</span>
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  demoProofVerified ? 'bg-[#FCF9F4] border-[#E5A952]' : 'bg-[#F4F9FC] border-[#CFE2EE]'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#132E4A]">French Practice</span>
                      <span className="text-xs font-semibold text-[#8F5E24]">{tileProgress}% Complete</span>
                    </div>
                    <p className="text-xs text-[#52728F] leading-relaxed mb-3">
                      {demoProofVerified
                        ? 'Great work! Your photo was verified. Progress updated.'
                        : 'Upload a quick photo of your notebook or desk to check in.'}
                    </p>
                  </div>

                  {!demoProofVerified ? (
                    <button
                      onClick={handleSimulateProof}
                      className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-white bg-[#1E3A5F] hover:bg-[#2A4F7C] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Click to Test Photo Check-In</span>
                    </button>
                  ) : (
                    <div className="p-2 rounded-lg bg-white border border-[#E5A952] text-center text-xs font-semibold text-[#8F5E24] flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#A66E22]" />
                      <span>Verified! Goal Progress +40%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#E1EEF6] flex items-center justify-between gap-3">
          <div>
            {currentStep > 1 && (
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#466986] hover:bg-[#E8F2F8] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#1E3A5F] hover:bg-[#2A4F7C] transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleDeploy}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-[#132E4A] bg-[#FCECD7] hover:bg-[#F8DFC0] border border-[#E5A952] transition-all"
              >
                <Mountain className="w-3.5 h-3.5 text-[#A66E22]" />
                <span>Use This Board in App</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
