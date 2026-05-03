export default function Badge({ variant, children }) {
  return (
    <span className={`badge${variant === 'ok' ? ' ok' : ''}`}>
      {children}
    </span>
  )
}
