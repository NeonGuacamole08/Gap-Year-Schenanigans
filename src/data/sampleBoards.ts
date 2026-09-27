import { VisionBoardPayload } from '../types/serene';

export interface SampleBoard {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  payload: VisionBoardPayload;
}

export const SAMPLE_BOARDS: SampleBoard[] = [
  {
    id: 'mountain-study-goals',
    title: 'Mountain View Goals',
    subtitle: 'Daily habits for learning French, finishing scholarship essays, and saving for a hiking trip.',
    coverImage: '/src/assets/images/heavenly_mountain_summit_1790528027865.jpg',
    payload: {
      board_summary: {
        detected_themes: [
          'Language Learning',
          'Academic Goals',
          'Travel Savings',
          'Daily Wellness'
        ],
        overall_vision_statement: 'Practice languages every day, submit scholarship applications on time, save for outdoor trips, and keep a calm daily routine.',
        aesthetic_palette_notes: 'Mountain peaks, sky blue, warm morning sunlight, and cloud white.'
      },
      extracted_goals: [
        {
          goal_id: 'goal-french-study',
          ingested_element: 'Study book: "French Lessons" and notebook on desk',
          category: 'Language Learning',
          actionable_goal: 'Practice French for 25 minutes using audio or grammar exercises.',
          metric_type: 'habit_streak',
          suggested_frequency: 'daily',
          target_metric: {
            unit: 'minutes practiced',
            default_target: 25
          },
          motivational_nudge_template: '20 minutes of daily practice makes a big difference over time.',
          safety_flags: {
            contains_pii_risk: false,
            requires_disclaimer: false
          },
          unlocked: false,
          illumination_level: 0,
          streak_count: 0,
          last_check_in: 'Not started yet',
          tile_image_url: '/src/assets/images/alpine_journal_proof_1790528053411.jpg',
          accent_color: '#E5A952'
        },
        {
          goal_id: 'goal-scholarship-app',
          ingested_element: 'Milestone target: "Erasmus Scholarship & Research Grant application"',
          category: 'Academic Performance',
          actionable_goal: 'Write and review 2 sections of your scholarship application.',
          metric_type: 'milestone_checkpoint',
          suggested_frequency: 'weekly',
          target_metric: {
            unit: 'sections reviewed',
            default_target: 2
          },
          motivational_nudge_template: 'Set aside 30 minutes today to work on your essay draft.',
          safety_flags: {
            contains_pii_risk: true,
            requires_disclaimer: false
          },
          unlocked: false,
          illumination_level: 0,
          streak_count: 0,
          last_check_in: 'Not started yet',
          tile_image_url: '/src/assets/images/heavenly_mountain_summit_1790528027865.jpg',
          accent_color: '#7EAED1'
        },
        {
          goal_id: 'goal-travel-savings',
          ingested_element: 'Travel photo: Swiss Alps hiking trail and train ticket',
          category: 'Travel',
          actionable_goal: 'Save $400 this month toward your summer mountain trip.',
          metric_type: 'continuous_target',
          suggested_frequency: 'monthly',
          target_metric: {
            unit: 'dollars saved',
            default_target: 400
          },
          motivational_nudge_template: 'Every deposit gets you closer to your trip.',
          safety_flags: {
            contains_pii_risk: true,
            requires_disclaimer: true
          },
          unlocked: false,
          illumination_level: 0,
          streak_count: 0,
          last_check_in: 'Not started yet',
          tile_image_url: '/src/assets/images/heavenly_mountain_summit_1790528027865.jpg',
          accent_color: '#3B6B91'
        },
        {
          goal_id: 'goal-morning-walk',
          ingested_element: 'Routine note: "Daily morning walk outside in fresh air"',
          category: 'Wellness',
          actionable_goal: 'Take a 20-minute walk outside each morning.',
          metric_type: 'habit_streak',
          suggested_frequency: 'daily',
          target_metric: {
            unit: 'minutes outside',
            default_target: 20
          },
          motivational_nudge_template: 'A quick walk in the morning helps clear your head for the day.',
          safety_flags: {
            contains_pii_risk: false,
            requires_disclaimer: false
          },
          unlocked: false,
          illumination_level: 0,
          streak_count: 0,
          last_check_in: 'Not started yet',
          tile_image_url: '/src/assets/images/celestial_cloud_peaks_1790528040372.jpg',
          accent_color: '#E5A952'
        }
      ],
      verification_engine: {
        is_proof_analysis: false,
        proof_data: {
          matched_goal_id: '',
          is_valid: false,
          confidence_score: 0.0,
          soft_feedback_message: '',
          pii_redaction_required: false,
          manual_override_offered: false
        }
      }
    }
  },
  {
    id: 'health-and-focus',
    title: 'Health & Daily Focus',
    subtitle: 'Simple routines for regular workouts, weekly budgeting, and daily reading.',
    coverImage: '/src/assets/images/celestial_cloud_peaks_1790528040372.jpg',
    payload: {
      board_summary: {
        detected_themes: [
          'Fitness & Movement',
          'Financial Habits',
          'Daily Reading'
        ],
        overall_vision_statement: 'Stay active every day, check your budget once a week, and read before bed.',
        aesthetic_palette_notes: 'Clean mountain skies, morning clouds, and natural daylight.'
      },
      extracted_goals: [
        {
          goal_id: 'goal-daily-workout',
          ingested_element: 'Photo of running shoes and water bottle on trail',
          category: 'Wellness',
          actionable_goal: 'Do 30 minutes of running, walking, or stretching.',
          metric_type: 'habit_streak',
          suggested_frequency: 'daily',
          target_metric: {
            unit: 'minutes active',
            default_target: 30
          },
          motivational_nudge_template: 'Even a short workout counts. Keep the momentum going.',
          safety_flags: {
            contains_pii_risk: false,
            requires_disclaimer: true
          },
          unlocked: false,
          illumination_level: 0,
          streak_count: 0,
          last_check_in: 'Not started yet',
          tile_image_url: '/src/assets/images/celestial_cloud_peaks_1790528040372.jpg',
          accent_color: '#55828B'
        },
        {
          goal_id: 'goal-budget-review',
          ingested_element: 'Finance reminder: "Track weekly spending every Sunday"',
          category: 'Financial Abundance',
          actionable_goal: 'Check your bank accounts and log your weekly spending every Sunday.',
          metric_type: 'continuous_target',
          suggested_frequency: 'weekly',
          target_metric: {
            unit: 'weekly review',
            default_target: 1
          },
          motivational_nudge_template: 'Take 10 minutes on Sunday to see where your money went this week.',
          safety_flags: {
            contains_pii_risk: true,
            requires_disclaimer: true
          },
          unlocked: false,
          illumination_level: 0,
          streak_count: 0,
          last_check_in: 'Not started yet',
          tile_image_url: '/src/assets/images/alpine_journal_proof_1790528053411.jpg',
          accent_color: '#E5A952'
        },
        {
          goal_id: 'goal-nightly-reading',
          ingested_element: 'Book on nightstand: "Read 15 pages every evening"',
          category: 'Mindset',
          actionable_goal: 'Read 15 pages of a book before going to sleep.',
          metric_type: 'habit_streak',
          suggested_frequency: 'daily',
          target_metric: {
            unit: 'pages read',
            default_target: 15
          },
          motivational_nudge_template: 'Wind down tonight with 15 pages of reading.',
          safety_flags: {
            contains_pii_risk: false,
            requires_disclaimer: false
          },
          unlocked: false,
          illumination_level: 0,
          streak_count: 0,
          last_check_in: 'Not started yet',
          tile_image_url: '/src/assets/images/alpine_journal_proof_1790528053411.jpg',
          accent_color: '#7EAED1'
        }
      ],
      verification_engine: {
        is_proof_analysis: false,
        proof_data: {
          matched_goal_id: '',
          is_valid: false,
          confidence_score: 0.0,
          soft_feedback_message: '',
          pii_redaction_required: false,
          manual_override_offered: false
        }
      }
    }
  }
];
