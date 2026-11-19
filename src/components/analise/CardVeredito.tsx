import { faixas } from '../../data/Analise/faixas'
import type { AnaliseResponse } from '../../types/Api/dtos'
import { notaBr, pesoBr } from '../../utils/formatar'

/* Resultado de uma analise: veredito, nota, orientacao e os sinais que a API encontrou. */
export default function CardVeredito({ analise }: { analise: AnaliseResponse }) {
  const info = faixas[analise.risco]

  /* Termos do texto e sinais do link viram uma lista so. */
  const sinais = [
    ...analise.padroesEncontrados.map((p) => ({ nome: `“${p.termo}”`, detalhe: p.categoria, peso: p.peso })),
    ...analise.sinaisLink.map((s) => ({ nome: s.descricao, detalhe: 'Link', peso: s.peso })),
  ]

  return (
    /* role=status para o leitor de tela anunciar o veredito quando ele aparece. */
    <section role="status" className={`grid gap-4 rounded-[28px] p-7 ${info.bg}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className={`text-[clamp(1.5rem,3vw,2rem)] font-bold ${info.fg}`}>{info.titulo}</h2>
        <p className={`font-mono text-[1.05rem] font-semibold ${info.fg}`}>
          nota {notaBr(analise.notaFinal)}/100
        </p>
      </div>

      {analise.categoriaPrincipal && (
        <p className="font-semibold text-ink">{analise.categoriaPrincipal}</p>
      )}
      <p className="text-[1.08rem] text-ink">{analise.orientacao}</p>

      {sinais.length > 0 ? (
        <div>
          <h3 className="text-[1.05rem] font-semibold">O que pesou</h3>
          <ul className="mt-2 grid list-none gap-2 p-0">
            {sinais.map((s) => (
              <li
                key={`${s.detalhe}-${s.nome}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/70 px-4 py-2.5"
              >
                <span>
                  <span className="font-medium">{s.nome}</span>{' '}
                  <span className="text-[.92rem] text-muted">· {s.detalhe}</span>
                </span>
                <span className="font-mono text-[.95rem] text-muted">{pesoBr(s.peso)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-[.98rem] text-muted">Nenhuma regra de golpe bateu com esta mensagem.</p>
      )}

      {!analise.iaDisponivel && (
        <p className="text-[.92rem] text-muted">A IA estava fora do ar: a nota saiu só das regras.</p>
      )}
    </section>
  )
}
