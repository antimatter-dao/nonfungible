import User from 'pages/User'
import React, { useState } from 'react'

interface UserContext {
  isUserPanelOpen: boolean
  showUserPanel: () => void
  hideUserPanel: () => void
}

export const UserContext = React.createContext({
  isUserPanelOpen: false,
  showUserPanel: () => {},
  hideUserPanel: () => {}
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true)

  const hideUserPanel = () => {
    setIsOpen(false)
  }

  const showUserPanel = () => {
    setIsOpen(true)
  }

  return (
    <UserContext.Provider value={{ hideUserPanel, showUserPanel, isUserPanelOpen: isOpen }}>
      {children}
      <User isOpen={isOpen} onDismiss={hideUserPanel} />
    </UserContext.Provider>
  )
}
