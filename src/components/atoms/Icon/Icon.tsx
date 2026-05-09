const Base = ({ children, size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

export const HomeIcon     = ({ size }) => <Base size={size}><path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z"/></Base>
export const CalendarIcon = ({ size }) => <Base size={size}><rect x="3" y="4.5" width="18" height="17" rx="2"/><path d="M8 2v5M16 2v5M3 10h18"/></Base>
export const MusicIcon    = ({ size }) => <Base size={size}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></Base>
export const MegaphoneIcon= ({ size }) => <Base size={size}><path d="M3 11v3a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M14 6a6 6 0 0 1 0 12"/><path d="M14 9a3 3 0 0 1 0 6"/></Base>
export const UsersIcon    = ({ size }) => <Base size={size}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Base>
export const HeartIcon    = ({ size }) => <Base size={size}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></Base>
export const PlayIcon     = ({ size }) => <Base size={size}><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z" fill="currentColor"/></Base>
export const BookIcon     = ({ size }) => <Base size={size}><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5a2.5 2.5 0 0 0 0 5H20"/><path d="M6.5 2v18"/></Base>
export const LoginIcon    = ({ size }) => <Base size={size}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></Base>
export const SettingsIcon = ({ size }) => <Base size={size}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></Base>
export const SunIcon      = ({ size }) => <Base size={size}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></Base>
export const MoonIcon     = ({ size }) => <Base size={size}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></Base>
export const MenuIcon     = ({ size }) => <Base size={size}><path d="M4 6h16M4 12h16M4 18h16"/></Base>
export const LogoutIcon   = ({ size }) => <Base size={size}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Base>
export const DatabaseIcon = ({ size }) => <Base size={size}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></Base>
export const NetworkIcon  = ({ size }) => <Base size={size}><circle cx="12" cy="5" r="3"/><circle cx="6" cy="15" r="3"/><circle cx="18" cy="15" r="3"/><path d="M9 8.5l-2 4M15 8.5l2 4M6 18v2M18 18v2M12 8v4"/></Base>
export const ShieldIcon   = ({ size }) => <Base size={size}><path d="M12 22s-8-4-8-11V5l8-3 8 3v6c0 7-8 11-8 11z"/></Base>
export const CheckIcon    = ({ size }) => <Base size={size}><polyline points="20 6 9 17 4 12"/></Base>
export const AlertIcon    = ({ size }) => <Base size={size}><circle cx="12" cy="13" r="1"/><path d="M12 8v4M4.9 4.9l2.8 2.8M17.3 4.9l-2.8 2.8"/></Base>
export const TrashIcon    = ({ size }) => <Base size={size}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></Base>
export const EditIcon     = ({ size }) => <Base size={size}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></Base>
