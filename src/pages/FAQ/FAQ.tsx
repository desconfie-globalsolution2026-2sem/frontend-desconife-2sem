import { grupos } from '../../data/FAQ/perguntas'

const wrap = 'mx-auto max-w-[860px] px-5'

export default function FAQ() {
  return (
    <main>
      <div className={`${wrap} pt-18 pb-6`}>
        <p className="text-[.95rem] font-semibold text-amber-text">Perguntas frequentes</p>
        <h1 className="mt-3 max-w-[20ch] text-[clamp(2.4rem,5.4vw,4rem)] font-bold">
          Ficou com alguma dúvida?
        </h1>
        <p className="mt-4.5 max-w-[58ch] text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-muted">
          Respostas curtas sobre como usar, quanto custa e o que acontece com os seus dados.
        </p>
      </div>

      <section className="py-18">
        <div className={wrap}>
          {grupos.map((g) => (
            <div key={g.titulo} className="mb-9">
              <h2 className="mb-2 text-[1.35rem] font-bold">{g.titulo}</h2>
              {g.perguntas.map((p) => (
                <details key={p.pergunta} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[1.08rem] font-semibold text-navy">
                    {p.pergunta}
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-muted transition-transform group-open:rotate-180"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="max-w-[70ch] pb-6 text-muted">{p.resposta}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
