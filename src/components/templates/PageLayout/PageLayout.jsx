import { Outlet } from 'react-router-dom'
import Sidebar from '../../organisms/Sidebar/Sidebar'
import EventModal from '../../organisms/EventModal/EventModal'
import { useEventModal } from '../../../contexts/EventModalContext'

export default function PageLayout({ theme, toggleTheme }) {
  const { openEv, closeEvent } = useEventModal()

  return (
    <>
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      <div className="app-shell">
        <div className="app-scroll">
          <Outlet />
        </div>
      </div>
      <EventModal ev={openEv} onClose={closeEvent} />
    </>
  )
}
