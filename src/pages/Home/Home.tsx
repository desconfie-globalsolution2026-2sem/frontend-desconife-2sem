import { Link } from 'react-router-dom'

const passos = [
  {
    titulo: 'Cole a mensagem ou o link',
    texto: 'Copie do WhatsApp, do SMS ou do e-mail e cole no campo. Não precisa criar conta.',
  },
  {
    titulo: 'A gente procura os sinais',
    texto: 'Regras conhecidas de golpe e dois modelos de IA olham o texto e o endereço do link.',
  },
  {
    titulo: 'Você recebe o veredito e o que fazer',
    texto: 'Cada motivo aparece em português claro, com o passo seguinte: apagar, bloquear ou ligar para o banco.',
  },
]

const sinais = [
  { nome: 'Pressa', peso: '+0,20', codigo: 'URGENCIA', critico: false, texto: '"Só hoje", "últimas horas", "responda agora". Golpista não quer que você pense.' },
  { nome: 'Pede PIX', peso: '+0,25', codigo: 'PEDE_PIX', critico: false, texto: 'Pedido de transferência para resolver um problema que você não sabia que tinha.' },
  { nome: 'Pede dados', peso: '+0,30', codigo: 'PEDE_DADOS', critico: false, texto: 'Senha, código do SMS, CPF ou número do cartão. Banco nenhum pede isso por mensagem.' },
  { nome: 'Ameaça de bloqueio', peso: '+0,20', codigo: 'AMEACA_BLOQUEIO', critico: false, texto: '"Sua conta será bloqueada", "seu CPF está irregular". Medo faz a pessoa agir rápido.' },
  { nome: 'Prêmio', peso: '+0,20', codigo: 'PREMIO', critico: false, texto: 'Sorteio que você não lembra de ter entrado, sempre com uma "taxa" para liberar.' },
  { nome: 'Finge ser parente', peso: '+0,25', codigo: 'FINGE_PARENTE', critico: false, texto: '"Oi mãe, troquei de número". Ligue no número antigo antes de qualquer coisa.' },
  { nome: 'Link suspeito', peso: '+0,35', codigo: 'URL_SUSPEITA', critico: false, texto: 'Endereço com cara de phishing, avaliado por um modelo treinado com 101 mil links.' },
  { nome: 'Link encurtado', peso: '+0,15', codigo: 'LINK_ENCURTADO', critico: false, texto: 'bit.ly e parecidos escondem o destino real. Empresa séria usa o próprio site.' },
  { nome: 'Imita uma marca', peso: 'crítico', codigo: 'DOMINIO_IMITA_MARCA', critico: true, texto: 'Usa o nome de um banco ou dos Correios num site que não é o oficial.' },
]

const vereditos = [
  { faixa: 'nota a partir de 0,70 ou sinal crítico', titulo: 'Muito provável golpe', texto: 'Não clique, não pague, não responda. Apague e bloqueie o contato.', bg: 'bg-danger-bg', fg: 'text-danger' },
  { faixa: 'nota de 0,40 a 0,69', titulo: 'Suspeito', texto: 'Confirme por outro caminho: abra o app oficial ou ligue para o número do cartão.', bg: 'bg-warn-bg', fg: 'text-warn' },
  { faixa: 'nota abaixo de 0,40', titulo: 'Sem sinais de golpe', texto: 'Nada chamou atenção. Mesmo assim, nunca passe senha ou código por mensagem.', bg: 'bg-safe-bg', fg: 'text-safe' },
]

const garantias = [
  'Mostra o motivo, não só um "sim" ou "não"',
  'Funciona com SMS, WhatsApp, e-mail e links',
  'Esconde CPF, telefone e e-mail antes de guardar',
]

function Check() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="mt-[3px] shrink-0 text-safe">
      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <div className="mx-auto max-w-[1080px] px-5 pt-12 pb-14 md:pt-18 md:pb-20">
        <div className="max-w-[820px]">
          <p className="text-[.95rem] font-semibold text-amber-text">
            Antes de clicar, pagar ou responder
          </p>
          <h1 className="mt-3.5 text-[clamp(2.4rem,5.4vw,4rem)] font-bold pt-3 pb-3">
            Recebeu uma mensagem estranha? <span className="hl">Cole aqui</span> e veja se é golpe.
          </h1>
          <p className="mt-5 max-w-[58ch] text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-muted">
            O Desconfie lê a mensagem ou o link, aponta o que parece golpe e explica em palavras
            simples o que fazer em seguida. É de graça para quem recebe.
          </p>
          <ul className="mt-7 grid gap-3">
            {garantias.map((g) => (
              <li key={g} className="flex items-start gap-3 text-ink">
                <Check />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Como funciona */}
      <section className="py-14 md:py-18">
        <div className="mx-auto max-w-[1080px] px-5">
          <div className="mb-10 grid max-w-[760px] gap-3">
            <p className="text-[.95rem] font-semibold text-amber-text">Como funciona</p>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold">
              Três passos, menos de um minuto
            </h2>
          </div>
          <ol className="grid gap-5 md:grid-cols-3">
            {passos.map((p, i) => (
              <li key={p.titulo} className="grid content-start gap-2.5 rounded-card bg-surface p-7">
                <span className="mb-1.5 grid size-10 place-items-center rounded-full bg-amber text-[1.1rem] font-bold text-navy">
                  {i + 1}
                </span>
                <h3 className="text-[1.2rem] font-semibold">{p.titulo}</h3>
                <p className="text-muted">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Sinais */}
      <section className="bg-surface py-14 md:py-18">
        <div className="mx-auto max-w-[1080px] px-5">
          <div className="mb-10 grid max-w-[760px] gap-3">
            <p className="text-[.95rem] font-semibold text-amber-text">O que a gente procura</p>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold">
              Os sinais que mais aparecem em golpes
            </h2>
            <p className="max-w-[58ch] text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-muted">
              Cada sinal tem um peso. Um sinal crítico sozinho já basta para o alerta máximo.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sinais.map((s) => (
              <li key={s.codigo} className="grid content-start gap-1.5 rounded-[18px] bg-white p-[22px]">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-[1.2rem] font-semibold">{s.nome}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[.85rem] font-semibold tabular-nums ${
                      s.critico ? 'bg-danger-bg text-danger' : 'bg-warn-bg text-amber-text'
                    }`}
                  >
                    {s.peso}
                  </span>
                </div>
                <code className="font-mono text-[.72rem] text-muted">{s.codigo}</code>
                <p className="text-[.98rem] text-muted">{s.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Vereditos */}
      <section className="py-14 md:py-18">
        <div className="mx-auto max-w-[1080px] px-5">
          <div className="mb-10 grid max-w-[760px] gap-3">
            <p className="text-[.95rem] font-semibold text-amber-text">O resultado</p>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold">Três respostas possíveis</h2>
          </div>
          <ul className="grid gap-4 md:grid-cols-3">
            {vereditos.map((v) => (
              <li key={v.titulo} className={`grid content-start gap-2.5 rounded-card p-[26px] ${v.bg}`}>
                <span className="text-[.9rem] font-semibold text-muted">{v.faixa}</span>
                <h3 className={`text-[1.2rem] font-semibold ${v.fg}`}>{v.titulo}</h3>
                <p className="text-ink">{v.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-14 md:pb-18">
        <div className="mx-auto max-w-[1080px] px-5">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-surface p-10">
            <div>
              <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold">
                Dúvidas sobre como funciona?
              </h2>
              <p className="mt-2 text-muted">
                Explicamos os modelos, a regra de decisão e o que fazemos com os seus dados.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/sobre"
                className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-navy px-[26px] text-[1.05rem] font-semibold text-white no-underline transition-colors hover:bg-[#163a60]"
              >
                Conhecer o Desconfie
              </Link>
              <Link
                to="/faq"
                className="inline-flex min-h-[50px] items-center justify-center rounded-full px-[26px] text-[1.05rem] font-semibold text-navy no-underline transition-colors hover:bg-surface-2"
              >
                Ver perguntas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
