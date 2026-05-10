import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
}

export default function Select({ className, children, ...props }: SelectProps) {
  const cls = ['form-select', className].filter(Boolean).join(' ')
  return <select className={cls} {...props}>{children}</select>
}
