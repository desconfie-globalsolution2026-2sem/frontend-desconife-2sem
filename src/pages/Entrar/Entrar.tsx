import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import CampoSenha from '../../components/form/CampoSenha'
import { vantagens } from '../../data/Entrar/vantagens'

const wrap = 'mx-auto max-w-[1080px] px-5'
const eyebrow = 'text-[.95rem] font-semibold text-amber-text'

type Erros = {
  email?: string
  senha?: string
}

function campo(temErro: boolean) {
  return [
    'min-h-[50px] w-full rounded-xl border bg-white px-4 py-3 text-[1.05rem] text-ink',
    temErro ? 'border-danger' : 'border-line',
  ].join(' ')
}

/* Os tres icones da coluna da direita */
const icones = {
  relogio: (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  check: (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  alerta: (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l10 18H2L12 3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 10v5M12 18v.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
}

export default function Entrar() {
  const [erros, setErros] = useState<Erros>({})
  const [entrou, setEntrou] = useState(false)
  const [mostrarEsqueci, setMostrarEsqueci] = useState(false)

  function validar(dados: FormData): Erros {
    const novos: Erros = {}
    const email = String(dados.get('email') ?? '').trim()
    const senha = String(dados.get('senha') ?? '')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      novos.email = 'Esse e-mail parece incompleto. Confira se tem @ e um ponto depois.'
    if (senha.length < 6) novos.senha = 'A senha tem pelo menos 6 caracteres.'

    return novos
  }

  function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const form = evento.currentTarget
    const novos = validar(new FormData(form))
    setErros(novos)

    if (Object.keys(novos).length === 0) {
      setEntrou(true)
      form.reset()
    } else {
      setEntrou(false)
    }
  }

  return (
    <main>
      <div className={`${wrap} grid items-start gap-10 pt-14 pb-18 md:grid-cols-[minmax(0,460px)_minmax(0,1fr)] md:gap-16`}>
        {/* Coluna da esquerda: o formulario */}
        <div className="grid gap-5">
          <p className={eyebrow}>Sua conta</p>
          <h1 className="text-[clamp(2rem,4vw,2.8rem)] font-bold">Entrar no Desconfie</h1>
          <p className="-mt-1.5 max-w-[58ch] text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-muted">
            Veja suas análises anteriores e conte pra gente se era golpe mesmo.
          </p>

          {/* noValidate desliga a validacao do navegador para a nossa rodar */}
          <form noValidate onSubmit={aoEnviar} className="grid gap-5 rounded-[28px] bg-surface p-7">
            <div className="grid gap-1.5">
              <label htmlFor="login-email" className="font-semibold text-navy">
                E-mail
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                aria-invalid={!!erros.email}
                className={campo(!!erros.email)}
              />
              {erros.email && (
                <span className="text-[.92rem] font-medium text-danger">{erros.email}</span>
              )}
            </div>

            <CampoSenha
              id="login-senha"
              name="senha"
              label="Senha"
              autoComplete="current-password"
              erro={erros.senha}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label htmlFor="lembrar" className="flex items-start gap-2.5 text-[.98rem]">
                <input type="checkbox" id="lembrar" name="lembrar" className="mt-1 size-5 shrink-0 accent-navy" />
                <span>Manter conectado</span>
              </label>
              <button
                type="button"
                onClick={() => setMostrarEsqueci(!mostrarEsqueci)}
                className="min-h-11 py-2 text-[.98rem] font-semibold text-navy underline decoration-amber underline-offset-4"
              >
                Esqueci a senha
              </button>
            </div>

            {mostrarEsqueci && (
              <p role="status" className="rounded-2xl bg-white p-4 text-[.98rem] text-ink">
                Digite seu e-mail acima. No site final, enviamos um link para você criar uma senha
                nova.
              </p>
            )}

            <Button type="submit" className="w-full">
              Entrar
            </Button>

            {entrou && (
              <p role="status" className="rounded-2xl bg-safe-bg p-4 text-ink">
                <strong className="text-safe">Login feito nesta demonstração.</strong> No site
                final, a API Java confere o e-mail e a senha e abre o seu histórico.
              </p>
            )}

            <div className="flex items-center gap-3.5 text-[.92rem] text-muted before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
              ou
            </div>

            <Button to="/" variante="secundario" className="w-full bg-white shadow-[inset_0_0_0_1px_var(--color-line)]">
              Continuar sem conta
            </Button>
          </form>

          <p className="text-[.95rem] text-muted">
            Ainda não tem conta?{' '}
            <Link
              to="/cadastro"
              className="font-semibold text-navy underline decoration-amber underline-offset-4"
            >
              Criar conta
            </Link>
          </p>
        </div>

        {/* Coluna da direita: por que ter uma conta */}
        <div className="grid content-start gap-6">
          <p className={eyebrow}>Por que ter uma conta</p>

          <div className="grid">
            {vantagens.map((v) => (
              <div
                key={v.titulo}
                className="grid grid-cols-[auto_1fr] gap-4 border-b border-line py-5 last:border-b-0"
              >
                <span
                  aria-hidden="true"
                  className="grid size-10 place-items-center rounded-xl bg-amber text-navy"
                >
                  {icones[v.icone]}
                </span>
                <div>
                  <h2 className="text-[1.2rem] font-semibold">{v.titulo}</h2>
                  <p className="mt-1 text-[.98rem] text-muted">{v.texto}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-1.5 rounded-card bg-surface p-5.5">
            <h2 className="text-[1.2rem] font-semibold">Não quer criar conta?</h2>
            <p className="text-[.98rem] text-muted">
              Tudo bem. A análise funciona sem login. A conta só serve para guardar o histórico.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
