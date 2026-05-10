import styles from './Checkbox.module.css'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  required?: boolean
}

export default function Checkbox({ checked, onChange, label, required }: CheckboxProps) {
  return (
    <label className={styles.checkboxLabel}>
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
