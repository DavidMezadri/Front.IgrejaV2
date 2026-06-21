import React from 'react'

interface InputTelefoneProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  className?: string
  onChange?: (value: string) => void
}

function formatarTelefone(value: string): string {
  const digitos = value.replace(/\D/g, '')
  if (digitos.length === 0) return ''
  if (digitos.length <= 2) return `(${digitos}`
  if (digitos.length <= 7) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`
  if (digitos.length <= 11) return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7, 11)}`
}

export default function InputTelefone({ className, onChange, value, ...props }: InputTelefoneProps) {
  const cls = ['form-input', className].filter(Boolean).join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const formatado = formatarTelefone(raw)
    e.target.value = formatado
    onChange?.(formatado)
  }

  return (
    <input
      type="text"
      className={cls}
      value={value}
      onChange={handleChange}
      placeholder="(XX) 9XXXX-XXXX"
      maxLength={15}
      {...props}
    />
  )
}
