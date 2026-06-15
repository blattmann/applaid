import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const { t } = useTranslation()
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [signupDone, setSignupDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    if (mode === 'signin') {
      const { error } = await signIn(email, password)
      if (error) { setError(error); setLoading(false) }
      else navigate('/')
    } else {
      const { error } = await signUp(email, password)
      setLoading(false)
      if (error) { setError(error) }
      else setSignupDone(true)
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>{t('login.title')}</h1>
          <p className={styles.tagline}>{t('login.subtitle')}</p>
        </div>

        {signupDone ? (
          <div className={styles.notice}>
            {t('login.confirmationSent')}
            <button className={styles.link} onClick={() => { setMode('signin'); setSignupDone(false) }}>{t('login.signIn')} →</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>
                {t('fields.email')}
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
              </label>
            </div>
            <div className={styles.field}>
              <label>
                {t('fields.password')}
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </label>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? '…' : mode === 'signin' ? t('login.signIn') : t('login.signUp')}
            </button>
            <p className={styles.toggle}>
              {mode === 'signin' ? t('login.noAccount') : t('login.hasAccount')}
              <button type="button" className={styles.link} onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null) }}>
                {mode === 'signin' ? t('login.signUp') : t('login.signIn')}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
