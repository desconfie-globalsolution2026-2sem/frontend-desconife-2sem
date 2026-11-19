import type { TipoAnalise } from '../../types/Api/dtos'

/* O que a pessoa vai enviar. A API analisa link com regras proprias (dominio,
   HTTPS) e le o texto da imagem antes de analisar. */
export const tipos: { valor: TipoAnalise; label: string }[] = [
  { valor: 'TEXTO', label: 'Mensagem' },
  { valor: 'LINK', label: 'Link' },
  { valor: 'IMAGEM', label: 'Print (imagem)' },
]

export const rotuloDoTipo = (tipo: TipoAnalise) => tipos.find((t) => t.valor === tipo)?.label ?? tipo
