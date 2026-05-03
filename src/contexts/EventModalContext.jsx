import { createContext, useContext, useState } from 'react'

const EventModalContext = createContext(null)

export function EventModalProvider({ children }) {
  const [openEv, setOpenEv] = useState(null)
  return (
    <EventModalContext.Provider value={{ openEv, openEvent: setOpenEv, closeEvent: () => setOpenEv(null) }}>
      {children}
    </EventModalContext.Provider>
  )
}

export function useEventModal() {
  return useContext(EventModalContext)
}
