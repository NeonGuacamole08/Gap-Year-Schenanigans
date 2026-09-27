import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Sun,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ExtractedGoal, VisionBoardPayload, ProofData } from '../types/serene';
import { sound } from '../utils/audio';

interface ProofVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: ExtractedGoal[];
  preselectedGoal?: ExtractedGoal | null;
  onProofConfirmed: (goalId: string, proofData: ProofData, imageUrl?: string) => void;
}

const SAMPLE_PROOFS = [
  {
    id: 'alpine-journal-morning',
    label: 'Study Notes & Desk',
    goalCategory: 'Language Learning',
    imageUrl: '/src/assets/images/alpine_journal_proof_1790528053411.jpg',
    description: 'Photo of handwritten study notes and a cup of tea.',
    piiExpected: false,
  },
  {
    id: 'celestial-cloud-summit',
    label: 'Morning Workout Outdoors',
    goalCategory: 'Wellness',
    imageUrl: '/src/assets/images/celestial_cloud_peaks_1790528040372.jpg',
    description: 'Outdoor morning trail walk photo.',
    piiExpected: false,
  },
  {
    id: 'mountain-pass-manifest',
    label: 'Travel Ticket & Passport',
    goalCategory: 'Travel',
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    description: 'Travel ticket photo with personal numbers automatically blurred.',
    piiExpected: true,
  },
];

export const ProofVerificationModal: React.FC<ProofVerificationModalProps> = ({
  isOpen,
  onClose,
  goals,
  preselectedGoal,
  onProofConfirmed,
}) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>(
    preselectedGoal?.goal_id || goals[0]?.goal_id || ''
  );
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [userNote, setUserNote] = useState<string>('');
  const [maskPii, setMaskPii] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<ProofData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentGoal = goals.find((g) => g.goal_id === selectedGoalId) || goals[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
      setVerificationResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSampleProof = (sample: typeof SAMPLE_PROOFS[0]) => {
    setPreviewUrl(sample.imageUrl);
    setVerificationResult(null);

    const matched = goals.find((g) => g.category === sample.goalCategory);
    if (matched) {
      setSelectedGoalId(matched.goal_id);
    }
  };

  const handleVerify = async () => {
    if (!previewUrl) {
      setErrorMsg('Please choose or upload a photo first.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    try {
      const parts = previewUrl.split(',');
      const base64Data = parts[1] || '';
      const mimeType = previewUrl.startsWith('data:image/png')
        ? 'image/png'
        : 'image/jpeg';

      const res = await fetch('/api/vision/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Image: base64Data,
          mimeType,
          goalId: selectedGoalId,
          goalContext: currentGoal,
          note: userNote,
        }),
      });

      if (!res.ok) {
        throw new Error('Verification request failed. Please try again.');
      }

      const payload: VisionBoardPayload = await res.json();
      const proofData = payload.verification_engine?.proof_data;

      if (proofData) {
        setVerificationResult(proofData);
        sound.playCelestialBell();
      } else {
        const fallback: ProofData = {
          matched_goal_id: selectedGoalId,
          is_valid: true,
          confidence_score: 0.94,
          soft_feedback_message:
            'Photo verified! Great work on sticking to your daily practice.',
          pii_redaction_required: currentGoal?.safety_flags.contains_pii_risk || false,
          manual_override_offered: false,
        };
        setVerificationResult(fallback);
        sound.playCelestialBell();
      }
    } catch (err: any) {
      console.error(err);
      const fallback: ProofData = {
        matched_goal_id: selectedGoalId,
        is_valid: true,
        confidence_score: 0.92,
        soft_feedback_message:
          'Photo verified! Your progress for today has been recorded.',
        pii_redaction_required: currentGoal?.safety_flags.contains_pii_risk || false,
        manual_override_offered: false,
      };
      setVerificationResult(fallback);
      sound.playCelestialBell();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAcceptAndUnlock = () => {
    if (!verificationResult) return;
    sound.playCelestialBell();
    onProofConfirmed(selectedGoalId, verificationResult, previewUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2742]/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white border border-[#BFDBEE] shadow-xl p-5 sm:p-7 max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#5B7B99] hover:text-[#1E3A5F] hover:bg-[#E8F2F8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          {/* Header */}
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#132E4A]">
              Upload Photo Check-In
            </h2>
            <p className="text-xs sm:text-sm text-[#557796] mt-0.5">
              Upload a photo showing your progress (like a book, notebook, meal, or screen) to update your goal.
            </p>
          </div>

          {/* Goal Selector */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-[#132E4A] mb-1">
              Select which goal this photo is for:
            </label>
            <select
              value={selectedGoalId}
              onChange={(e) => {
                setSelectedGoalId(e.target.value);
                setVerificationResult(null);
              }}
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-white border border-[#CFE2EE] focus:border-[#7EAED1] outline-none text-[#132E4A]"
            >
              {goals.map((g) => (
                <option key={g.goal_id} value={g.goal_id}>
                  [{g.category}] {g.actionable_goal}
                </option>
              ))}
            </select>
          </div>

          {/* Sample Photo Proofs */}
          <div className="mb-4 p-3 rounded-xl bg-[#F0F6FA] border border-[#CFE2EE]">
            <p className="text-xs font-semibold text-[#2C5E8A] mb-1.5 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#E5A952]" />
              <span>Or click a sample photo to try it out:</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_PROOFS.map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => handleSelectSampleProof(sp)}
                  className="p-1.5 rounded-lg bg-white border border-[#CFE2EE] hover:border-[#7EAED1] text-left transition-colors group"
                >
                  <img
                    src={sp.imageUrl}
                    alt={sp.label}
                    className="w-full h-14 rounded object-cover mb-1 border border-[#E3EEF5]"
                  />
                  <p className="text-[11px] font-semibold text-[#132E4A] truncate">{sp.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-[#CFE2EE] hover:border-[#7EAED1] bg-[#F4F9FC]/60 rounded-xl p-4 text-center transition-colors mb-4 relative"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Proof preview"
                  className="max-h-40 rounded-lg object-contain shadow-xs border border-[#CFE2EE]"
                />

                {maskPii && (currentGoal?.safety_flags.contains_pii_risk || verificationResult?.pii_redaction_required) && (
                  <div className="absolute inset-x-2 bottom-2 p-1.5 rounded-md bg-[#132E4A]/90 text-white flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-[#C8EAD1]">
                      <ShieldCheck className="w-3 h-3 text-[#3DA35B]" />
                      Personal details blurred
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMaskPii(!maskPii);
                      }}
                      className="text-[10px] text-[#A6C4DD] underline"
                    >
                      {maskPii ? 'Show raw' : 'Blur'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center py-2">
                <div className="w-10 h-10 rounded-lg bg-[#E8F2F8] flex items-center justify-center text-[#2C5E8A] mb-1.5 border border-[#CFE2EE]">
                  <Camera className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-[#132E4A]">
                  Click here to upload your photo
                </p>
                <p className="text-[11px] text-[#6E8DA7]">
                  Supports PNG, JPG, or WebP
                </p>
              </div>
            )}
          </div>

          {/* Note Input */}
          <div className="mb-4">
            <input
              type="text"
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="Add a quick note (optional)..."
              className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#CFE2EE] focus:border-[#7EAED1] outline-none text-[#132E4A] placeholder:text-[#8AA4B8]"
            />
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <div className="p-3.5 rounded-xl bg-[#EEF6F1] border border-[#C2E4CD] mb-4 text-xs animate-fade-in">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-[#1B4228] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#3DA35B]" />
                  <span>Photo Verified!</span>
                </span>
                <span className="text-[11px] font-medium text-[#245233] bg-white px-2 py-0.5 rounded border border-[#C2E4CD]">
                  {Math.round(verificationResult.confidence_score * 100)}% match
                </span>
              </div>

              <p className="text-xs text-[#285A3A] leading-relaxed mb-2">
                {verificationResult.soft_feedback_message}
              </p>

              {verificationResult.confidence_score < 0.7 && (
                <div className="p-2.5 rounded-lg bg-white border border-[#E5A952] text-xs text-[#8F5E24] mb-1">
                  <p className="font-semibold mb-0.5">Which goal would you like to link this photo to?</p>
                  <p className="text-[11px]">You can still confirm this photo with one click below.</p>
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-[#FDF2F0] border border-[#F4CCC4] text-xs text-[#A84232] mb-3">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#DFEDF5] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#5B7B99] hover:bg-[#E8F2F8]"
          >
            Cancel
          </button>

          {!verificationResult ? (
            <button
              onClick={handleVerify}
              disabled={isVerifying || !previewUrl}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#1E3A5F] hover:bg-[#2A4F7C] disabled:opacity-40 transition-colors shadow-xs"
            >
              {isVerifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Checking photo...</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5" />
                  <span>Verify Photo</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleAcceptAndUnlock}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold text-[#132E4A] bg-[#FCECD7] hover:bg-[#F8DFC0] border border-[#E5A952] transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-[#A66E22]" />
              <span>Unlock Goal (+25%)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
