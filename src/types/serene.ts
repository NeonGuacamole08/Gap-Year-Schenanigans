/**
 * Serene — Types matching the required JSON schema & client state
 */

export type GoalCategory =
  | 'Language Learning'
  | 'Academic Performance'
  | 'Higher Ed'
  | 'Travel'
  | 'Financial Abundance'
  | 'Wellness'
  | 'Mindset';

export type MetricType =
  | 'habit_streak'
  | 'milestone_checkpoint'
  | 'continuous_target';

export type SuggestedFrequency = 'daily' | 'weekly' | 'monthly' | 'one_time';

export interface TargetMetric {
  unit: string;
  default_target: string | number;
}

export interface SafetyFlags {
  contains_pii_risk: boolean;
  requires_disclaimer: boolean;
}

export interface ProofEntry {
  id: string;
  goal_id: string;
  timestamp: string;
  image_url?: string;
  confidence_score: number;
  soft_feedback_message: string;
  pii_redaction_applied: boolean;
  notes?: string;
  manual_override: boolean;
}

export interface ExtractedGoal {
  goal_id: string;
  ingested_element: string;
  category: GoalCategory;
  actionable_goal: string;
  metric_type: MetricType;
  suggested_frequency: SuggestedFrequency;
  target_metric: TargetMetric;
  motivational_nudge_template: string;
  safety_flags: SafetyFlags;
  // Dynamic state for interactive board
  unlocked?: boolean;
  illumination_level?: number; // 0 to 100
  streak_count?: number;
  last_check_in?: string;
  proof_history?: ProofEntry[];
  soft_pauses_taken?: number;
  tile_image_url?: string;
  accent_color?: string;
}

export interface BoardSummary {
  detected_themes: string[];
  overall_vision_statement: string;
  aesthetic_palette_notes: string;
}

export interface ProofData {
  matched_goal_id: string;
  is_valid: boolean;
  confidence_score: number;
  soft_feedback_message: string;
  pii_redaction_required: boolean;
  manual_override_offered: boolean;
  detected_pii_types?: string[];
  visual_observation?: string;
}

export interface VerificationEngine {
  is_proof_analysis: boolean;
  proof_data: ProofData;
}

export interface VisionBoardPayload {
  board_summary: BoardSummary;
  extracted_goals: ExtractedGoal[];
  verification_engine: VerificationEngine;
}
