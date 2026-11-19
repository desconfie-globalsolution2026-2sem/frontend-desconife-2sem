import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { mensagemDeErro } from '../../services/api'
import { atualizarUsuario, excluirUsuario } from '../../services/endpoints/usuarios'
import Button from '../../components/button/Button'
import { classeCampo } from '../../components/form/classeCampo'
import PedirLogin from '../../components/layout/PedirLogin'
import { useFormulario } from '../../hooks/useFormulario'
import { useSessao } from '../../hooks/useSessao'
import { emailValido, mensagens, textoDe } from '../../utils/validacoes'

const wrap = 'mx-auto max-w-[1080px] px-5'
const eyebrow = 'text-[.95rem] font-semibold text-amber-text'

type Erros = {
  nome?: string
  email?: string
  telefone?: string
}

/* Telefone e opcional; se vier, precisa ter DDD + numero (10 ou 11 digitos). */
function soDigitos(valor: string) {
  return valor.replace(/\D/g, '')
}

function validar(dados: FormData): Erros {
  const novos: Erros = {}
  const telefone = soDigitos(textoDe(dados, 'telefone'))

  /* A API pede nome com pelo menos 3 letras. */
  if (textoDe(dados, 'nome').length < 3) novos.nome = mensagens.nome
  if (!emailValido(textoDe(dados, 'email'))) novos.email = mensagens.email
  if (telefone && (telefone.length < 10 || telefone.length > 11))
    novos.telefone = 'Escreva o telefone com DDD, só números. Ex.: 11 91234-5678.'

  return novos
}

/*
 * Minha conta: editar nome, e-mail e telefone (PUT /usuarios/{id}) e excluir
 * a conta (DELETE /usuarios/{id}). A API nao deixa excluir quem ainda tem
 * analises guardadas; nesse caso a tela explica e manda para o historico.
 */
export default function MinhaConta() {
  const { usuario, atualizar, sair } = useSessao()
  const navegar = useNavigate()
  const [confirmando, setConfirmando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExcluir, setErroExcluir] = useState('')

  const { erros, sucesso, enviando, erroEnvio, aoEnviar } = useFormulario(validar, async (dados) => {
    if (!usuario) return
    const telefone = soDigitos(textoDe(dados, 'telefone'))
    const novo = await atualizarUsuario(usuario.id, {
      nome: textoDe(dados, 'nome'),
      email: textoDe(dados, 'email'),
      telefone: telefone || undefined,
    })
    atualizar(novo)
  })

  async function aoExcluir() {
    if (!usuario) return
    setExcluindo(true)
    setErroExcluir('')
    try {
      await excluirUsuario(usuario.id)
      sair()
      navegar('/')
    } catch (erro) {
      setErroExcluir(mensagemDeErro(erro))
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <main>
      <div className={`${wrap} pt-18 pb-6`}>
        <p className={eyebrow}>Minha conta</p>
        <h1 className="mt-3 text-[clamp(2.2rem,5vw,3.4rem)] font-bold">Seus dados</h1>
        <p className="mt-4 max-w-[58ch] text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-muted">
          Confira e corrija o que a gente guarda sobre você. Se não quiser mais usar o Desconfie, dá
          para excluir a conta aqui também.
        </p>
      </div>

      <section className="pb-18">
        <div className={`${wrap} grid items-start gap-6 md:grid-cols-[minmax(0,520px)_minmax(0,1fr)]`}>
          {!usuario ? (
            <PedirLogin texto="Entre para ver e editar os dados da sua conta." />
          ) : (
            <>
              {/* A key remonta o form quando os dados mudam, para os campos mostrarem o valor salvo. */}
              <form
                key={`${usuario.nome}|${usuario.email}|${usuario.telefone ?? ''}`}
                noValidate
                onSubmit={aoEnviar}
                className="grid gap-5 rounded-[28px] bg-surface p-7"
              >
                <h2 className="text-[1.4rem] font-semibold">Editar dados</h2>

                <div className="grid gap-1.5">
                  <label htmlFor="conta-nome" className="font-semibold text-navy">
                    Seu nome
                  </label>
                  <input
                    id="conta-nome"
                    name="nome"
                    autoComplete="name"
                    defaultValue={usuario.nome}
                    aria-invalid={!!erros.nome}
                    className={classeCampo(!!erros.nome)}
                  />
                  {erros.nome && <span className="text-[.92rem] font-medium text-danger">{erros.nome}</span>}
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="conta-email" className="font-semibold text-navy">
                    E-mail
                  </label>
                  <span className="text-[.9rem] text-muted">É com ele que você entra.</span>
                  <input
                    id="conta-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    defaultValue={usuario.email}
                    aria-invalid={!!erros.email}
                    className={classeCampo(!!erros.email)}
                  />
                  {erros.email && <span className="text-[.92rem] font-medium text-danger">{erros.email}</span>}
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="conta-telefone" className="font-semibold text-navy">
                    Telefone <span className="font-normal text-muted">(opcional)</span>
                  </label>
                  <input
                    id="conta-telefone"
                    name="telefone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    defaultValue={usuario.telefone ?? ''}
                    aria-invalid={!!erros.telefone}
                    className={classeCampo(!!erros.telefone)}
                  />
                  {erros.telefone && (
                    <span className="text-[.92rem] font-medium text-danger">{erros.telefone}</span>
                  )}
                </div>

                <Button type="submit" disabled={enviando} aria-busy={enviando} className="w-full disabled:opacity-60">
                  {enviando ? 'Salvando…' : 'Salvar alterações'}
                </Button>

                {sucesso && (
                  <p role="status" className="rounded-2xl bg-safe-bg p-4 text-ink">
                    <strong className="text-safe">Dados salvos.</strong>
                  </p>
                )}
                {erroEnvio && (
                  <p role="alert" className="rounded-2xl bg-danger-bg p-4 text-ink">
                    <strong className="text-danger">Não deu para salvar.</strong> {erroEnvio}
                  </p>
                )}
              </form>

              <div className="grid gap-4 rounded-[28px] border border-line p-7">
                <h2 className="text-[1.4rem] font-semibold">Excluir conta</h2>
                <p className="text-muted">
                  Apaga seu cadastro do Desconfie. Antes, exclua as análises guardadas em{' '}
                  <Link to="/minhas-analises" className="font-semibold text-navy underline decoration-amber underline-offset-4">
                    Minhas análises
                  </Link>
                  : enquanto houver histórico, a conta não pode ser excluída.
                </p>

                {!confirmando ? (
                  <button
                    type="button"
                    onClick={() => setConfirmando(true)}
                    className="justify-self-start rounded-full border border-danger px-5 py-3 font-semibold text-danger transition-colors hover:bg-danger-bg"
                  >
                    Excluir minha conta
                  </button>
                ) : (
                  <div role="alertdialog" aria-labelledby="conf-excluir" className="grid gap-3 rounded-2xl bg-danger-bg p-5">
                    <p id="conf-excluir" className="font-semibold text-ink">
                      Tem certeza? Isso não tem volta.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={aoExcluir}
                        disabled={excluindo}
                        aria-busy={excluindo}
                        className="rounded-full bg-danger px-5 py-3 font-semibold text-white disabled:opacity-60"
                      >
                        {excluindo ? 'Excluindo…' : 'Sim, excluir'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmando(false)
                          setErroExcluir('')
                        }}
                        className="rounded-full px-5 py-3 font-semibold text-navy hover:bg-white/60"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {erroExcluir && (
                  <p role="alert" className="rounded-2xl bg-danger-bg p-4 text-ink">
                    <strong className="text-danger">Não deu para excluir.</strong> {erroExcluir}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
