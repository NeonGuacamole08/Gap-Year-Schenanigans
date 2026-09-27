import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Mountain,
  Sun,
  FileText,
  Award,
  Image as ImageIcon,
} from 'lucide-react';
import { VisionBoardPayload } from '../types/serene';
import { SAMPLE_BOARDS } from '../data/sampleBoards';
import { sound } from '../utils/audio';

interface UploadBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBoardParsed: (payload: VisionBoardPayload, title: string, coverImage?: string) => void;
}

export const UploadBoardModal: React.FC<UploadBoardModalProps> = ({
  isOpen,
  onClose,
  onBoardParsed,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [userNotes, setUserNotes] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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
    onBoardParsed(sample.payload, sample.title, sample.coverImage);
    onClose();
  };

  const handleStartParsing = async () => {
    if (!previewUrl) {
      setErrorMsg('Please select or upload a vision board image first.');
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
        throw new Error('Could not read the vision board image. Please try again.');
      }

      const payload: VisionBoardPayload = await res.json();
      sound.playMountainChime();
      onBoardParsed(payload, 'My Vision Board', previewUrl);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Error parsing vision board image.');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2742]/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white border border-[#BFDBEE] shadow-xl p-6 sm:p-7 max-h-[90vh] flex flex-col justify-between overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#5B7B99] hover:text-[#1E3A5F] hover:bg-[#E8F2F8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          {/* Header */}
          <div className="mb-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2C5E8A] px-2.5 py-0.5 rounded-full bg-[#E8F2F8] border border-[#BFDBEE]">
              Upload Board
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#132E4A] mt-2 mb-1">
              Add Your Vision Board
            </h2>
            <p className="text-xs sm:text-sm text-[#52728F] leading-relaxed">
              Upload a picture of your board, notebook, or mood board. Ascent will turn your goals and quotes into daily habits you can track with photos.
            </p>
          </div>

          {/* Quick Select Pre-Curated */}
          <div className="mb-5 p-3.5 rounded-xl bg-[#F0F6FA] border border-[#CFE2EE]">
            <p className="text-xs font-semibold text-[#2C5E8A] mb-2 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-[#E5A952]" />
              <span>Or click a ready-made sample board:</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SAMPLE_BOARDS.map((sb) => (
                <button
                  key={sb.id}
                  onClick={() => handleSelectSample(sb)}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-[#F9FBFC] border border-[#CFE2EE] hover:border-[#7EAED1] transition-all text-left group"
                >
                  <img
                    src={sb.coverImage}
                    alt={sb.title}
                    className="w-12 h-12 rounded-lg object-cover border border-[#DFEDF5]"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#132E4A] group-hover:text-[#2C5E8A] transition-colors line-clamp-1">
                      {sb.title}
                    </p>
                    <p className="text-[11px] text-[#63809B] line-clamp-1">
                      {sb.payload.board_summary.detected_themes.slice(0, 2).join(' • ')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-[#CFE2EE] hover:border-[#7EAED1] bg-[#F4F9FC]/60 hover:bg-[#F4F9FC] rounded-xl p-5 text-center transition-all mb-4"
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
                  alt="Vision Board Preview"
                  className="max-h-44 rounded-lg object-contain shadow-xs mb-2 border border-[#CFE2EE]"
                />
                <p className="text-xs text-[#2A5D88] font-semibold">Click to choose a different photo</p>
              </div>
            ) : (
              <div className="flex flex-col items-center py-3">
                <div className="w-12 h-12 rounded-xl bg-[#E8F2F8] flex items-center justify-center text-[#2C5E8A] mb-2 border border-[#CFE2EE]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-[#132E4A] mb-0.5">
                  Click to choose a vision board photo
                </p>
                <p className="text-xs text-[#63809B]">
                  Supports PNG, JPG, or WebP (posters, journal pages, screenshots)
                </p>
              </div>
            )}
          </div>

          {/* User Notes Context */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-[#132E4A] mb-1">
              Any specific focus or goals? (Optional)
            </label>
            <input
              type="text"
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="e.g. Learning French, daily workouts, studying for exams, saving money."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white border border-[#CFE2EE] focus:border-[#7EAED1] outline-none text-[#132E4A] placeholder:text-[#8AA4B8]"
            />
          </div>

          {/* 3-Bucket Explainer */}
          <div className="p-3 rounded-xl bg-[#F0F6FA] border border-[#CFE2EE] mb-4">
            <p className="text-[11px] font-semibold text-[#2C5E8A] mb-1.5">
              How your board is read:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-white border border-[#DFEDF5]">
                <FileText className="w-3.5 h-3.5 text-[#E5A952] mx-auto mb-1" />
                <span className="text-[10px] font-semibold text-[#132E4A] block">1. Quotes</span>
                <span className="text-[9px] text-[#63809B]">Turned into daily habits</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#DFEDF5]">
                <Award className="w-3.5 h-3.5 text-[#2C5E8A] mx-auto mb-1" />
                <span className="text-[10px] font-semibold text-[#132E4A] block">2. Goals</span>
                <span className="text-[9px] text-[#63809B]">Turned into study streaks</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#DFEDF5]">
                <ImageIcon className="w-3.5 h-3.5 text-[#4A885B] mx-auto mb-1" />
                <span className="text-[10px] font-semibold text-[#132E4A] block">3. Travel & Photos</span>
                <span className="text-[9px] text-[#63809B]">Turned into savings milestones</span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-[#FDF2F0] border border-[#F4CCC4] text-xs text-[#A84232] mb-4 font-semibold">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#DFEDF5] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#5B7B99] hover:bg-[#E8F2F8] transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleStartParsing}
            disabled={isParsing || !previewUrl}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#1E3A5F] hover:bg-[#2B527E] disabled:opacity-40 transition-all shadow-xs"
          >
            {isParsing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Reading vision board...</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#F5D899]" />
                <span>Create Daily Habits</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
