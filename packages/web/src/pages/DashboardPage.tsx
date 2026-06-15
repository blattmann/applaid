import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@applaid/core'
import { useApplications } from '@applaid/core'
import { ApplicationForm } from '../components/ApplicationForm'
import { getAppConfigValue } from '@applaid/core'
import type { ApplicationStatus, Application, ApplicationInsert } from '@applaid/core'
import { format, parseISO } from 'date-fns'
import styles from './DashboardPage.module.css'

const ALL = '__all__'

export function DashboardPage() {
  const { t } = useTranslation()
  const APP_CONFIG = useMemo(() => getAppConfigValue(), [t])
  const { user, signOut } = useAuth()
  const { applications, loading, createApplication } = useApplications()
  const navigate = useNavigate()

  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>(ALL)
  const [search, setSearch] = useState('')

  const stats = useMemo(() => {
    const total = applications.length
    const active = applications.filter(a => a.status === 'active').length
    const rejected = applications.filter(a => a.status === 'rejected').length
    const offers = applications.filter(a => a.status === 'offer' || a.status === 'accepted').length
    const stageBreakdown: Record<string, number> = {}
    applications.filter(a => a.status === 'rejected' && a.rejection_stage).forEach(a => {
      const s = a.rejection_stage!
      stageBreakdown[s] = (stageBreakdown[s] ?? 0) + 1
    })
    return { total, active, rejected, offers, stageBreakdown }
  }, [applications])

  const filtered = useMemo(() => {
    let res = applications
    if (filterStatus !== ALL) res = res.filter(a => a.status === filterStatus)
    if (search.trim()) {
      const q = search.toLowerCase()
      res = res.filter(a => a.company.toLowerCase().includes(q) || a.role_title.toLowerCase().includes(q))
    }
    return res
  }, [applications, filterStatus, search])

  const handleCreate = async (data: Partial<Application>) => {
    await createApplication(data as ApplicationInsert)
    setShowForm(false)
  }

  const fmtDate = (d: string | null) => {
    if (!d) return '—'
    try { return format(parseISO(d), 'MMM d, yyyy') } catch { return d }
  }


  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.logo}>{t('login.title')}</h1>
          <span className={styles.userBadge}>{user?.email}</span>
        </div>
        <button className={styles.signOutBtn} onClick={signOut}>{t('ui.signOut')}</button>
      </header>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <StatCard label={t('dashboard.total')} value={stats.total} />
        <StatCard label={t('dashboard.active')} value={stats.active} color="var(--green)" />
        <StatCard label={t('dashboard.rejected')} value={stats.rejected} color="var(--red)" />
        <StatCard label={t('dashboard.offers')} value={stats.offers} color="var(--accent)" />
        {Object.entries(stats.stageBreakdown).length > 0 && (
          <div className={styles.stageBreakdown}>
            {Object.entries(stats.stageBreakdown).map(([stage, count]) => (
              <span key={stage} className={styles.stageChip}>
                {APP_CONFIG.labels.rejectionStage[stage as keyof typeof APP_CONFIG.labels.rejectionStage]?.split(' ')[0]}: {count}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <input
            className={styles.search}
            placeholder={t('ui.searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className={styles.filters}>
            <button
              className={filterStatus === ALL ? styles.filterActive : styles.filter}
              onClick={() => setFilterStatus(ALL)}
            >{t('ui.all')}</button>
            {(Object.keys(APP_CONFIG.labels.status) as ApplicationStatus[]).map(s => (
              <button
                key={s}
                className={filterStatus === s ? styles.filterActive : styles.filter}
                onClick={() => setFilterStatus(s)}
              >{APP_CONFIG.labels.status[s]}</button>
            ))}
          </div>
        </div>
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>{t('ui.addApplication')}</button>
      </div>

      {/* Table */}
      {loading ? (
        <p className={styles.empty}>{t('ui.loading')}</p>
      ) : filtered.length === 0 ? (
        <p className={styles.empty}>
          {applications.length === 0
            ? t('ui.noApplications')
            : t('ui.noResults')}
        </p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('fields.company')}</th>
                <th>{t('fields.roleTitle')}</th>
                <th>{t('fields.status')}</th>
                <th>{t('fields.applied')}</th>
                <th>{t('fields.source')}</th>
                <th>{t('fields.resumeVariant')}</th>
                <th>{t('fields.rejectionStage')}</th>
                <th>{t('fields.lastUpdated')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id} className={styles.row} onClick={() => navigate(`/app/${app.id}`)}>
                  <td className={styles.company}>{app.company}</td>
                  <td className={styles.role}>{app.role_title}</td>
                  <td>
                    <span
                      className={styles.badge}
                      style={{
                        color: APP_CONFIG.colors.status[app.status],
                        background: APP_CONFIG.colors.statusBg[app.status],
                      }}
                    >{APP_CONFIG.labels.status[app.status]}</span>
                  </td>
                  <td className={styles.muted}>{fmtDate(app.applied_at)}</td>
                  <td className={styles.muted}>{app.source ? (APP_CONFIG.labels.source[app.source] || app.source) : '—'}</td>
                  <td className={styles.muted}>{app.resume_variant ?? '—'}</td>
                  <td className={styles.muted}>{app.rejection_stage ? (APP_CONFIG.labels.rejectionStage[app.rejection_stage] || app.rejection_stage) : '—'}</td>
                  <td className={styles.muted}>{fmtDate(app.updated_at?.slice(0, 10))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ApplicationForm
          onSave={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue} style={color ? { color } : undefined}>{value}</span>
    </div>
  )
}
