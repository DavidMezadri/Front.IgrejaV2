export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function isNotBlank(value: string): boolean {
  return value.trim().length > 0
}

export function isValidDate(value: string): boolean {
  if (!value) return false
  const date = new Date(value)
  return !isNaN(date.getTime())
}

export function isValidDateRange(value: string, minYear: number = 1900, maxYear: number = new Date().getFullYear()): boolean {
  if (!value) return false
  const date = new Date(value)
  if (isNaN(date.getTime())) return false
  const year = date.getFullYear()
  return year >= minYear && year <= maxYear
}

export function isValidCep(cep: string): boolean {
  return /^\d{5}-\d{3}$/.test(cep)
}

export function isValidTelefone(telefone: string): boolean {
  const regex = /^[\d\s\-\(\)]+$/.test(telefone)
  const digitos = telefone.replace(/\D/g, '')
  return regex && digitos.length >= 10 && digitos.length <= 11
}

export function isValidCNPJ(cnpj: string): boolean {
  const digitos = cnpj.replace(/\D/g, '')
  return digitos.length === 14
}
