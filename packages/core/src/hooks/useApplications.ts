import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { Application, TimelineEvent, ApplicationInsert } from '../types'

export function useApplications() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!user) {
      setApplications([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, timeline_events(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) {
        setError(error.message)
      } else {
        setApplications(data ?? [])
      }
    } catch (e) {
      const err = e as Error
      setError(err.message ?? 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const createApplication = async (payload: ApplicationInsert) => {
    if (!user) return { error: 'Not authenticated' }
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert({ ...payload, user_id: user.id })
        .select()
        .single()
      if (error) return { error: error.message }

      const { error: timelineError } = await supabase.from('timeline_events').insert({
        application_id: data.id,
        user_id: user.id,
        stage: 'applied',
        event_date: payload.applied_at ?? new Date().toISOString().slice(0, 10),
        notes: null,
      })

      if (timelineError) {
        console.error('Failed to create initial timeline event:', timelineError)
        // We still fetch because the application was created
      }

      await fetch()
      return { error: null }
    } catch (e) {
      const err = e as Error
      return { error: err.message ?? 'Failed to create application' }
    }
  }

  const updateApplication = async (id: string, payload: Partial<Application>) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update(payload)
        .eq('id', id)
      if (error) return { error: error.message }
      await fetch()
      return { error: null }
    } catch (e) {
      const err = e as Error
      return { error: err.message ?? 'Failed to update application' }
    }
  }

  const deleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)
      if (error) return { error: error.message }
      await fetch()
      return { error: null }
    } catch (e) {
      const err = e as Error
      return { error: err.message ?? 'Failed to delete application' }
    }
  }

  const addTimelineEvent = async (applicationId: string, event: Omit<TimelineEvent, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: 'Not authenticated' }
    try {
      const { error } = await supabase.from('timeline_events').insert({ ...event, user_id: user.id })
      if (error) return { error: error.message }
      await fetch()
      return { error: null }
    } catch (e) {
      const err = e as Error
      return { error: err.message ?? 'Failed to add timeline event' }
    }
  }

  const deleteTimelineEvent = async (eventId: string) => {
    try {
      const { error } = await supabase.from('timeline_events').delete().eq('id', eventId)
      if (error) return { error: error.message }
      await fetch()
      return { error: null }
    } catch (e) {
      const err = e as Error
      return { error: err.message ?? 'Failed to delete timeline event' }
    }
  }

  return {
    applications,
    loading,
    error,
    refetch: fetch,
    createApplication,
    updateApplication,
    deleteApplication,
    addTimelineEvent,
    deleteTimelineEvent,
  }
}
