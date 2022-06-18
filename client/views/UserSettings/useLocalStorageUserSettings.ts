import { useEffect, useState } from 'react'

const INITIAL_SETTINGS = {
  defaultBudgetId: '',
}

export const useLocalStorageUserSettings = () => {
  const [settings, setSettings] = useState(INITIAL_SETTINGS)

  useEffect(() => {
    if (localStorage.getItem('userSettings')) {
      setSettings(JSON.parse(localStorage.getItem('userSettings') as string))
    }
  }, [])

  const updateSettings = (newSettings: Partial<typeof INITIAL_SETTINGS>) => {
    setSettings({ ...settings, ...newSettings })
    localStorage.setItem('userSettings', JSON.stringify({ ...settings, ...newSettings }))
  }

  const clearSettings = () => {
    localStorage.clear()
    setSettings(INITIAL_SETTINGS)
  }

  return {
    settings,
    updateSettings,
    clearSettings,
  }
}
