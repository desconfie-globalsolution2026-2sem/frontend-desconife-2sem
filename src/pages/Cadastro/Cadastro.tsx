import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import CampoSenha from '../../components/form/CampoSenha'
import { classeCampo } from '../../components/form/classeCampo'
import { pedidos } from '../../data/Cadastro/pedidos'
import { useFormulario } from '../../hooks/useFormulario'
import { emailValido, marcado, mensagens, nivelSenha, senhaDe, textoDe } from '../../utils/validacoes'

const wrap = 'mx-auto max-w-[1080px] px-5'
const eyebrow = 'text-[.95rem] font-semibold text-amber-text'

type Erros = {
  nome?: string
  email?: string
  senha?: string
  conf?: string
  lgpd?: string
}

const coresForca = ['bg-surface-2', 'bg-danger', 'bg-amber', 'bg-safe']

/* Regras desta pagina. Fora do componente porque nao dependem de nada dele. */
function validar(dados: FormData): Erros {
  const novos: Erros = {}
  const nome = textoDe(dados, 'nome')
  const email = textoDe(dados, 'email')
  const senha = senhaDe(dados, 'senha')
  const conf = senhaDe(dados, 'conf')

  if (nome.length < 2) novos.nome = mensagens.nome
  if (!emailValido(email)) novos.email = mensagens.email
  if (senha.length < 8 || !/[a-zA-Z]/.test(senha) || !/\d/.test(senha))
    novos.senha = mensagens.senhaFraca
  if (conf === '' || conf !== senha) novos.conf = mensagens.senhasDiferentes
  if (!marcado(dados, 'lgpd')) novos.lgpd = 'Marque a caixa acima para criar a conta.'

  return novos
}

export default function Cadastro() {
  /* A barra de forca acende enquanto digita, entao o estado fica aqui.
     O hook zera ela quando o cadastro da certo e o formulario e limpo. */
  const [forca, setForca] = useState(0)
  const { erros, sucesso, aoEnviar } = useFormulario(validar, () => setForca(0))

  return (
    <main>
      <div className={`${wrap} grid items-start gap-10 pt-14 pb-18 md:grid-cols-[minmax(0,460px)_minmax(0,1fr)] md:gap-16`}>
        {/* Coluna da esquerda: o formulario */}
        <div className="grid gap-5">
          <p className={eyebrow}>Nova conta</p>
          <h1 className="text-[clamp(2rem,4vw,2.8rem)] font-bold">Criar sua conta</h1>
          <p className="-mt-1.5 max-w-[58ch] text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-muted">
            Leva menos de um minuto. Com a conta, suas análises ficam guardadas.
          </p>

          {/* noValidate desliga a validacao do navegador para a nossa rodar */}
          <form noValidate onSubmit={aoEnviar} className="grid gap-5 rounded-[28px] bg-surface p-7">
            <div className="grid gap-1.5">
              <label htmlFor="cad-nome" className="font-semibold text-navy">
                Seu nome
              </label>
              <input
                id="cad-nome"
                name="nome"
                autoComplete="name"
                aria-invalid={!!erros.nome}
                className={classeCampo(!!erros.nome)}
              />
              {erros.nome && (
                <span className="text-[.92rem] font-medium text-danger">{erros.nome}</span>
              )}
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="cad-email" className="font-semibold text-navy">
                E-mail
              </label>
              <span className="text-[.9rem] text-muted">É com ele que você entra.</span>
              <input
                id="cad-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                aria-invalid={!!erros.email}
                className={classeCampo(!!erros.email)}
              />
              {erros.email && (
                <span className="text-[.92rem] font-medium text-danger">{erros.email}</span>
              )}
            </div>

            <div className="grid gap-1.5">
              <CampoSenha
                id="cad-senha"
                name="senha"
                label="Senha"
                dica="Use pelo menos 8 caracteres, com letras e números."
                autoComplete="new-password"
                erro={erros.senha}
                onChange={(valor) => setForca(nivelSenha(valor))}
              />
              {/* Barra de forca: tres tracos que acendem conforme a senha melhora */}
              <div aria-hidden="true" className="grid grid-cols-3 gap-1.5">
                {[1, 2, 3].map((traco) => (
                  <span
                    key={traco}
                    className={`h-1.5 rounded-full ${traco <= forca ? coresForca[forca] : 'bg-surface-2'}`}
                  />
                ))}
              </div>
            </div>

            <CampoSenha
              id="cad-conf"
              name="conf"
              label="Repita a senha"
              autoComplete="new-password"
              erro={erros.conf}
            />

            <div className="grid gap-1.5">
              <label htmlFor="cad-lgpd" className="flex items-start gap-2.5 text-[.98rem]">
                <input
                  type="checkbox"
                  id="cad-lgpd"
                  name="lgpd"
                  aria-invalid={!!erros.lgpd}
                  className="mt-1 size-5 shrink-0 accent-navy"
                />
                <span>
                  Concordo que o Desconfie guarde meu nome, e-mail e o histórico das minhas
                  análises, com CPF, telefone e e-mail das mensagens mascarados.
                </span>
              </label>
              {erros.lgpd && (
                <span className="text-[.92rem] font-medium text-danger">{erros.lgpd}</span>
              )}
            </div>

            <Button type="submit" className="w-full">
              Criar conta
            </Button>

            {sucesso && (
              <p role="status" className="rounded-2xl bg-safe-bg p-4 text-ink">
                <strong className="text-safe">Conta criada nesta demonstração.</strong> No site
                final, a API Java grava o cadastro no Oracle e você já entra logado.{' '}
                <Link to="/entrar" className="font-semibold text-navy underline underline-offset-4">
                  Ir para o login
                </Link>
              </p>
            )}
          </form>

          <p className="text-[.95rem] text-muted">
            Já tem conta?{' '}
            <Link
              to="/entrar"
              className="font-semibold text-navy underline decoration-amber underline-offset-4"
            >
              Entrar
            </Link>
          </p>
        </div>

        {/* Coluna da direita: o que pedimos e por que */}
        <div className="grid content-start gap-6">
          <p className={eyebrow}>O que pedimos e por quê</p>

          <ul className="grid list-none p-0">
            {pedidos.map((p) => (
              <li
                key={p.termo}
                className="grid gap-1 border-b border-line py-4 last:border-b-0 sm:grid-cols-[120px_1fr] sm:gap-4"
              >
                <b className="text-navy">{p.termo}</b>
                <span className="text-[.98rem] text-muted">{p.texto}</span>
              </li>
            ))}
          </ul>

          <div className="grid gap-1.5 rounded-card bg-surface p-5.5">
            <h2 className="text-[1.2rem] font-semibold">Não pedimos CPF nem telefone</h2>
            <p className="text-[.98rem] text-muted">
              E nunca vamos pedir senha do banco, código do SMS ou dados do cartão. Se alguém pedir
              em nosso nome, é golpe.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
