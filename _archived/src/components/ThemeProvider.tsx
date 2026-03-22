'use client'

import { useEffect } from 'react'
import { useVaultStore } from '@/stores/vault'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useVaultStore((s) => s.theme)

  useEffect(() => {
    // Apply theme on mount and when it changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return <>{children}</>
}
