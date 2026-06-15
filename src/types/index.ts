export type ApplicationStatus = 'active' | 'rejected' | 'withdrawn' | 'offer' | 'accepted'

export type RejectionStage =
  | 'application'
  | 'phone_screen'
  | 'technical'
  | 'interview'
  | 'final'

export type RejectionCategory =
  | 'no_feedback'
  | 'overqualified'
  | 'underqualified'
  | 'timezone'
  | 'compensation'
  | 'other'

export type ApplicationSource =
  | 'linkedin'
  | 'company_site'
  | 'referral'
  | 'cold_outreach'
  | 'recruiter'
  | 'other'

export type TimelineStage =
  | 'applied'
  | 'phone_screen'
  | 'technical_screen'
  | 'interview_1'
  | 'interview_2'
  | 'interview_3'
  | 'final_round'
  | 'offer'
  | 'rejected'
  | 'withdrawn'

export interface TimelineEvent {
  id: string
  application_id: string
  user_id: string
  stage: TimelineStage
  event_date: string | null
  notes: string | null
  created_at: string
}

export interface Application {
  id: string
  user_id: string
  company: string
  role_title: string
  role_url: string | null
  source: ApplicationSource | null
  resume_variant: string | null
  status: ApplicationStatus
  applied_at: string | null
  created_at: string
  updated_at: string
  rejected_at: string | null
  rejection_stage: RejectionStage | null
  rejection_reason: string | null
  rejection_category: RejectionCategory | null
  offer_date: string | null
  offer_amount: string | null
  offer_notes: string | null
  notes: string | null
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  timeline_events?: TimelineEvent[]
}

export interface ApplicationInsert extends Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'timeline_events'> {}

export interface AppConfig {
  labels: {
    status: Record<ApplicationStatus, string>
    rejectionStage: Record<RejectionStage, string>
    rejectionCategory: Record<RejectionCategory, string>
    source: Record<ApplicationSource, string>
    timelineStage: Record<TimelineStage, string>
  }
  colors: {
    status: Record<ApplicationStatus, string>
    statusBg: Record<ApplicationStatus, string>
  }
  order: {
    timelineStage: TimelineStage[]
  }
}
