import { faixas } from '../../data/Analise/faixas'
import type { Faixa } from '../../types/Analise/analise'

/* Selo colorido com o nome do veredito. Usado no resultado e no historico. */
export default function SeloFaixa({ faixa }: { faixa: Faixa }) {
  const info = faixas[faixa]
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[.9rem] font-semibold ${info.bg} ${info.fg}`}
    >
      {info.titulo}
    </span>
  )
}
