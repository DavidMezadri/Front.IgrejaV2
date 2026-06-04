export function formatCep(cep: string): string {
  const cleaned = cep.replace(/\D/g, '')
  if (cleaned.length !== 8) return cep
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
}

export function unformatCep(cep: string): string {
  return cep.replace(/\D/g, '')
}

export function isValidCep(cep: string): boolean {
  return unformatCep(cep).length === 8
}
