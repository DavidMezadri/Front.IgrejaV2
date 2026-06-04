import { useState } from 'react'

interface ValidationRule<T> {
  field: keyof T
  value: any
  required?: boolean
  format?: (value: string) => boolean
  custom?: (value: any) => string | null
}

export function useFormErrors<T extends Record<string, unknown>>() {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  function setError(field: keyof T, msg: string) {
    setErrors(prev => ({ ...prev, [field]: msg }))
  }

  function clearError(field: keyof T) {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  function clearAll() {
    setErrors({})
  }

  function hasErrors(): boolean {
    return Object.keys(errors).length > 0
  }

  function validate(rules: ValidationRule<T>[]): boolean {
    const newErrors: Partial<Record<keyof T, string>> = {}

    for (const rule of rules) {
      if (rule.required && (!rule.value || rule.value.toString().trim() === '')) {
        newErrors[rule.field] = `${String(rule.field)} é obrigatório`
        continue
      }

      if (rule.value && rule.format && !rule.format(rule.value.toString())) {
        newErrors[rule.field] = `${String(rule.field)} inválido`
        continue
      }

      if (rule.custom && rule.value) {
        const customError = rule.custom(rule.value)
        if (customError) {
          newErrors[rule.field] = customError
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return { errors, setError, clearError, clearAll, hasErrors, validate }
}
