export default function Tag({ dot, color, children }) {
  return (
    <span className="tag">
      {dot && <span className="dot" style={color ? { background: color } : {}} />}
      {children}
    </span>
  )
}
