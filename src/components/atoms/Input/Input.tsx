import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export default function Input({ className, ...props }: InputProps) {
  const cls = ['form-input', className].filter(Boolean).join(' ')
  return <input className={cls} {...props} />
}
