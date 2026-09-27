import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Mountain, Sun } from 'lucide-react';
import { ExtractedGoal, GoalCategory, SuggestedFrequency } from '../types/serene';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: ExtractedGoal | null;
  onSaveGoal: (goal: ExtractedGoal) => void;
  onDeleteGoal?: (goalId: string) => void;
}

const CATEGORIES: GoalCategory[] = [
  'Language Learning',
  'Academic Performance',
  'Higher Ed',
  'Travel',
  'Financial Abundance',
  'Wellness',
  'Mindset',
];

const FREQUENCIES: SuggestedFrequency[] = ['daily', 'weekly', 'monthly', 'one_time'];

const DEFAULT_IMAGES = [
  '/src/assets/images/heavenly_mountain_summit_1790528027865.jpg',
  '/src/assets/images/celestial_cloud_peaks_1790528040372.jpg',
  '/src/assets/images/alpine_journal_proof_1790528053411.jpg',
];

export const EditGoalModal: React.FC<EditGoalModalProps> = ({
  isOpen,
  onClose,
  goalToEdit,
  onSaveGoal,
  onDeleteGoal,
}) => {
  const isEditing = Boolean(goalToEdit);

  const [actionableGoal, setActionableGoal] = useState<string>('');
  const [category, setCategory] = useState<GoalCategory>('Wellness');
  const [frequency, setFrequency] = useState<SuggestedFrequency>('daily');
  const [targetNumber, setTargetNumber] = useState<string>('20');
  const [targetUnit, setTargetUnit] = useState<string>('minutes');
  const [ingestedElement, setIngestedElement] = useState<string>('');
  const [nudge, setNudge] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_IMAGES[0]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (goalToEdit) {
      setActionableGoal(goalToEdit.actionable_goal || '');
      setCategory(goalToEdit.category || 'Wellness');
      setFrequency(goalToEdit.suggested_frequency || 'daily');
      setTargetNumber(String(goalToEdit.target_metric?.default_target ?? '20'));
      setTargetUnit(goalToEdit.target_metric?.unit || 'minutes');
      setIngestedElement(goalToEdit.ingested_element || '');
      setNudge(goalToEdit.motivational_nudge_template || '');
      setSelectedImage(goalToEdit.tile_image_url || DEFAULT_IMAGES[0]);
    } else {
      // Default blank values for adding a new goal
      setActionableGoal('');
      setCategory('Wellness');
      setFrequency('daily');
      setTargetNumber('20');
      setTargetUnit('minutes');
      setIngestedElement('Added by user');
      setNudge('Keep up the good work today.');
      setSelectedImage(DEFAULT_IMAGES[0]);
    }
    setErrorMsg('');
  }, [goalToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionableGoal.trim()) {
      setErrorMsg('Please write a goal or habit name.');
      return;
    }

    const updatedGoal: ExtractedGoal = {
      goal_id: goalToEdit?.goal_id || `goal-custom-${Date.now()}`,
      ingested_element: ingestedElement || 'Custom goal',
      category,
      actionable_goal: actionableGoal.trim(),
      metric_type: frequency === 'daily' ? 'habit_streak' : frequency === 'weekly' ? 'milestone_checkpoint' : 'continuous_target',
      suggested_frequency: frequency,
      target_metric: {
        unit: targetUnit.trim() || 'minutes',
        default_target: isNaN(Number(targetNumber)) ? targetNumber : Number(targetNumber),
      },
      motivational_nudge_template: nudge.trim() || 'A little daily progress goes a long way.',
      safety_flags: {
        contains_pii_risk: category === 'Travel' || category === 'Financial Abundance',
        requires_disclaimer: category === 'Financial Abundance' || category === 'Wellness',
      },
      // Starts from zero if new, or preserves current progress if editing
      unlocked: goalToEdit ? goalToEdit.unlocked : false,
      illumination_level: goalToEdit?.illumination_level ?? 0,
      streak_count: goalToEdit?.streak_count ?? 0,
      last_check_in: goalToEdit?.last_check_in || 'Not started yet',
      tile_image_url: selectedImage,
    };

    onSaveGoal(updatedGoal);
    onClose();
  };

  const handleDelete = () => {
    if (goalToEdit && onDeleteGoal) {
      if (confirm('Are you sure you want to delete this goal?')) {
        onDeleteGoal(goalToEdit.goal_id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2742]/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white border border-[#BFDBEE] shadow-xl p-5 sm:p-7 max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#5B7B99] hover:text-[#1E3A5F] hover:bg-[#E8F2F8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          {/* Header */}
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2C5E8A] px-2.5 py-0.5 rounded-full bg-[#E8F2F8] border border-[#BFDBEE] inline-flex items-center gap-1.5">
              {isEditing ? <Edit2 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {isEditing ? 'Edit Goal' : 'Add Missing Goal'}
            </span>
            <h2 className="text-xl font-bold text-[#132E4A] mt-2 mb-0.5">
              {isEditing ? 'Edit This Goal' : 'Add a Goal the AI Missed'}
            </h2>
            <p className="text-xs text-[#52728F]">
              {isEditing
                ? 'Update your daily habit details, target, or photo.'
                : 'If something from your vision board wasn’t detected, you can add it right here.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Actionable Goal */}
            <div>
              <label className="block text-xs font-semibold text-[#132E4A] mb-1">
                Goal or Habit Name *
              </label>
              <input
                type="text"
                value={actionableGoal}
                onChange={(e) => setActionableGoal(e.target.value)}
                placeholder="e.g. Practice Spanish for 20 mins, Daily morning run, Save $300"
                className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-white border border-[#CFE2EE] focus:border-[#7EAED1] outline-none text-[#132E4A] placeholder:text-[#8AA4B8]"
              />
            </div>

            {/* Category & Frequency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#132E4A] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GoalCategory)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#CFE2EE] focus:border-[#7EAED1] outline-none text-[#132E4A]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#132E4A] mb-1">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as SuggestedFrequency)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#CFE2EE] focus:border-[#7EAED1] outline-none text-[#132E4A]"
                >
                  {FREQUENCIES.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Metric */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#132E4A] mb-1">
                  Target Amount
                </label>
                <input
                  type="text"
                  value={targetNumber}
                  onChange={(e) => setTargetNumber(e.target.value)}
                  placeholder="e.g. 20, 1, 300"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#CFE2EE] focus:border-[#7EAED1] outline-none text-[#132E4A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#132E4A] mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value)}
                  placeholder="e.g. minutes, pages, sessions, dollars"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#CFE2EE] focus:border-[#7EAED1] outline-none text-[#132E4A]"
                />
              </div>
            </div>

            {/* Original element note */}
            <div>
              <label className="block text-xs font-semibold text-[#132E4A] mb-1">
                Where is this on your board? (Optional)
              </label>
              <input
                type="text"
                value={ingestedElement}
                onChange={(e) => setIngestedElement(e.target.value)}
                placeholder="e.g. Top right quote: 'Never stop learning', Language notebook photo"
                className="w-full text-xs px-3.5 py-2 rounded-xl bg-white border border-[#CFE2EE] focus:border-[#7EAED1] outline-none text-[#132E4A] placeholder:text-[#8AA4B8]"
              />
            </div>

            {/* Motivational nudge */}
            <div>
              <label className="block text-xs font-semibold text-[#132E4A] mb-1">
                Short Motivation Reminder (Optional)
              </label>
              <input
                type="text"
                value={nudge}
                onChange={(e) => setNudge(e.target.value)}
                placeholder="e.g. 15 minutes today keeps your momentum going."
                className="w-full text-xs px-3.5 py-2 rounded-xl bg-white border border-[#CFE2EE] focus:border-[#7EAED1] outline-none text-[#132E4A] placeholder:text-[#8AA4B8]"
              />
            </div>

            {/* Choose Card Photo */}
            <div>
              <label className="block text-xs font-semibold text-[#132E4A] mb-1.5">
                Choose Card Background Photo
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DEFAULT_IMAGES.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative rounded-lg overflow-hidden border-2 h-16 transition-all ${
                      selectedImage === imgUrl
                        ? 'border-[#E5A952] ring-2 ring-[#E5A952]/30'
                        : 'border-[#CFE2EE] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-[#FDF2F0] border border-[#F4CCC4] text-xs text-[#A84232]">
                {errorMsg}
              </div>
            )}

            {/* Buttons */}
            <div className="pt-3 border-t border-[#DFEDF5] flex items-center justify-between gap-2.5">
              <div>
                {isEditing && onDeleteGoal && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#C0392B] hover:bg-[#FDF2F0] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#5B7B99] hover:bg-[#E8F2F8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#1E3A5F] hover:bg-[#2A4F7C] transition-colors shadow-xs"
                >
                  <Sun className="w-3.5 h-3.5 text-[#F5D899]" />
                  <span>{isEditing ? 'Save Changes' : 'Add Goal'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
