export default function Badge({ variant, children }) {
  const variantClass = variant ? ` ${variant}` : ''
  return (
    <span className={`badge${variantClass}`}>
      {children}
    </span>
  )
}
