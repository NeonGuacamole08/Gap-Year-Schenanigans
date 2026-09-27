import React, { useState } from 'react';
import { X, Copy, Check, ShieldCheck } from 'lucide-react';
import { VisionBoardPayload } from '../types/serene';

interface JsonPayloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: VisionBoardPayload;
}

export const JsonPayloadModal: React.FC<JsonPayloadModalProps> = ({
  isOpen,
  onClose,
  payload,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'full' | 'summary' | 'goals' | 'verification'>('full');

  if (!isOpen) return null;

  const jsonString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSubPayload = () => {
    if (activeTab === 'summary') return JSON.stringify(payload.board_summary, null, 2);
    if (activeTab === 'goals') return JSON.stringify(payload.extracted_goals, null, 2);
    if (activeTab === 'verification') return JSON.stringify(payload.verification_engine, null, 2);
    return jsonString;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2742]/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white border border-[#BFDBEE] shadow-xl p-5 sm:p-7 max-h-[90vh] flex flex-col justify-between">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#5B7B99] hover:text-[#1E3A5F] hover:bg-[#E8F2F8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C5E8A] px-2.5 py-0.5 rounded-full bg-[#EAF2F8] border border-[#CFE2EE]">
                Structured Data
              </span>
              <span className="text-[10px] text-[#2F613E] font-semibold bg-[#EEF6F1] border border-[#CFE4D7] px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#3DA35B]" />
                Valid JSON
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#132E4A]">
              Structured JSON Data
            </h2>
            <p className="text-xs text-[#52728F] mt-0.5">
              The structured data parsed from your vision board and verification checks.
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-2 mb-3 border-b border-[#D7E7F2] pb-2 text-xs">
            <button
              onClick={() => setActiveTab('full')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                activeTab === 'full'
                  ? 'bg-[#1E3A5F] text-white shadow-2xs'
                  : 'text-[#4A6B88] hover:bg-[#E8F2F8]'
              }`}
            >
              Full JSON
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                activeTab === 'summary'
                  ? 'bg-[#1E3A5F] text-white shadow-2xs'
                  : 'text-[#4A6B88] hover:bg-[#E8F2F8]'
              }`}
            >
              Summary ({payload.board_summary.detected_themes.length})
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                activeTab === 'goals'
                  ? 'bg-[#1E3A5F] text-white shadow-2xs'
                  : 'text-[#4A6B88] hover:bg-[#E8F2F8]'
              }`}
            >
              Goals ({payload.extracted_goals.length})
            </button>
            <button
              onClick={() => setActiveTab('verification')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                activeTab === 'verification'
                  ? 'bg-[#1E3A5F] text-white shadow-2xs'
                  : 'text-[#4A6B88] hover:bg-[#E8F2F8]'
              }`}
            >
              Verification Engine
            </button>
          </div>

          {/* Code display */}
          <div className="relative flex-1 min-h-[300px] rounded-xl bg-[#0D2238] border border-[#23456B] p-4 font-mono text-xs overflow-auto text-[#D6EAF8]">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#1B3654] hover:bg-[#284C74] text-white transition-colors flex items-center gap-1.5 text-[11px] font-medium"
              title="Copy JSON"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#73D890]" />
                  <span className="text-[#73D890]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <pre className="whitespace-pre overflow-x-auto text-[11px] leading-relaxed">
              {getSubPayload()}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#DFEDF5] mt-3 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#1E3A5F] hover:bg-[#2A4F7C] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
