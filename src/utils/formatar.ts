/* Formatacao para pt-BR. Fica fora das telas para nota e data saírem iguais em
   todas elas. */

/* A API da a nota de 0 a 100: 86.04 -> "86" */
export function notaBr(nota: number) {
  return Math.round(nota).toLocaleString('pt-BR')
}

/* Peso de um padrao: 25 -> "+25" */
export function pesoBr(peso: number) {
  return `+${notaBr(peso)}`
}

/* ISO -> "17/11/2026 às 20:52". A API (no Render, em UTC) manda a data sem fuso,
   entao sem o "Z" o navegador leria como hora local e mostraria 3h a mais. */
export function dataHoraBr(iso: string) {
  const temFuso = /(Z|[+-]\d{2}:?\d{2})$/.test(iso)
  const data = new Date(temFuso ? iso : `${iso}Z`)
  if (Number.isNaN(data.getTime())) return '—'
  return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

/* Nome do tipo de analise para a tela. */
export const nomeDoTipo = { TEXTO: 'Mensagem', LINK: 'Link', IMAGEM: 'Imagem' } as const
