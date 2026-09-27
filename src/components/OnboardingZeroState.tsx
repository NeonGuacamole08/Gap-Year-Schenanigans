import React, { useState, useRef } from 'react';
import {
  Mountain,
  UploadCloud,
  ShieldCheck,
  Sun,
  ArrowRight,
  EyeOff,
  CheckCircle2,
  Camera
} from 'lucide-react';
import { SAMPLE_BOARDS } from '../data/sampleBoards';
import { VisionBoardPayload } from '../types/serene';
import { sound } from '../utils/audio';

interface OnboardingZeroStateProps {
  onBoardIngested: (payload: VisionBoardPayload, title: string, coverImage?: string) => void;
  onOpenSafety: () => void;
  onOpenDemoModal: () => void;
}

export const OnboardingZeroState: React.FC<OnboardingZeroStateProps> = ({
  onBoardIngested,
  onOpenSafety,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [userNotes, setUserNotes] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Interactive Live Demo step
  const [demoStep, setDemoStep] = useState<number>(1);
  const [demoVerified, setDemoVerified] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_BOARDS[0]) => {
    sound.playCelestialBell();
    onBoardIngested(sample.payload, sample.title, sample.coverImage);
  };

  const handleUploadAndCurate = async () => {
    if (!previewUrl) {
      setErrorMsg('Please choose an image to upload, or pick one of the sample boards below.');
      return;
    }

    setIsParsing(true);
    setErrorMsg('');

    try {
      const parts = previewUrl.split(',');
      const base64Data = parts[1] || '';
      const mimeType = selectedFile?.type || 'image/jpeg';

      const res = await fetch('/api/vision/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Image: base64Data,
          mimeType,
          notes: userNotes,
        }),
      });

      if (!res.ok) {
        throw new Error('Something went wrong while processing your image. Please try again.');
      }

      const payload: VisionBoardPayload = await res.json();
      sound.playCelestialBell();
      onBoardIngested(payload, 'My Vision Board', previewUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Could not process vision board.');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#2C5E8A] bg-[#E8F2F8] border border-[#BFDBEE] mb-3">
          <Mountain className="w-3.5 h-3.5 text-[#E5A952]" />
          <span>Mountain Views & Clear Skies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#132E4A] tracking-tight mb-2.5">
          Turn Your Vision Board Into Daily Habits
        </h1>
        <p className="text-sm sm:text-base text-[#476885] leading-relaxed">
          Upload a photo of your vision board, dream journal, or mood board. Ascent turns your goals and quotes into simple daily habits you can track with photos.
        </p>
      </div>

      {/* Interactive Live Demo as the Explanation (Uses images directly from the site) */}
      <div className="mb-8 rounded-2xl bg-white border border-[#BFDBEE] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-[#E1EEF6] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#8F5E24] uppercase tracking-wider block mb-0.5">
              Interactive Demo
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#132E4A]">
              How It Works
            </h2>
          </div>

          {/* Simple Step Switcher */}
          <div className="flex items-center gap-1.5 bg-[#F0F6FA] p-1 rounded-xl border border-[#CFE2EE]">
            <button
              onClick={() => {
                setDemoStep(1);
                sound.playMountainChime();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                demoStep === 1
                  ? 'bg-white text-[#132E4A] shadow-xs'
                  : 'text-[#557796] hover:text-[#132E4A]'
              }`}
            >
              1. Upload Board
            </button>
            <button
              onClick={() => {
                setDemoStep(2);
                sound.playMountainChime();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                demoStep === 2
                  ? 'bg-white text-[#132E4A] shadow-xs'
                  : 'text-[#557796] hover:text-[#132E4A]'
              }`}
            >
              2. Daily Habits
            </button>
            <button
              onClick={() => {
                setDemoStep(3);
                sound.playMountainChime();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                demoStep === 3
                  ? 'bg-white text-[#132E4A] shadow-xs'
                  : 'text-[#557796] hover:text-[#132E4A]'
              }`}
            >
              3. Photo Check-In
            </button>
          </div>
        </div>

        {/* Demo Step 1: Upload */}
        {demoStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center animate-fade-in">
            <div className="rounded-xl overflow-hidden border border-[#CFE2EE] bg-[#0F2742] h-52">
              <img
                src="/src/assets/images/heavenly_mountain_summit_1790528027865.jpg"
                alt="Sample vision board"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-[#2C5E8A] uppercase tracking-wider block mb-1">
                Step 1: Upload Vision Board
              </span>
              <h3 className="text-base font-bold text-[#132E4A] mb-2">
                Snap a photo of your board or notes
              </h3>
              <p className="text-xs sm:text-sm text-[#476885] leading-relaxed mb-4">
                The app reads your photo to find quotes, languages you want to learn, travel destinations, study goals, and healthy routines.
              </p>
              <button
                onClick={() => {
                  setDemoStep(2);
                  sound.playMountainChime();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#1E3A5F] bg-[#E8F2F8] hover:bg-[#DDEBF5] border border-[#CFE2EE] transition-all"
              >
                <span>See Step 2: Generated Habits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Demo Step 2: Daily Habits */}
        {demoStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-fade-in">
            <div className="p-3.5 rounded-xl bg-[#F4F9FC] border border-[#CFE2EE]">
              <span className="text-[10px] font-bold uppercase text-[#2C5E8A] bg-white px-2 py-0.5 rounded border border-[#CFE2EE] inline-block mb-1.5">
                Language
              </span>
              <h4 className="text-sm font-semibold text-[#132E4A] mb-1">
                Practice French 25 mins
              </h4>
              <p className="text-xs text-[#52728F] leading-relaxed">
                Listen to a French lesson or practice speaking each morning.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F4F9FC] border border-[#CFE2EE]">
              <span className="text-[10px] font-bold uppercase text-[#8F5E24] bg-white px-2 py-0.5 rounded border border-[#F4E2D0] inline-block mb-1.5">
                Studies
              </span>
              <h4 className="text-sm font-semibold text-[#132E4A] mb-1">
                Scholarship Application
              </h4>
              <p className="text-xs text-[#52728F] leading-relaxed">
                Work on your grant proposal for 2 focused sessions each week.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F4F9FC] border border-[#CFE2EE] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#2E6B40] bg-white px-2 py-0.5 rounded border border-[#CFE4D7] inline-block mb-1.5">
                  No Guilt Tracking
                </span>
                <h4 className="text-sm font-semibold text-[#132E4A] mb-1">
                  Missed a Day? Take a Rest Day
                </h4>
                <p className="text-xs text-[#52728F] leading-relaxed">
                  No red penalty marks or lost streaks. Take a break whenever you need one.
                </p>
              </div>
              <button
                onClick={() => {
                  setDemoStep(3);
                  sound.playMountainChime();
                }}
                className="mt-3 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-[#1E3A5F] bg-white border border-[#CFE2EE] hover:bg-[#E8F2F8] transition-all"
              >
                <span>See Step 3: Photo Check-In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Demo Step 3: Photo Check-In */}
        {demoStep === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center animate-fade-in">
            <div className="rounded-xl overflow-hidden border border-[#CFE2EE] bg-[#0F2742] h-52 relative">
              <img
                src="/src/assets/images/alpine_journal_proof_1790528053411.jpg"
                alt="Study notes check in"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2.5 inset-x-2.5 p-2 rounded-lg bg-white/95 text-xs text-[#132E4A] flex items-center justify-between border border-[#CFE2EE]">
                <span className="flex items-center gap-1.5 text-[#2E6B40] font-semibold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3DA35B]" />
                  Privacy: IDs and numbers are blurred
                </span>
                <span className="text-[11px] font-semibold text-[#2C5E8A]">Photo Verified</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              demoVerified ? 'bg-[#FCF9F4] border-[#E5A952]' : 'bg-[#F4F9FC] border-[#CFE2EE]'
            }`}>
              <span className="text-xs font-bold text-[#8F5E24] uppercase tracking-wider block mb-1">
                Step 3: Upload Photo & Check In
              </span>
              <h3 className="text-base font-bold text-[#132E4A] mb-1.5">
                {demoVerified ? 'Goal Unlocked! (+25% Progress)' : 'Try uploading a photo check-in'}
              </h3>
              <p className="text-xs sm:text-sm text-[#476885] leading-relaxed mb-4">
                {demoVerified
                  ? 'Great job! Your photo was verified. The goal card updates with your new progress streak.'
                  : 'Take a quick photo of your study notes, book, or workout. Your board unlocks as you make progress.'}
              </p>

              {!demoVerified ? (
                <button
                  onClick={() => {
                    sound.playCelestialBell();
                    setDemoVerified(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-[#1E3A5F] hover:bg-[#2A4F7C] transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4 text-[#F5D899]" />
                  <span>Click to Test Photo Verification</span>
                </button>
              ) : (
                <button
                  onClick={() => handleSelectSample(SAMPLE_BOARDS[0])}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-[#132E4A] bg-[#FCECD7] hover:bg-[#F8DFC0] border border-[#E5A952] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#A66E22]" />
                  <span>Use This Sample Board Now</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Upload Box (Your First Upload) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#BFDBEE] shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#132E4A]">
              Upload Your Vision Board
            </h2>
            <p className="text-xs sm:text-sm text-[#557796] mt-0.5">
              Upload any photo of your vision board, dream collage, or journal notes.
            </p>
          </div>
          <button
            onClick={onOpenSafety}
            className="text-xs text-[#2E6B40] hover:text-[#1B4228] flex items-center gap-1.5 font-semibold"
          >
            <ShieldCheck className="w-4 h-4 text-[#3DA35B]" />
            <span>Privacy Guard Active</span>
          </button>
        </div>

        {/* Upload Drop Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-[#CFE2EE] hover:border-[#7EAED1] bg-[#F4F9FC]/60 hover:bg-[#F4F9FC] rounded-xl p-6 sm:p-8 text-center transition-colors mb-4"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {previewUrl ? (
            <div className="flex flex-col items-center">
              <img
                src={previewUrl}
                alt="Selected vision board"
                className="max-h-52 rounded-lg object-contain shadow-xs mb-2 border border-[#CFE2EE]"
              />
              <p className="text-xs text-[#2C5E8A] font-semibold">
                Click to choose a different photo
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-[#E8F2F8] flex items-center justify-center text-[#2C5E8A] mb-2 border border-[#CFE2EE]">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#132E4A] mb-1">
                Drop your vision board photo here, or click to browse
              </p>
              <p className="text-xs text-[#63809B]">
                Works with photos of posters, pinboards, journal pages, or phone collages (PNG, JPG, WebP)
              </p>
            </div>
          )}
        </div>

        {/* Optional Notes */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#132E4A] mb-1.5">
            Anything specific you want to focus on? (Optional)
          </label>
          <input
            type="text"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="e.g. Learning French, daily workouts, studying for exams, saving money."
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-[#F9FBFC] border border-[#CFE2EE] focus:border-[#7EAED1] outline-none text-[#132E4A] placeholder:text-[#8AA4B8]"
          />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-[#FDF2F0] border border-[#F4CCC4] text-xs text-[#A84232] mb-4 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#63809B] flex items-center gap-1.5">
            <EyeOff className="w-3.5 h-3.5 text-[#3DA35B]" />
            <span>Sensitive details (like passport numbers or addresses) are automatically blurred</span>
          </p>

          <button
            onClick={handleUploadAndCurate}
            disabled={isParsing || !previewUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#1E3A5F] hover:bg-[#2B527E] disabled:opacity-40 transition-colors shadow-xs"
          >
            {isParsing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Reading Your Vision Board...</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-[#F5D899]" />
                <span>Create My Daily Habits</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pre-made Samples */}
      <div className="border-t border-[#D7E7F2] pt-6">
        <div className="text-center mb-4">
          <h3 className="text-base sm:text-lg font-bold text-[#132E4A]">
            Or try a ready-made sample board:
          </h3>
          <p className="text-xs text-[#557796] mt-0.5">
            Click any board below to test the app right away.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SAMPLE_BOARDS.map((sb) => (
            <button
              key={sb.id}
              onClick={() => handleSelectSample(sb)}
              className="p-3.5 rounded-xl bg-white hover:bg-[#F9FBFC] border border-[#CFE2EE] hover:border-[#7EAED1] transition-all flex items-start gap-3.5 text-left group shadow-2xs hover:shadow-xs"
            >
              <img
                src={sb.coverImage}
                alt={sb.title}
                className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[#D7E7F2]"
              />
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF2F8] text-[#2C5E8A] inline-block mb-1">
                  {sb.payload.board_summary.detected_themes.slice(0, 2).join(' • ')}
                </span>
                <h4 className="font-semibold text-sm text-[#132E4A] group-hover:text-[#2C5E8A] transition-colors mb-0.5 line-clamp-1">
                  {sb.title}
                </h4>
                <p className="text-xs text-[#5C7D99] line-clamp-2 leading-relaxed">
                  {sb.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
