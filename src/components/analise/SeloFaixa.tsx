import { faixas } from '../../data/Analise/faixas'
import type { Risco } from '../../types/Api/dtos'

/* Selo colorido com o nome do veredito. Usado no historico e no detalhe. */
export default function SeloFaixa({ risco }: { risco: Risco }) {
  const info = faixas[risco]
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[.9rem] font-semibold ${info.bg} ${info.fg}`}
    >
      {info.titulo}
    </span>
  )
}
