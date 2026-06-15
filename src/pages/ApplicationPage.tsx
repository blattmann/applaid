import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApplications } from '../hooks/useApplications'
import { ApplicationForm } from '../components/ApplicationForm'
import { getAppConfigValue } from '../lib/constants'
import type { Application, TimelineStage } from '../types'
import { format, parseISO } from 'date-fns'
import styles from './ApplicationPage.module.css'

export function ApplicationPage() {
  const { t } = useTranslation()
  const APP_CONFIG = useMemo(() => getAppConfigValue(), [t])
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { applications, updateApplication, deleteApplication, addTimelineEvent, deleteTimelineEvent } = useApplications()

  const app = applications.find(a => a.id === id)

  const [showEdit, setShowEdit] = useState(false)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEventStage, setNewEventStage] = useState<TimelineStage>('phone_screen')
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().slice(0, 10))
  const [newEventNotes, setNewEventNotes] = useState('')
  const [savingEvent, setSavingEvent] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!app) return <div className={styles.empty}>{t('ui.applicationNotFound')} <button onClick={() => navigate('/')}>{t('ui.back')}</button></div>

  const fmtDate = (d: string | null | undefined) => {
    if (!d) return '—'
    try { return format(parseISO(d), 'MMM d, yyyy') } catch { return d }
  }

  const handleUpdate = async (data: Partial<Application>) => {
    await updateApplication(app.id, data)
    setShowEdit(false)
  }

  const handleDelete = async () => {
    await deleteApplication(app.id)
    navigate('/')
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingEvent(true)
    await addTimelineEvent(app.id, {
      application_id: app.id,
      stage: newEventStage,
      event_date: newEventDate || null,
      notes: newEventNotes.trim() || null,
    })
    setSavingEvent(false)
    setShowAddEvent(false)
    setNewEventNotes('')
  }

  const timeline = [...(app.timeline_events ?? [])].sort((a, b) => {
    const ai = APP_CONFIG.order.timelineStage.indexOf(a.stage as TimelineStage)
    const bi = APP_CONFIG.order.timelineStage.indexOf(b.stage as TimelineStage)
    return ai - bi
  })

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <button className={styles.back} onClick={() => navigate('/')}>{t('ui.backToAll')}</button>
        <div className={styles.topActions}>
          <button className={styles.editBtn} onClick={() => setShowEdit(true)}>{t('ui.editApplication')}</button>
          {!confirmDelete
            ? <button className={styles.deleteBtn} onClick={() => setConfirmDelete(true)}>{t('ui.delete')}</button>
            : <>
                <span className={styles.confirmText}>{t('ui.sure')}</span>
                <button className={styles.deleteConfirm} onClick={handleDelete}>{t('ui.confirmDelete')}</button>
                <button className={styles.cancelDelete} onClick={() => setConfirmDelete(false)}>{t('ui.cancelDelete')}</button>
              </>
          }
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainCol}>
          {/* Header */}
          <div className={styles.appHeader}>
            <div className={styles.appHeaderTop}>
              <h1 className={styles.company}>{app.company}</h1>
              <span
                className={styles.statusBadge}
                style={{ color: APP_CONFIG.colors.status[app.status], background: APP_CONFIG.colors.statusBg[app.status] }}
              >{APP_CONFIG.labels.status[app.status]}</span>
            </div>
            <p className={styles.roleTitle}>{app.role_title}</p>
            {app.role_url && (
              <a href={app.role_url} target="_blank" rel="noreferrer" className={styles.roleUrl}>
                {app.role_url.replace(/^https?:\/\//, '').slice(0, 80)} ↗
              </a>
            )}
          </div>

          {/* Meta grid */}
          <div className={styles.metaGrid}>
            <MetaItem label={t('fields.applied')} value={fmtDate(app.applied_at)} />
            <MetaItem label={t('fields.source')} value={app.source ? APP_CONFIG.labels.source[app.source] : '—'} />
            <MetaItem label={t('fields.resumeVariant')} value={app.resume_variant ?? '—'} />
            <MetaItem label={t('fields.salaryRange')} value={
              app.salary_min || app.salary_max
                ? `${app.salary_min ? app.salary_min.toLocaleString() : '?'} – ${app.salary_max ? app.salary_max.toLocaleString() : '?'} ${app.salary_currency}`
                : '—'
            } />
            <MetaItem label={t('fields.lastUpdated')} value={fmtDate(app.updated_at?.slice(0, 10))} />
          </div>

          {/* Rejection block */}
          {app.status === 'rejected' && (
            <div className={styles.rejectionBlock}>
              <p className={styles.blockLabel}>{t('ui.rejectionDetails')}</p>
              <div className={styles.metaGrid}>
                <MetaItem label={t('fields.rejectedDate')} value={fmtDate(app.rejected_at)} />
                <MetaItem label={t('fields.stage')} value={app.rejection_stage ? APP_CONFIG.labels.rejectionStage[app.rejection_stage] : '—'} />
                <MetaItem label={t('fields.category')} value={app.rejection_category ? APP_CONFIG.labels.rejectionCategory[app.rejection_category] : '—'} />
              </div>
              {app.rejection_reason && (
                <div className={styles.rejectionNote}>
                  <p className={styles.rejectionNoteLabel}>{t('ui.rejectionNotes')}</p>
                  <p className={styles.rejectionNoteText}>{app.rejection_reason}</p>
                </div>
              )}
            </div>
          )}

          {/* Offer block */}
          {(app.status === 'offer' || app.status === 'accepted') && (
            <div className={styles.offerBlock}>
              <p className={styles.blockLabel}>{t('ui.offerDetails')}</p>
              <div className={styles.metaGrid}>
                <MetaItem label={t('fields.offerDate')} value={fmtDate(app.offer_date)} />
                <MetaItem label={t('fields.offerAmount')} value={app.offer_amount ?? '—'} />
              </div>
              {app.offer_notes && <p className={styles.noteText}>{app.offer_notes}</p>}
            </div>
          )}

          {/* Notes */}
          {app.notes && (
            <div className={styles.notesBlock}>
              <p className={styles.blockLabel}>{t('ui.generalNotes')}</p>
              <p className={styles.noteText}>{app.notes}</p>
            </div>
          )}
        </div>

        {/* Timeline col */}
        <div className={styles.timelineCol}>
          <div className={styles.timelineHeader}>
            <p className={styles.blockLabel}>{t('ui.timeline')}</p>
            <button className={styles.addEventBtn} onClick={() => setShowAddEvent(!showAddEvent)}>
              {showAddEvent ? t('ui.cancel') : t('ui.addStage')}
            </button>
          </div>

          {showAddEvent && (
            <form onSubmit={handleAddEvent} className={styles.addEventForm}>
              <div className={styles.eventFormRow}>
                <label className={styles.eventFormLabel}>{t('fields.stage')}</label>
                <select value={newEventStage} onChange={e => setNewEventStage(e.target.value as TimelineStage)}>
                  {APP_CONFIG.order.timelineStage.slice(1).map(s => (
                    <option key={s} value={s}>{APP_CONFIG.labels.timelineStage[s]}</option>
                  ))}
                </select>
              </div>
              <div className={styles.eventFormRow}>
                <label className={styles.eventFormLabel}>{t('fields.date')}</label>
                <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} />
              </div>
              <div className={styles.eventFormRow}>
                <label className={styles.eventFormLabel}>{t('fields.notes')}</label>
                <textarea
                  value={newEventNotes}
                  onChange={e => setNewEventNotes(e.target.value)}
                  placeholder={t('ui.whatHappened')}
                />
              </div>
              <button type="submit" className={styles.saveEventBtn} disabled={savingEvent}>
                {savingEvent ? t('ui.saving') : t('ui.addToTimeline')}
              </button>
            </form>
          )}

          <div className={styles.timeline}>
            {timeline.length === 0 && <p className={styles.timelineEmpty}>{t('ui.noResults')}</p>}
            {timeline.map((event, i) => (
              <div key={event.id} className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                {i < timeline.length - 1 && <div className={styles.timelineLine} />}
                <div className={styles.timelineContent}>
                  <div className={styles.timelineTop}>
                    <span className={styles.timelineStage}>{APP_CONFIG.labels.timelineStage[event.stage as TimelineStage] ?? event.stage}</span>
                    <span className={styles.timelineDate}>{fmtDate(event.event_date)}</span>
                    <button
                      className={styles.deleteEventBtn}
                      onClick={() => deleteTimelineEvent(event.id)}
                      aria-label="Remove event"
                      title="Remove"
                    >✕</button>
                  </div>
                  {event.notes && <p className={styles.timelineNotes}>{event.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showEdit && (
        <ApplicationForm
          initial={app}
          onSave={handleUpdate}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.metaItem}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={styles.metaValue}>{value}</span>
    </div>
  )
}
