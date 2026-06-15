import type { AppConfig } from '../types'
import config from '../config.json'
import i18n from '../i18n'

export const RESUME_VARIANTS: string[] = config.resumeVariants

export const getAppConfig = (): AppConfig => ({
  labels: {
    status: {
      active: i18n.t('status.active'),
      rejected: i18n.t('status.rejected'),
      withdrawn: i18n.t('status.withdrawn'),
      offer: i18n.t('status.offer'),
      accepted: i18n.t('status.accepted'),
    },
    rejectionStage: {
      application: i18n.t('rejectionStage.application'),
      phone_screen: i18n.t('rejectionStage.phone_screen'),
      technical: i18n.t('rejectionStage.technical'),
      interview: i18n.t('rejectionStage.interview'),
      final: i18n.t('rejectionStage.final'),
    },
    rejectionCategory: {
      no_feedback: i18n.t('rejectionCategory.no_feedback'),
      overqualified: i18n.t('rejectionCategory.overqualified'),
      underqualified: i18n.t('rejectionCategory.underqualified'),
      timezone: i18n.t('rejectionCategory.timezone'),
      compensation: i18n.t('rejectionCategory.compensation'),
      other: i18n.t('rejectionCategory.other'),
    },
    source: {
      linkedin: i18n.t('source.linkedin'),
      company_site: i18n.t('source.company_site'),
      referral: i18n.t('source.referral'),
      cold_outreach: i18n.t('source.cold_outreach'),
      recruiter: i18n.t('source.recruiter'),
      other: i18n.t('source.other'),
    },
    timelineStage: {
      applied: i18n.t('timelineStage.applied'),
      phone_screen: i18n.t('timelineStage.phone_screen'),
      technical_screen: i18n.t('timelineStage.technical_screen'),
      interview_1: i18n.t('timelineStage.interview_1'),
      interview_2: i18n.t('timelineStage.interview_2'),
      interview_3: i18n.t('timelineStage.interview_3'),
      final_round: i18n.t('timelineStage.final_round'),
      offer: i18n.t('timelineStage.offer'),
      rejected: i18n.t('timelineStage.rejected'),
      withdrawn: i18n.t('timelineStage.withdrawn'),
    },
  },
  colors: {
    status: {
      active: '#1a7f5a',
      rejected: '#c0392b',
      withdrawn: '#888',
      offer: '#b7600a',
      accepted: '#1a5fa8',
    },
    statusBg: {
      active: '#e6f5ee',
      rejected: '#fceaea',
      withdrawn: '#f1efea',
      offer: '#faeeda',
      accepted: '#e6f1fb',
    },
  },
  order: {
    timelineStage: [
      'applied',
      'phone_screen',
      'technical_screen',
      'interview_1',
      'interview_2',
      'interview_3',
      'final_round',
      'offer',
      'rejected',
      'withdrawn',
    ],
  },
})

/**
 * Global application configuration.
 * Using a getter to ensure translations are reactive.
 */
export const getAppConfigValue = () => getAppConfig()

