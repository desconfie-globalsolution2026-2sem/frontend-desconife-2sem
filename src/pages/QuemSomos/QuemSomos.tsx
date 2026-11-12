import { integrantes } from '../../data/QuemSomos/integrantes'
import { ods } from '../../data/QuemSomos/ods'
import { valores } from '../../data/QuemSomos/valores'

function IconeGitHub() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.2c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  )
}

function IconeLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

const eyebrow = 'text-[.95rem] font-semibold text-amber-text'
const h2 = 'text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold'
const lead = 'max-w-[58ch] text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-muted'
const wrap = 'mx-auto max-w-[1080px] px-5'

export default function QuemSomos() {
  return (
    <main>
      {/* Cabeçalho da página */}
      <div className={`${wrap} pt-18 pb-6`}>
        <p className={eyebrow}>Quem somos</p>
        <h1 className="mt-3 max-w-[20ch] text-[clamp(2.4rem,5.4vw,4rem)] font-bold">
          Um grupo de estudantes que cansou de ver gente perder dinheiro com mensagem falsa
        </h1>
        <p className={`${lead} mt-4.5`}>
          O Desconfie nasceu na Global Solution 2026/2 da FIAP, no tema CitizenTech: tecnologia que
          resolve um problema real de quem mora na cidade.
        </p>
      </div>

      {/* Por que existimos + valores */}
      <section className="py-18">
        <div className={`${wrap} grid gap-9 md:grid-cols-2 md:gap-14`}>
          <div className="grid max-w-[65ch] content-start gap-4">
            <p className={eyebrow}>Por que existimos</p>
            <h2 className={h2}>
              Pense na <span className="hl">dona Maria</span>
            </h2>
            <p className="text-muted">
              Dona Maria tem 67 anos, usa o WhatsApp todo dia e recebe uma mensagem dizendo que o
              PIX dela foi bloqueado. Tem um link e um prazo de 30 minutos. Ela não sabe se é
              verdade e não quer incomodar o neto de novo.
            </p>
            <p className="text-muted">
              O Desconfie é para esse momento. Ela cola a mensagem, vê em letras grandes que é muito
              provável golpe e lê por quê: o link imita o banco, a mensagem tem pressa e pede dados.
              Em seguida, vê o que fazer.
            </p>
          </div>

          <div className="grid content-start gap-6">
            <p className={eyebrow}>No que acreditamos</p>
            {valores.map((v) => (
              <div key={v.titulo} className="grid gap-1.5 border-l-[3px] border-amber pl-[18px]">
                <h3 className="text-[1.2rem] font-semibold">{v.titulo}</h3>
                <p className="text-muted">{v.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrantes */}
      <section className="bg-surface py-18">
        <div className={wrap}>
          <div className="mb-10 grid max-w-[760px] gap-3">
            <p className={eyebrow}>Integrantes</p>
            <h2 className={h2}>Quem faz o Desconfie</h2>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {integrantes.map((m) => (
              <li key={m.rm} className="rounded-card bg-white p-3 pb-5 shadow-sm">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-2">
                  <img
                    src={m.foto}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                    loading="lazy"
                  />
                  {/* Nome no rodape da foto, centralizado e branco sobre veu escuro */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent px-3 pt-12 pb-4">
                    <h3 className="text-center text-[1.05rem] leading-tight font-semibold text-balance text-white">
                      {m.nome}
                    </h3>
                  </div>
                </div>

                {/* Faixa branca de baixo: dados do aluno */}
                <div className="mt-4 text-center">
                  <p className="text-[.95rem] font-medium tabular-nums text-ink">
                    {m.rm} <span className="text-muted">· {m.turma}</span>
                  </p>
                  <div className="mt-1 flex justify-center gap-1">
                    <a
                      href={m.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`GitHub de ${m.nome}`}
                      className="grid size-11 place-items-center rounded-full text-navy transition-colors hover:bg-surface"
                    >
                      <IconeGitHub />
                    </a>
                    <a
                      href={m.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`LinkedIn de ${m.nome}`}
                      className="grid size-11 place-items-center rounded-full text-navy transition-colors hover:bg-surface"
                    >
                      <IconeLinkedIn />
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ODS */}
      <section className="py-18">
        <div className={wrap}>
          <div className="mb-10 grid max-w-[760px] gap-3">
            <p className={eyebrow}>Objetivos de Desenvolvimento Sustentável</p>
            <h2 className={h2}>Onde o projeto se encaixa na Agenda 2030</h2>
          </div>
          <ul className="grid gap-4 md:grid-cols-3">
            {ods.map((o) => (
              <li
                key={o.num}
                className="grid grid-cols-[auto_1fr] items-start gap-4 rounded-card bg-surface p-[22px]"
              >
                <span className="grid size-13 place-items-center rounded-[14px] bg-amber text-[1.5rem] font-bold text-navy">
                  {o.num}
                </span>
                <div>
                  <h3 className="text-[1.2rem] font-semibold">{o.titulo}</h3>
                  <p className="mt-1 text-[.98rem] text-muted">{o.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
