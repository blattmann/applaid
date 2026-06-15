import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => Promise.resolve(),
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}))
