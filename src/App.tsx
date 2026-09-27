/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VisionBoardHero } from './components/VisionBoardHero';
import { VisionTile } from './components/VisionTile';
import { OnboardingZeroState } from './components/OnboardingZeroState';
import { InteractiveDemoModal } from './components/InteractiveDemoModal';
import { UploadBoardModal } from './components/UploadBoardModal';
import { ProofVerificationModal } from './components/ProofVerificationModal';
import { JsonPayloadModal } from './components/JsonPayloadModal';
import { SafetyProtocolsModal } from './components/SafetyProtocolsModal';
import { SoftPauseModal } from './components/SoftPauseModal';
import { EditGoalModal } from './components/EditGoalModal';
import { MountainCelebrationParticles } from './components/MountainCelebrationParticles';
import { SAMPLE_BOARDS } from './data/sampleBoards';
import { VisionBoardPayload, ExtractedGoal, ProofData } from './types/serene';
import { sound } from './utils/audio';
import { Mountain, Sun, RotateCcw, ShieldCheck, Play, Camera, Plus, Sparkles } from 'lucide-react';

export default function App() {
  // Starts from zero: hasIngestedBoard is false initially
  const [hasIngestedBoard, setHasIngestedBoard] = useState<boolean>(false);
  const [currentSampleIndex, setCurrentSampleIndex] = useState<number>(0);
  const [boardTitle, setBoardTitle] = useState<string>('');
  const [boardSubtitle, setBoardSubtitle] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [payload, setPayload] = useState<VisionBoardPayload | null>(null);
  const [goals, setGoals] = useState<ExtractedGoal[]>([]);

  // Modals state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isProofOpen, setIsProofOpen] = useState<boolean>(false);
  const [isJsonOpen, setIsJsonOpen] = useState<boolean>(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState<boolean>(false);
  const [isSoftPauseOpen, setIsSoftPauseOpen] = useState<boolean>(false);
  const [activeGoalForProof, setActiveGoalForProof] = useState<ExtractedGoal | null>(null);

  // Edit / Add Goal Modal state
  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState<boolean>(false);
  const [goalToEdit, setGoalToEdit] = useState<ExtractedGoal | null>(null);

  // Mountain-Themed Particle Celebration State
  const [celebration, setCelebration] = useState<{
    active: boolean;
    title: string;
    message: string;
  }>({
    active: false,
    title: 'Milestone Reached!',
    message: 'Golden leaves & mountain snow celebrate your progress!',
  });

  // Audio & Rest Day tracking
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [softPausesTaken, setSoftPausesTaken] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>({
    title: 'Welcome to Ascent',
    desc: 'Upload a vision board to get started, or try the interactive demo.',
  });

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
  };

  const triggerCelebration = (goalTitle: string, isFull100: boolean) => {
    sound.playSummitCelebration();
    setCelebration({
      active: true,
      title: isFull100 ? 'Summit Achieved! 100% Complete' : 'Milestone Unlocked!',
      message: isFull100
        ? `Congratulations! "${goalTitle}" has reached 100% completion!`
        : `Great job! "${goalTitle}" reached the unlocked milestone!`,
    });
  };

  // Switch between sample boards
  const handleSwitchSample = () => {
    const nextIdx = (currentSampleIndex + 1) % SAMPLE_BOARDS.length;
    setCurrentSampleIndex(nextIdx);
    const nextBoard = SAMPLE_BOARDS[nextIdx];
    setBoardTitle(nextBoard.title);
    setBoardSubtitle(nextBoard.subtitle);
    setCoverImage(nextBoard.coverImage);
    setPayload(nextBoard.payload);
    setGoals(nextBoard.payload.extracted_goals);
    setHasIngestedBoard(true);
    sound.playMountainChime();
    showToast('Board Switched', `Now showing "${nextBoard.title}"`);
  };

  // When a vision board is uploaded or parsed
  const handleBoardParsed = (
    newPayload: VisionBoardPayload,
    title: string,
    newCoverImage?: string
  ) => {
    // Ensure all extracted goals start at 0% progress
    const zeroedGoals = newPayload.extracted_goals.map((g) => ({
      ...g,
      illumination_level: g.illumination_level ?? 0,
      streak_count: g.streak_count ?? 0,
      unlocked: Boolean(g.unlocked && (g.illumination_level ?? 0) >= 70),
    }));

    setPayload({
      ...newPayload,
      extracted_goals: zeroedGoals,
    });
    setGoals(zeroedGoals);
    setBoardTitle(title || 'My Vision Board');
    if (newCoverImage) {
      setCoverImage(newCoverImage);
    }
    setHasIngestedBoard(true);
    sound.playCelestialBell();
    showToast(
      'Vision Board Loaded',
      `Found ${zeroedGoals.length} goals. Ready to start daily progress from 0%.`
    );
  };

  // Reset to zero state
  const handleResetToZero = () => {
    setHasIngestedBoard(false);
    setPayload(null);
    setGoals([]);
    sound.playMountainChime();
    showToast('Board Cleared', 'Ready to upload a new vision board.');
  };

  // Add / Edit Goal Handlers
  const handleOpenAddGoal = () => {
    setGoalToEdit(null);
    setIsEditGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: ExtractedGoal) => {
    setGoalToEdit(goal);
    setIsEditGoalModalOpen(true);
  };

  const handleSaveGoal = (savedGoal: ExtractedGoal) => {
    const exists = goals.some((g) => g.goal_id === savedGoal.goal_id);
    let updatedGoals: ExtractedGoal[];

    if (exists) {
      updatedGoals = goals.map((g) => (g.goal_id === savedGoal.goal_id ? savedGoal : g));
      showToast('Goal Updated', `Saved changes for "${savedGoal.actionable_goal}".`);
    } else {
      updatedGoals = [savedGoal, ...goals];
      showToast('Goal Added', `Added "${savedGoal.actionable_goal}" to your board.`);
    }

    setGoals(updatedGoals);
    if (payload) {
      setPayload({
        ...payload,
        extracted_goals: updatedGoals,
      });
    } else {
      setPayload({
        board_summary: {
          detected_themes: [savedGoal.category],
          overall_vision_statement: 'My custom daily goals and habits.',
          aesthetic_palette_notes: 'Mountain peaks and clear skies.',
        },
        extracted_goals: updatedGoals,
        verification_engine: {
          is_proof_analysis: false,
          proof_data: {
            matched_goal_id: '',
            is_valid: false,
            confidence_score: 0,
            soft_feedback_message: '',
            pii_redaction_required: false,
            manual_override_offered: false,
          },
        },
      });
      setHasIngestedBoard(true);
    }

    // Trigger celebration if user sets goal to 100% or unlocked
    if ((savedGoal.illumination_level ?? 0) >= 100) {
      triggerCelebration(savedGoal.actionable_goal, true);
    } else {
      sound.playCelestialBell();
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter((g) => g.goal_id !== goalId);
    setGoals(updatedGoals);
    if (payload) {
      setPayload({
        ...payload,
        extracted_goals: updatedGoals,
      });
    }
    sound.playMountainChime();
    showToast('Goal Removed', 'The goal was deleted from your board.');
  };

  // When a visual proof is verified & accepted
  const handleProofConfirmed = (
    goalId: string,
    proofData: ProofData,
    imageUrl?: string
  ) => {
    let celebratoryGoalTitle: string | null = null;
    let isFull100 = false;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.goal_id === goalId) {
          const prevIllumination = g.illumination_level ?? 0;
          const nextIllumination = Math.min(100, prevIllumination + 25);
          const nextStreak = (g.streak_count ?? 0) + 1;

          if (nextIllumination >= 100 && prevIllumination < 100) {
            celebratoryGoalTitle = g.actionable_goal;
            isFull100 = true;
          } else if (nextIllumination >= 70 && prevIllumination < 70) {
            celebratoryGoalTitle = g.actionable_goal;
            isFull100 = false;
          }

          return {
            ...g,
            illumination_level: nextIllumination,
            streak_count: nextStreak,
            unlocked: nextIllumination >= 70,
            last_check_in: 'Verified today',
            tile_image_url: imageUrl || g.tile_image_url,
          };
        }
        return g;
      })
    );

    if (payload) {
      setPayload((prev) =>
        prev
          ? {
              ...prev,
              verification_engine: {
                is_proof_analysis: true,
                proof_data: proofData,
              },
            }
          : prev
      );
    }

    if (celebratoryGoalTitle) {
      triggerCelebration(celebratoryGoalTitle, isFull100);
    } else {
      sound.playCelestialBell();
    }

    showToast(
      'Photo Verified',
      proofData.soft_feedback_message || 'Progress recorded (+25%).'
    );
  };

  // Quick tap check-in
  const handleQuickCheckIn = (goal: ExtractedGoal) => {
    let celebratoryGoalTitle: string | null = null;
    let isFull100 = false;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.goal_id === goal.goal_id) {
          const prevIllumination = g.illumination_level ?? 0;
          const nextIllumination = Math.min(100, prevIllumination + 15);
          const nextStreak = (g.streak_count ?? 0) + 1;

          if (nextIllumination >= 100 && prevIllumination < 100) {
            celebratoryGoalTitle = g.actionable_goal;
            isFull100 = true;
          } else if (nextIllumination >= 70 && prevIllumination < 70) {
            celebratoryGoalTitle = g.actionable_goal;
            isFull100 = false;
          }

          return {
            ...g,
            illumination_level: nextIllumination,
            streak_count: nextStreak,
            unlocked: nextIllumination >= 70,
            last_check_in: 'Today',
          };
        }
        return g;
      })
    );

    if (celebratoryGoalTitle) {
      triggerCelebration(celebratoryGoalTitle, isFull100);
    } else {
      sound.playMountainChime();
    }

    showToast('Check-In Saved', `Logged daily progress for ${goal.category}.`);
  };

  // Open proof modal for specific goal
  const handleOfferProofForGoal = (goal: ExtractedGoal) => {
    setActiveGoalForProof(goal);
    setIsProofOpen(true);
  };

  // Rest Day confirmation
  const handleConfirmSoftPause = (_reason: string) => {
    setSoftPausesTaken((prev) => prev + 1);
    sound.playCelestialBell();
    showToast(
      'Rest Day Logged',
      'Your streak is paused for today without any penalty.'
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] text-[#1E3A5F] flex flex-col antialiased selection:bg-[#C8E0EF] selection:text-[#0F2742]">
      {/* Mountain Particle Celebration Animation (Snow crystals & gold leaf flakes) */}
      <MountainCelebrationParticles
        active={celebration.active}
        title={celebration.title}
        message={celebration.message}
        onComplete={() => setCelebration((prev) => ({ ...prev, active: false }))}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl bg-[#1E3A5F]/95 text-white p-4 shadow-xl border border-[#7EAED1]/40 backdrop-blur-md animate-fade-in flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-[#F5D899] mt-0.5">
            <Sun className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold tracking-wide text-[#F5D899]">
              {toastMessage.title}
            </p>
            <p className="text-[11px] text-[#DCEBF4] mt-0.5 leading-snug">
              {toastMessage.desc}
            </p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#96BDD4] hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <Header
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenProof={() => {
          setActiveGoalForProof(null);
          setIsProofOpen(true);
        }}
        onOpenJson={() => setIsJsonOpen(true)}
        onOpenSafety={() => setIsSafetyOpen(true)}
        onOpenSoftPause={() => setIsSoftPauseOpen(true)}
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
        onResetToZero={handleResetToZero}
        onAddGoal={handleOpenAddGoal}
        hasActiveBoard={hasIngestedBoard}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        softPausesTaken={softPausesTaken}
      />

      {/* Main Content */}
      <main className="flex-1 w-full">
        {!hasIngestedBoard || !payload ? (
          /* Zero State: Live Interactive Demo + First Upload */
          <OnboardingZeroState
            onBoardIngested={handleBoardParsed}
            onOpenSafety={() => setIsSafetyOpen(true)}
            onOpenDemoModal={() => setIsDemoModalOpen(true)}
          />
        ) : (
          /* Active Vision Board View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full animate-fade-in">
            {/* Board Hero Banner */}
            <VisionBoardHero
              summary={payload.board_summary}
              boardTitle={boardTitle}
              boardSubtitle={boardSubtitle}
              goals={goals}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenSoftPause={() => setIsSoftPauseOpen(true)}
              onSwitchSample={handleSwitchSample}
              onAddGoal={handleOpenAddGoal}
            />

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2C5E8A] px-2.5 py-0.5 rounded-full bg-[#E8F2F8] border border-[#BFDBEE] inline-block mb-1.5">
                  Your Goals & Habits
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#132E4A]">
                  Daily Habits from Your Board
                </h2>
                <p className="text-xs text-[#52728F] mt-0.5">
                  Check in daily or upload photos to unlock your goals. Click any card to edit.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Add Goal Button */}
                <button
                  onClick={handleOpenAddGoal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1E3A5F] hover:bg-[#2A4F7C] transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Goal</span>
                </button>

                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2C5E8A] hover:text-[#132E4A] bg-[#E8F2F8] hover:bg-[#DDEBF5] border border-[#CFE2EE] transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#E5A952]" />
                  <span>How it Works</span>
                </button>

                <button
                  onClick={handleResetToZero}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#52728F] hover:text-[#132E4A] bg-white hover:bg-[#F0F6FA] border border-[#CFE2EE] transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start from Zero</span>
                </button>

                {/* Quick Celebration Demo button */}
                <button
                  onClick={() => triggerCelebration('Summit Test', true)}
                  title="Test Particle Celebration"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#8F5E24] bg-[#FCF5EB] hover:bg-[#F8ECE0] border border-[#F4E2D0] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E5A952]" />
                  <span className="hidden sm:inline">Celebration</span>
                </button>

                <span className="text-xs text-[#2C5E8A] font-semibold bg-[#EAF2F8] px-2.5 py-1 rounded-lg border border-[#CFE2EE]">
                  {goals.length} Goals
                </span>
              </div>
            </div>

            {/* Vision Tiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {goals.map((goal) => (
                <VisionTile
                  key={goal.goal_id}
                  goal={goal}
                  onOfferProof={handleOfferProofForGoal}
                  onQuickCheckIn={handleQuickCheckIn}
                  onEditGoal={handleOpenEditGoal}
                />
              ))}

              {/* Add Missing Goal Card at end of grid */}
              <button
                onClick={handleOpenAddGoal}
                className="rounded-2xl border-2 border-dashed border-[#CFE2EE] hover:border-[#7EAED1] bg-white/60 hover:bg-white p-6 flex flex-col items-center justify-center text-center transition-all min-h-[220px] group shadow-2xs hover:shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8F2F8] text-[#2C5E8A] group-hover:bg-[#1E3A5F] group-hover:text-white transition-colors flex items-center justify-center mb-2.5 border border-[#CFE2EE]">
                  <Plus className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#132E4A] mb-1">
                  Add a Missing Goal or Section
                </h4>
                <p className="text-xs text-[#63809B] max-w-xs">
                  Did the AI miss something from your board? Click to create a custom habit or goal.
                </p>
              </button>
            </div>

            {/* Simple Tip Banner */}
            <div className="rounded-2xl bg-white p-6 sm:p-7 border border-[#BFDBEE] shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8F5E24] uppercase tracking-wider mb-1">
                  <Mountain className="w-4 h-4 text-[#E5A952]" />
                  <span>Daily Habit Tips</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#132E4A] mb-1">
                  Small daily steps build lasting results
                </h3>
                <p className="text-xs sm:text-sm text-[#52728F] leading-relaxed">
                  Missing a day happens. Just take a Rest Day to pause your streak, or upload a quick photo check-in whenever you're ready.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                <button
                  onClick={() => setIsSafetyOpen(true)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#285A3A] bg-[#EEF6F1] hover:bg-[#E0F2E7] border border-[#CFE4D7] transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-[#3DA35B]" />
                  <span>Privacy Rules</span>
                </button>
                <button
                  onClick={() => setIsProofOpen(true)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#132E4A] bg-[#FCECD7] hover:bg-[#FADDB7] border border-[#E5A952] transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-4 h-4 text-[#A66E22]" />
                  <span>Photo Check-In</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#DFEDF5] py-6 text-center text-xs text-[#63809B] bg-white/70">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-semibold text-[#1E3A5F]">
            Ascent — Vision Board & Habit Tracker
          </p>
          <div className="flex items-center gap-4 text-xs text-[#557796]">
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="hover:text-[#1E3A5F] underline transition-colors"
            >
              Interactive Demo
            </button>
            <span>•</span>
            <button
              onClick={() => setIsJsonOpen(true)}
              className="hover:text-[#1E3A5F] underline transition-colors"
            >
              JSON Data
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSafetyOpen(true)}
              className="hover:text-[#1E3A5F] underline transition-colors"
            >
              Privacy & Safety
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <InteractiveDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onLaunchDemoBoard={handleBoardParsed}
      />

      <UploadBoardModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onBoardParsed={handleBoardParsed}
      />

      <ProofVerificationModal
        isOpen={isProofOpen}
        onClose={() => setIsProofOpen(false)}
        goals={goals}
        preselectedGoal={activeGoalForProof}
        onProofConfirmed={handleProofConfirmed}
      />

      {/* Edit & Add Goal Modal */}
      <EditGoalModal
        isOpen={isEditGoalModalOpen}
        onClose={() => setIsEditGoalModalOpen(false)}
        goalToEdit={goalToEdit}
        onSaveGoal={handleSaveGoal}
        onDeleteGoal={handleDeleteGoal}
      />

      {payload && (
        <JsonPayloadModal
          isOpen={isJsonOpen}
          onClose={() => setIsJsonOpen(false)}
          payload={payload}
        />
      )}

      <SafetyProtocolsModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
      />

      <SoftPauseModal
        isOpen={isSoftPauseOpen}
        onClose={() => setIsSoftPauseOpen(false)}
        onConfirmSoftPause={handleConfirmSoftPause}
      />
    </div>
  );
}
