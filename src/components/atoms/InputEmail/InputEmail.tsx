import React from 'react'

interface InputEmailProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string
}

export default function InputEmail({ className, ...props }: InputEmailProps) {
  const cls = ['form-input', className].filter(Boolean).join(' ')

  return (
    <input
      type="email"
      className={cls}
      placeholder="seu@email.com"
      {...props}
    />
  )
}
