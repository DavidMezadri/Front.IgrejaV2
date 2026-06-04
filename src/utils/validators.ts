export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function isNotBlank(value: string): boolean {
  return value.trim().length > 0
}

export function isValidDate(value: string): boolean {
  if (!value) return false
  return !isNaN(Date.parse(value))
}

export function isValidCep(cep: string): boolean {
  return /^\d{5}-\d{3}$/.test(cep)
}
