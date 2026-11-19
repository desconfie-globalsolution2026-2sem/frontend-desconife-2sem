import { faixas } from '../../data/Analise/faixas'
import type { AnaliseResponse } from '../../types/Api/dtos'
import { notaBr, pesoBr } from '../../utils/formatar'

/* Resultado de uma analise: veredito, nota, orientacao e o que a API encontrou. */
export default function CardVeredito({ analise }: { analise: AnaliseResponse }) {
  const info = faixas[analise.risco]
  const sinais = [
    ...analise.padroesEncontrados.map((p) => ({
      chave: `p${p.id}`,
      nome: `"${p.termo}"${p.ocorrencias > 1 ? ` (${p.ocorrencias}x)` : ''}${p.categoria ? ` · ${p.categoria}` : ''}`,
      peso: p.peso,
    })),
    ...analise.sinaisLink.map((s, i) => ({ chave: `l${i}`, nome: s.descricao, peso: s.peso })),
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
        <p className="text-[1.02rem] text-ink">
          Parece um golpe do tipo <strong>{analise.categoriaPrincipal}</strong>.
        </p>
      )}

      <p className="text-[1.08rem] text-ink">{analise.orientacao || info.texto}</p>

      {sinais.length > 0 ? (
        <div>
          <h3 className="text-[1.05rem] font-semibold">O que pesou</h3>
          <ul className="mt-2 grid list-none gap-2 p-0">
            {sinais.map((s) => (
              <li
                key={s.chave}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/70 px-4 py-2.5"
              >
                <span className="min-w-0 font-medium break-words">{s.nome}</span>
                <span className="font-mono text-[.95rem] text-muted">{pesoBr(s.peso)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-[.98rem] text-muted">Nenhuma regra de golpe bateu nesta mensagem.</p>
      )}

      <p className="text-[.9rem] text-muted">
        Regras {notaBr(analise.notaRegras)} ·{' '}
        {analise.iaDisponivel ? `IA ${notaBr(analise.notaIa)}` : 'IA fora do ar, nota só pelas regras'}
      </p>
    </section>
  )
}
