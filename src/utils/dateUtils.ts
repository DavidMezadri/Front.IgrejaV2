export const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
export const MESES_CURTO = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"]
export const DIAS = ["DOM","SEG","TER","QUA","QUI","SEX","SÁB"]

export function pad(n: number | string): string { return String(n).padStart(2, "0") }

export function fmtHora(iso: string): string {
  const d = new Date(iso)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function fmtDataLonga(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}

export function tipoCor(id: number | string): string {
  const map: Record<number | string, string> = {
    1: "var(--fg)",
    2: "var(--accent)",
    3: "var(--gold)",
    4: "oklch(0.55 0.12 28)",
    5: "oklch(0.55 0.10 150)",
    6: "oklch(0.55 0.10 220)",
    7: "oklch(0.65 0.12 320)",
    8: "oklch(0.55 0.07 60)",
  }
  return map[id] || "var(--fg)"
}
