export default function Button({ variant = 'primary', href, onClick, children, type = 'button' }) {
  const cls = `btn btn-${variant}`
  if (href) return <a href={href} className={cls}>{children}</a>
  return <button type={type} onClick={onClick} className={cls}>{children}</button>
}
