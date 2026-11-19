import Button from '../../components/button/Button'
import { classeCampo } from '../../components/form/classeCampo'
import { passosSocorro } from '../../data/Contato/passosSocorro'
import { useFormulario } from '../../hooks/useFormulario'
import { emailValido, marcado, mensagens, textoDe } from '../../utils/validacoes'

const wrap = 'mx-auto max-w-[1080px] px-5'
const eyebrow = 'text-[.95rem] font-semibold text-amber-text'

const assuntos = [
  'Dúvida sobre o resultado',
  'Quero enviar um golpe novo',
  'Parceria (banco, fintech, Procon)',
  'Outro assunto',
]

/* Uma chave por campo que pode ter erro */
type Erros = {
  nome?: string
  email?: string
  assunto?: string
  mensagem?: string
  lgpd?: string
}

function MsgErro({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null
  return (
    <span id={id} className="text-[.92rem] font-medium text-danger">
      {texto}
    </span>
  )
}

/* Regras desta pagina. Fora do componente porque nao dependem de nada dele. */
function validar(dados: FormData): Erros {
  const novos: Erros = {}
  const nome = textoDe(dados, 'nome')
  const email = textoDe(dados, 'email')
  const assunto = textoDe(dados, 'assunto')
  const mensagem = textoDe(dados, 'mensagem')

  if (nome.length < 2) novos.nome = mensagens.nome
  if (!emailValido(email)) novos.email = mensagens.email
  if (assunto === '') novos.assunto = 'Escolha um assunto.'
  if (mensagem.length < 10) novos.mensagem = 'Escreva pelo menos 10 caracteres.'
  if (!marcado(dados, 'lgpd')) novos.lgpd = 'Marque a caixa acima para enviar.'

  return novos
}

export default function Contato() {
  const { erros, sucesso, aoEnviar } = useFormulario(validar)

  return (
    <main>
      <div className={`${wrap} pt-18 pb-6`}>
        <p className={eyebrow}>Contato</p>
        <h1 className="mt-3 max-w-[20ch] text-[clamp(2.4rem,5.4vw,4rem)] font-bold">
          Fale com a gente
        </h1>
        <p className="mt-4.5 max-w-[58ch] text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-muted">
          Mande uma dúvida, uma sugestão ou um golpe novo que você recebeu. Se você já caiu em um
          golpe, veja ao lado o que fazer agora.
        </p>
      </div>

      <section className="py-18">
        <div className={`${wrap} grid gap-9 md:grid-cols-2 md:gap-14`}>
          {/* noValidate desliga a validacao do navegador para a nossa rodar */}
          <form noValidate onSubmit={aoEnviar} className="grid gap-5 rounded-[28px] bg-surface p-7">
            <div className="grid gap-1.5">
              <label htmlFor="nome" className="font-semibold text-navy">
                Seu nome
              </label>
              <input
                id="nome"
                name="nome"
                autoComplete="name"
                aria-invalid={!!erros.nome}
                aria-describedby={erros.nome ? 'erro-nome' : undefined}
                className={classeCampo(!!erros.nome)}
              />
              <MsgErro id="erro-nome" texto={erros.nome} />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="email" className="font-semibold text-navy">
                Seu e-mail
              </label>
              <span className="text-[.9rem] text-muted">Usamos só para responder.</span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!erros.email}
                aria-describedby={erros.email ? 'erro-email' : undefined}
                className={classeCampo(!!erros.email)}
              />
              <MsgErro id="erro-email" texto={erros.email} />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="assunto" className="font-semibold text-navy">
                Assunto
              </label>
              <select
                id="assunto"
                name="assunto"
                defaultValue=""
                aria-invalid={!!erros.assunto}
                aria-describedby={erros.assunto ? 'erro-assunto' : undefined}
                className={classeCampo(!!erros.assunto)}
              >
                <option value="">Escolha um assunto</option>
                {assuntos.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
              <MsgErro id="erro-assunto" texto={erros.assunto} />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="mensagem" className="font-semibold text-navy">
                Mensagem
              </label>
              <span className="text-[.9rem] text-muted">
                Não escreva senhas, CPF ou número de cartão.
              </span>
              <textarea
                id="mensagem"
                name="mensagem"
                aria-invalid={!!erros.mensagem}
                aria-describedby={erros.mensagem ? 'erro-mensagem' : undefined}
                className={`${classeCampo(!!erros.mensagem)} min-h-[140px] resize-y`}
              />
              <MsgErro id="erro-mensagem" texto={erros.mensagem} />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="lgpd" className="flex items-start gap-2.5 text-[.98rem]">
                <input
                  type="checkbox"
                  id="lgpd"
                  name="lgpd"
                  aria-invalid={!!erros.lgpd}
                  aria-describedby={erros.lgpd ? 'erro-lgpd' : undefined}
                  className="mt-1 size-5 shrink-0 accent-navy"
                />
                <span>
                  Concordo que o Desconfie use esses dados só para responder a esta mensagem.
                </span>
              </label>
              <MsgErro id="erro-lgpd" texto={erros.lgpd} />
            </div>

            <Button type="submit">
              Enviar mensagem
            </Button>

            {sucesso && (
              <p role="status" className="rounded-2xl bg-safe-bg p-4 text-ink">
                <strong className="text-safe">Mensagem enviada.</strong> Obrigado pelo contato!
              </p>
            )}

            <p className="text-[.95rem] text-muted">
              Outro canal: contato@desconfie.com.br · respondemos em até 2 dias úteis.
            </p>
          </form>

          {/* Caiu em um golpe */}
          <div className="grid content-start gap-4">
            <p className={eyebrow}>Caiu em um golpe? Faça isto agora</p>
            <ol className="grid">
              {passosSocorro.map((p, i) => (
                <li
                  key={p.titulo}
                  className="grid grid-cols-[auto_1fr] gap-4 border-b border-line py-5 last:border-b-0"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-navy font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[1.2rem] font-semibold">{p.titulo}</h3>
                    <p className="mt-1 text-[.98rem] text-muted">{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </main>
  )
}
