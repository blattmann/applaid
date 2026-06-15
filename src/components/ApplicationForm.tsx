import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Application, ApplicationStatus, ApplicationSource, RejectionStage, RejectionCategory } from '../types'
import { getAppConfigValue, RESUME_VARIANTS } from '../lib/constants'
import styles from './ApplicationForm.module.css'

interface Props {
  initial?: Partial<Application>
  onSave: (data: Partial<Application>) => Promise<void>
  onClose: () => void
  title?: string
}

const today = () => new Date().toISOString().slice(0, 10)

export function ApplicationForm({ initial, onSave, onClose, title }: Props) {
  const { t } = useTranslation()
  const APP_CONFIG = useMemo(() => getAppConfigValue(), [t])

  const [company, setCompany] = useState(initial?.company ?? '')
  const [roleTitle, setRoleTitle] = useState(initial?.role_title ?? '')
  const [roleUrl, setRoleUrl] = useState(initial?.role_url ?? '')
  const [source, setSource] = useState<ApplicationSource | ''>(initial?.source ?? '')
  const [resumeVariant, setResumeVariant] = useState(initial?.resume_variant ?? '')
  const [status, setStatus] = useState<ApplicationStatus>(initial?.status ?? 'active')
  const [appliedAt, setAppliedAt] = useState(initial?.applied_at ?? today())
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [salaryMin, setSalaryMin] = useState(initial?.salary_min?.toString() ?? '')
  const [salaryMax, setSalaryMax] = useState(initial?.salary_max?.toString() ?? '')
  const [salaryCurrency, setSalaryCurrency] = useState(initial?.salary_currency ?? 'USD')

  // Rejection fields
  const [rejectedAt, setRejectedAt] = useState(initial?.rejected_at ?? '')
  const [rejectionStage, setRejectionStage] = useState<RejectionStage | ''>(initial?.rejection_stage ?? '')
  const [rejectionCategory, setRejectionCategory] = useState<RejectionCategory | ''>(initial?.rejection_category ?? '')
  const [rejectionReason, setRejectionReason] = useState(initial?.rejection_reason ?? '')

  // Offer fields
  const [offerDate, setOfferDate] = useState(initial?.offer_date ?? '')
  const [offerAmount, setOfferAmount] = useState(initial?.offer_amount ?? '')
  const [offerNotes, setOfferNotes] = useState(initial?.offer_notes ?? '')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-extract company name from URL if company is blank
  useEffect(() => {
    if (roleUrl && !company) {
      try {
        const host = new URL(roleUrl).hostname.replace('www.', '')
        const parts = host.split('.')
        if (parts.length >= 2) {
          const name = parts[parts.length - 2]
          setCompany(name.charAt(0).toUpperCase() + name.slice(1))
        }
      } catch { /* invalid url */ }
    }
  }, [roleUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company.trim() || !roleTitle.trim()) { setError('Company and role title are required.'); return }
    setSaving(true)
    setError(null)
    await onSave({
      company: company.trim(),
      role_title: roleTitle.trim(),
      role_url: roleUrl.trim() || null,
      source: (source as ApplicationSource) || null,
      resume_variant: resumeVariant || null,
      status,
      applied_at: appliedAt || null,
      notes: notes.trim() || null,
      salary_min: salaryMin ? parseInt(salaryMin) : null,
      salary_max: salaryMax ? parseInt(salaryMax) : null,
      salary_currency: salaryCurrency,
      rejected_at: rejectedAt || null,
      rejection_stage: (rejectionStage as RejectionStage) || null,
      rejection_category: (rejectionCategory as RejectionCategory) || null,
      rejection_reason: rejectionReason.trim() || null,
      offer_date: offerDate || null,
      offer_amount: offerAmount.trim() || null,
      offer_notes: offerNotes.trim() || null,
    })
    setSaving(false)
  }

  const modalTitle = title || (initial ? t('ui.editApplication') : t('ui.addApplication'))

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{modalTitle}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <p className={styles.sectionLabel}>{t('sections.role')}</p>
            <div className={styles.grid2}>
              <Field label={`${t('fields.company')} *`}>
                <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" required />
              </Field>
              <Field label={`${t('fields.roleTitle')} *`}>
                <input value={roleTitle} onChange={e => setRoleTitle(e.target.value)} placeholder="VP of Engineering" required />
              </Field>
            </div>
            <Field label={t('fields.roleUrl')}>
              <input value={roleUrl} onChange={e => setRoleUrl(e.target.value)} placeholder="https://..." type="url" />
            </Field>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionLabel}>{t('sections.application')}</p>
            <div className={styles.grid3}>
              <Field label={t('fields.appliedDate')}>
                <input type="date" value={appliedAt} onChange={e => setAppliedAt(e.target.value)} />
              </Field>
              <Field label={t('fields.source')}>
                <select value={source} onChange={e => setSource(e.target.value as ApplicationSource)}>
                  <option value="">—</option>
                  {Object.entries(APP_CONFIG.labels.source).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
              <Field label={t('fields.resumeVariant')}>
                <input
                  list="resume-variants"
                  value={resumeVariant}
                  onChange={e => setResumeVariant(e.target.value)}
                  placeholder="e.g. Staff Frontend"
                />
                <datalist id="resume-variants">
                  {RESUME_VARIANTS.map(v => <option key={v} value={v} />)}
                </datalist>
              </Field>
            </div>
            <div className={styles.grid3}>
              <Field label={t('fields.salaryMin')}>
                <input value={salaryMin} onChange={e => setSalaryMin(e.target.value)} placeholder="150000" type="number" />
              </Field>
              <Field label={t('fields.salaryMax')}>
                <input value={salaryMax} onChange={e => setSalaryMax(e.target.value)} placeholder="200000" type="number" />
              </Field>
              <Field label={t('fields.currency')}>
                <select value={salaryCurrency} onChange={e => setSalaryCurrency(e.target.value)}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
              </Field>
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionLabel}>{t('sections.status')}</p>
            <Field label={t('fields.status')}>
              <select value={status} onChange={e => setStatus(e.target.value as ApplicationStatus)}>
                {Object.entries(APP_CONFIG.labels.status).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
          </div>

          {(status === 'rejected') && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>{t('sections.rejection')}</p>
              <div className={styles.grid2}>
                <Field label={t('fields.rejectedDate')}>
                  <input type="date" value={rejectedAt} onChange={e => setRejectedAt(e.target.value)} />
                </Field>
                <Field label={t('fields.rejectionStage')}>
                  <select value={rejectionStage} onChange={e => setRejectionStage(e.target.value as RejectionStage)}>
                    <option value="">—</option>
                    {Object.entries(APP_CONFIG.labels.rejectionStage).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </Field>
              </div>
              <Field label={t('fields.rejectionCategory')}>
                <select value={rejectionCategory} onChange={e => setRejectionCategory(e.target.value as RejectionCategory)}>
                  <option value="">—</option>
                  {Object.entries(APP_CONFIG.labels.rejectionCategory).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
              <Field label={t('fields.rejectionReason')}>
                <textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder={t('ui.pasteRejection')} />
              </Field>
            </div>
          )}

          {(status === 'offer' || status === 'accepted') && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>{t('sections.offer')}</p>
              <div className={styles.grid2}>
                <Field label={t('fields.offerDate')}>
                  <input type="date" value={offerDate} onChange={e => setOfferDate(e.target.value)} />
                </Field>
                <Field label={t('fields.offerAmount')}>
                  <input value={offerAmount} onChange={e => setOfferAmount(e.target.value)} placeholder="180,000 + equity" />
                </Field>
              </div>
              <Field label={t('fields.offerNotes')}>
                <textarea value={offerNotes} onChange={e => setOfferNotes(e.target.value)} placeholder="Equity, benefits, start date..." />
              </Field>
            </div>
          )}

          <div className={styles.section}>
            <p className={styles.sectionLabel}>{t('ui.generalNotes')}</p>
            <Field label={t('fields.notes')}>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t('ui.anyRelevant')} />
            </Field>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>{t('ui.cancel')}</button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>{saving ? t('ui.saving') : t('ui.save')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}
