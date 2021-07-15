import { useContext } from 'react'
import { UserContext } from 'context/UserContext'

export default function useUserPanel() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUserPanel must be used within a provider')
  }

  return context
}
