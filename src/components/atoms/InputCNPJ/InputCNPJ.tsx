import React from 'react'

interface InputCNPJProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  className?: string
  onChange?: (value: string) => void
}

function formatarCNPJ(value: string): string {
  const digitos = value.replace(/\D/g, '')
  if (digitos.length === 0) return ''
  if (digitos.length <= 2) return digitos
  if (digitos.length <= 5) return `${digitos.slice(0, 2)}.${digitos.slice(2)}`
  if (digitos.length <= 8) return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5)}`
  if (digitos.length <= 12) return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5, 8)}/${digitos.slice(8)}`
  return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5, 8)}/${digitos.slice(8, 12)}-${digitos.slice(12, 14)}`
}

export default function InputCNPJ({ className, onChange, value, ...props }: InputCNPJProps) {
  const cls = ['form-input', className].filter(Boolean).join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const formatado = formatarCNPJ(raw)
    e.target.value = formatado
    onChange?.(formatado)
  }

  return (
    <input
      type="text"
      className={cls}
      value={value}
      onChange={handleChange}
      placeholder="XX.XXX.XXX/XXXX-XX"
      maxLength={18}
      {...props}
    />
  )
}
