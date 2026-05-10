interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  required?: boolean
}

export default function Checkbox({ checked, onChange, label, required }: CheckboxProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input
        type="checkbox"
        className="form-checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
      />
      {label}
      {required && ' *'}
    </label>
  )
}
