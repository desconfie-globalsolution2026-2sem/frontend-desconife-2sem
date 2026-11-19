import { etapas } from '../../data/Sobre/etapas'
import { modelos } from '../../data/Sobre/modelos'
import { publicos } from '../../data/Sobre/publicos'

const eyebrow = 'text-[.95rem] font-semibold text-amber-text'
const h2 = 'text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold'
const lead = 'max-w-[58ch] text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-muted'
const wrap = 'mx-auto max-w-[1080px] px-5'

const formula = `nota_regras = soma dos pesos dos padrões (máx. 100)
nota_ia     = chance de golpe do modelo × 100
nota_final  = (nota_regras + nota_ia) ÷ 2
              sem IA no ar, vale só nota_regras

nota_final ≥ 60  → muito provável golpe
nota_final ≥ 30  → suspeito
abaixo de 30     → sem sinais de golpe
site oficial     → nota limitada a 29`

export default function Sobre() {
  return (
    <main>
      {/* Cabeçalho */}
      <div className={`${wrap} pt-18 pb-6`}>
        <p className={eyebrow}>Sobre o Desconfie</p>
        <h1 className="mt-3 max-w-[20ch] text-[clamp(2.4rem,5.4vw,4rem)] font-bold">
          Como uma mensagem vira um veredito
        </h1>
        <p className={`${lead} mt-4.5`}>
          Quatro partes trabalham juntas. As regras e a IA dão uma nota cada, o Java junta as
          duas, e você recebe a resposta com os motivos.
        </p>
      </div>

      {/* Arquitetura */}
      <section className="py-18">
        <div className={wrap}>
          <div className="mb-10 grid max-w-[760px] gap-3">
            <p className={eyebrow}>Arquitetura</p>
            <h2 className={h2}>O caminho da sua mensagem</h2>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {etapas.map((e, i) => (
              <li
                key={e.titulo}
                className={`grid content-start gap-1.5 rounded-card p-5 ${
                  e.destaque ? 'bg-navy' : 'bg-surface'
                }`}
              >
                <span
                  className={`font-mono text-[.75rem] ${
                    e.destaque ? 'text-amber' : 'text-muted'
                  }`}
                >
                  {i + 1}. {e.tech}
                </span>
                <h3 className={`text-[1.2rem] font-semibold ${e.destaque ? 'text-white' : ''}`}>
                  {e.titulo}
                </h3>
                <p className={`text-[.95rem] ${e.destaque ? 'text-white/80' : 'text-muted'}`}>
                  {e.texto}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-4 max-w-[70ch] text-[.95rem] text-muted">
            Na ordem: o site envia para o Java. O Java confere as regras e pede a nota ao Python.
            Com as duas notas, decide o veredito, grava no Oracle e devolve para a tela. Se for
            vermelho, avisa quem está no seu círculo de confiança. Se a IA estiver fora do ar, a
            análise sai só com as regras.
          </p>
        </div>
      </section>

      {/* Regra de ouro */}
      <section className="bg-surface py-18">
        <div className={`${wrap} grid gap-9 md:grid-cols-2 md:gap-14`}>
          <div className="grid max-w-[65ch] content-start gap-4">
            <p className={eyebrow}>A regra de ouro</p>
            <h2 className={h2}>
              A IA nunca decide <span className="hl">sozinha</span>
            </h2>
            <p className="text-muted">
              Modelo de IA erra, e numa questão de dinheiro o erro custa caro. Por isso a decisão
              final é da API Java, que tira a média entre a nota do modelo e a nota das regras.
            </p>
            <p className="text-muted">
              Cada padrão encontrado soma o seu peso uma vez só, e um link do site oficial de uma
              empresa (como itau.com.br) nunca passa de 29. Como a tela mostra o que pesou, cada
              veredito pode ser explicado e auditado.
            </p>
          </div>

          <div className="grid content-start gap-4 rounded-card bg-white p-7">
            <h3 className="text-[1.2rem] font-semibold">Como a nota é calculada</h3>
            <pre className="overflow-x-auto rounded-xl bg-surface p-4 font-mono text-[.95rem] leading-[1.7] text-ink">
              {formula}
            </pre>
          </div>
        </div>
      </section>

      {/* Modelos de IA */}
      <section className="py-18">
        <div className={wrap}>
          <div className="mb-10 grid max-w-[760px] gap-3">
            <p className={eyebrow}>Inteligência artificial</p>
            <h2 className={h2}>Dois modelos, cada um com uma pergunta</h2>
          </div>
          <ul className="grid gap-4 md:grid-cols-2">
            {modelos.map((m) => (
              <li key={m.pergunta} className="grid content-start gap-2.5 rounded-card bg-surface p-7">
                <h3 className="text-[1.2rem] font-semibold">{m.pergunta}</h3>
                <p className="text-muted">{m.resumo}</p>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[.95rem]">
                  <dt className="text-muted">Técnica</dt>
                  <dd className="m-0">{m.tecnica}</dd>
                  <dt className="text-muted">Dados</dt>
                  <dd className="m-0">{m.dados}</dd>
                  <dt className="text-muted">Métrica</dt>
                  <dd className="m-0">{m.metrica}</dd>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Modelo de negócio */}
      <section className="bg-surface py-18">
        <div className={wrap}>
          <div className="mb-10 grid max-w-[760px] gap-3">
            <p className={eyebrow}>Modelo de negócio</p>
            <h2 className={h2}>Grátis para o cidadão, pago por quem perde com a fraude</h2>
          </div>
          <div className="overflow-x-auto rounded-card bg-white">
            <table className="w-full min-w-[560px] border-collapse text-[.98rem]">
              <thead>
                <tr>
                  {['Quem', 'O que recebe', 'Como paga'].map((th) => (
                    <th
                      key={th}
                      className="border-b border-surface-2 px-5 py-4 text-left text-[.85rem] font-semibold text-muted"
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {publicos.map((p) => (
                  <tr key={p.quem}>
                    <td className="border-b border-surface-2 px-5 py-4 align-top font-semibold text-navy">
                      {p.quem}
                    </td>
                    <td className="border-b border-surface-2 px-5 py-4 align-top">{p.recebe}</td>
                    <td className="border-b border-surface-2 px-5 py-4 align-top">{p.paga}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-[70ch] text-muted">
            Para o banco, cada golpe evitado é menos ressarcimento, menos ligação no SAC e menos
            reclamação no Banco Central.
          </p>
        </div>
      </section>

      {/* Privacidade e projeto */}
      <section className="py-18">
        <div className={`${wrap} grid gap-9 md:grid-cols-2 md:gap-14`}>
          <div className="grid max-w-[65ch] content-start gap-4">
            <p className={eyebrow}>Privacidade</p>
            <h2 className={h2}>O que fazemos com o que você cola</h2>
            <p className="text-muted">
              Antes de a mensagem sair do navegador, trocamos CPF, telefone, e-mail e cartão por
              marcadores como [CPF]. A análise fica guardada na sua conta. O texto mascarado serve
              para mostrar seu histórico, avisar o seu círculo e, com o seu "era golpe" ou "não
              era", melhorar os modelos.
            </p>
          </div>
          <div className="grid max-w-[65ch] content-start gap-4">
            <p className={eyebrow}>Projeto acadêmico</p>
            <h2 className={h2}>Global Solution 2026/2 · FIAP</h2>
            <p className="text-muted">
              Desenvolvido pela turma 1TDS para as seis disciplinas do semestre: front-end, Java,
              Python, inteligência artificial, banco de dados e engenharia de software.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
