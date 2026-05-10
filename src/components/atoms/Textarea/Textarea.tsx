import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export default function Textarea({ className, ...props }: TextareaProps) {
  const cls = ['form-textarea', className].filter(Boolean).join(' ')
  return <textarea className={cls} {...props} />
}
