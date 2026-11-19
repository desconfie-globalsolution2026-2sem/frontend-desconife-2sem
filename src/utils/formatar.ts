/* Formatacao para pt-BR. Fica fora das telas para nota e data saírem iguais em
   todas elas. */

/* A API da a nota de 0 a 100. 79.4 -> "79,4" */
export function notaBr(nota: number) {
  return nota.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
}

/* Quanto um sinal somou na nota. 35 -> "+35" */
export function pesoBr(peso: number) {
  return `+${notaBr(peso)}`
}

/* "2026-10-04" -> "04/10/2026". Por texto, sem Date: Date leria como UTC e
   no Brasil voltaria um dia. */
export function dataBr(iso: string) {
  return iso.slice(0, 10).split('-').reverse().join('/')
}

/* ISO -> "17/11/2026 às 20:52". A API (no Render, em UTC) manda a data sem fuso;
   sem o "Z" o navegador leria como hora local e mostraria 3h a mais. */
export function dataHoraBr(iso: string) {
  const temFuso = /(Z|[+-]\d{2}:?\d{2})$/.test(iso)
  const data = new Date(temFuso ? iso : `${iso}Z`)
  if (Number.isNaN(data.getTime())) return '—'
  return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}
