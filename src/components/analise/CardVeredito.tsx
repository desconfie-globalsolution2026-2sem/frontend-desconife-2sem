import { faixas } from '../../data/Analise/faixas'
import type { Analise } from '../../types/Analise/analise'
import { notaBr, pesoBr } from '../../utils/formatar'

/* Resultado de uma analise: veredito, nota e os sinais que a API encontrou. */
export default function CardVeredito({ analise }: { analise: Analise }) {
  const info = faixas[analise.faixa]

  return (
    /* role=status para o leitor de tela anunciar o veredito quando ele aparece. */
    <section role="status" className={`grid gap-4 rounded-[28px] p-7 ${info.bg}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className={`text-[clamp(1.5rem,3vw,2rem)] font-bold ${info.fg}`}>{info.titulo}</h2>
        <p className={`font-mono text-[1.05rem] font-semibold ${info.fg}`}>
          nota {notaBr(analise.nota)}
        </p>
      </div>

      <p className="text-[1.08rem] text-ink">{info.texto}</p>

      {analise.sinais.length > 0 ? (
        <div>
          <h3 className="text-[1.05rem] font-semibold">O que pesou</h3>
          <ul className="mt-2 grid list-none gap-2 p-0">
            {analise.sinais.map((s) => (
              <li
                key={s.codigo}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/70 px-4 py-2.5"
              >
                <span className="font-medium">{s.nome}</span>
                <span className="font-mono text-[.95rem] text-muted">
                  {s.critico ? 'crítico' : pesoBr(s.peso)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-[.98rem] text-muted">Nenhum sinal de golpe apareceu nesta mensagem.</p>
      )}
    </section>
  )
}
