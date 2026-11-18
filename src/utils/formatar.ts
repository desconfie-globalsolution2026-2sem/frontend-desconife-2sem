/* Formatacao para pt-BR. Fica fora das telas para nota e data saírem iguais em
   todas elas. */

/* 0.82 -> "0,82" */
export function notaBr(nota: number) {
  return nota.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/* 0.25 -> "+0,25", igual a tabela de sinais da Home. */
export function pesoBr(peso: number) {
  return `+${notaBr(peso)}`
}

/* ISO -> "17/11/2026 às 20:52" */
export function dataHoraBr(iso: string) {
  const data = new Date(iso)
  if (Number.isNaN(data.getTime())) return '—'
  return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}
