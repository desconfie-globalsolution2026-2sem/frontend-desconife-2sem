import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErroApi, mensagemDeErro } from '../../api/api'
import { buscarAnalise, enviarFeedback, excluirAnalise } from '../../api/endpoints/analises'
import CardVeredito from '../../components/analise/CardVeredito'
import Button from '../../components/button/Button'
import { useSessao } from '../../hooks/useSessao'
import type { AnaliseResponse, Feedback } from '../../types/Api/dtos'
import { dataHoraBr, nomeDoTipo } from '../../utils/formatar'

const wrap = 'mx-auto max-w-[1080px] px-5'
const eyebrow = 'text-[.95rem] font-semibold text-amber-text'

const opcoesFeedback: { valor: Exclude<Feedback, 'SEM_FEEDBACK'>; label: string }[] = [
  { valor: 'ERA_GOLPE', label: 'Era golpe mesmo' },
  { valor: 'FALSO_ALARME', label: 'Era falso alarme' },
]

const textoFeedback: Record<Feedback, string> = {
  SEM_FEEDBACK: 'Você ainda não disse se era golpe.',
  ERA_GOLPE: 'Você marcou: era golpe mesmo.',
  FALSO_ALARME: 'Você marcou: era falso alarme.',
}

/* Estado da busca em um objeto so: a tela esta sempre em exatamente um deles. */
type Busca =
  | { fase: 'carregando' }
  | { fase: 'erro'; mensagem: string; naoExiste: boolean }
  | { fase: 'ok'; analise: AnaliseResponse }

/* /analises/:id — GET da analise, PUT do feedback e DELETE. */
export default function DetalheAnalise() {
  const { id } = useParams()
  const numero = Number(id)
  const idValido = Number.isInteger(numero) && numero > 0
  const { usuario } = useSessao()
  const navegar = useNavigate()

  const [busca, setBusca] = useState<Busca>({ fase: 'carregando' })
  const [tentativa, setTentativa] = useState(0)
  const [salvando, setSalvando] = useState(false)
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null)

  useEffect(() => {
    if (!idValido) return
    let ativo = true
    buscarAnalise(numero)
      .then((analise) => ativo && setBusca({ fase: 'ok', analise }))
      .catch(
        (e) =>
          ativo &&
          setBusca({
            fase: 'erro',
            mensagem: mensagemDeErro(e),
            naoExiste: e instanceof ErroApi && e.status === 404,
          }),
      )
    return () => {
      ativo = false
    }
  }, [numero, idValido, tentativa])

  function tentarDeNovo() {
    setBusca({ fase: 'carregando' })
    setTentativa((t) => t + 1)
  }

  async function aoDarFeedback(feedback: Feedback) {
    setSalvando(true)
    setAviso(null)
    try {
      const analise = await enviarFeedback(numero, feedback)
      setBusca({ fase: 'ok', analise })
      setAviso({ ok: true, texto: 'Obrigado! Seu retorno foi salvo e ajuda a melhorar a detecção.' })
    } catch (e) {
      setAviso({ ok: false, texto: mensagemDeErro(e) })
    } finally {
      setSalvando(false)
    }
  }

  async function aoExcluir() {
    if (!confirm('Excluir esta análise? Isso não pode ser desfeito.')) return
    setSalvando(true)
    setAviso(null)
    try {
      await excluirAnalise(numero)
      navegar('/minhas-analises')
    } catch (e) {
      setAviso({ ok: false, texto: mensagemDeErro(e) })
      setSalvando(false)
    }
  }

  const estado: Busca = idValido
    ? busca
    : { fase: 'erro', mensagem: 'Esse endereço não aponta para uma análise.', naoExiste: true }

  return (
    <main>
      <div className={`${wrap} pt-18 pb-6`}>
        <Link to="/minhas-analises" className="text-[.95rem] font-semibold text-navy">
          ← Minhas análises
        </Link>
        <p className={`${eyebrow} mt-6`}>Análise nº {idValido ? numero : '—'}</p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.2rem,5vw,3.4rem)] font-bold">
          O que o Desconfie encontrou
        </h1>
      </div>

      <section className="pb-18">
        <div className={`${wrap} grid gap-6`}>
          {estado.fase === 'carregando' && (
            <p role="status" className="rounded-2xl bg-surface p-5 text-muted">
              Carregando a análise…
            </p>
          )}

          {estado.fase === 'erro' && (
            <div role="alert" className="grid justify-items-start gap-3 rounded-2xl bg-danger-bg p-5">
              <p className="text-ink">
                <strong className="text-danger">
                  {estado.naoExiste ? 'Análise não encontrada.' : 'Não deu para carregar.'}
                </strong>{' '}
                {estado.mensagem}
              </p>
              {estado.naoExiste ? (
                <Button to="/minhas-analises">Ver minhas análises</Button>
              ) : (
                <Button type="button" onClick={tentarDeNovo}>
                  Tentar de novo
                </Button>
              )}
            </div>
          )}

          {estado.fase === 'ok' && (
            <Conteudo
              analise={estado.analise}
              dono={usuario?.id === estado.analise.usuarioId}
              salvando={salvando}
              aviso={aviso}
              aoDarFeedback={aoDarFeedback}
              aoExcluir={aoExcluir}
            />
          )}
        </div>
      </section>
    </main>
  )
}

interface PropsConteudo {
  analise: AnaliseResponse
  /* Feedback e exclusao so para quem mandou a analise. */
  dono: boolean
  salvando: boolean
  aviso: { ok: boolean; texto: string } | null
  aoDarFeedback: (feedback: Feedback) => void
  aoExcluir: () => void
}

function Conteudo({ analise, dono, salvando, aviso, aoDarFeedback, aoExcluir }: PropsConteudo) {
  return (
    <>
      <div className="grid gap-2 rounded-[22px] bg-navy px-5 py-4 text-white">
        <p className="text-[.85rem] font-semibold text-white/70">
          {nomeDoTipo[analise.tipo]} · {dataHoraBr(analise.dataAnalise)}
        </p>
        <p className="whitespace-pre-wrap break-words text-[1.05rem] leading-[1.45]">
          {analise.conteudo}
        </p>
      </div>

      <CardVeredito analise={analise} />

      {dono ? (
        <div className="grid gap-4 rounded-[28px] border border-line p-7">
          <h2 className="text-[1.3rem] font-semibold">E aí, era golpe?</h2>
          <p className="text-muted">{textoFeedback[analise.feedback]}</p>

          <div role="group" aria-label="Dizer se era golpe" className="flex flex-wrap gap-2">
            {opcoesFeedback.map((o) => {
              const marcado = analise.feedback === o.valor
              return (
                <button
                  key={o.valor}
                  type="button"
                  disabled={salvando}
                  aria-pressed={marcado}
                  onClick={() => aoDarFeedback(o.valor)}
                  className={[
                    'min-h-11 rounded-full border px-5 font-semibold transition-colors disabled:opacity-60',
                    marcado
                      ? 'border-navy bg-navy text-white'
                      : 'border-navy bg-white text-navy hover:bg-surface-2',
                  ].join(' ')}
                >
                  {o.label}
                </button>
              )
            })}
          </div>

          {aviso && (
            <p
              role={aviso.ok ? 'status' : 'alert'}
              className={`rounded-xl px-4 py-3 ${aviso.ok ? 'bg-safe-bg text-safe' : 'bg-danger-bg text-danger'}`}
            >
              {aviso.texto}
            </p>
          )}

          <div className="border-t border-line pt-4">
            <button
              type="button"
              disabled={salvando}
              onClick={aoExcluir}
              className="min-h-11 rounded-full px-4 font-semibold text-danger transition-colors hover:bg-danger-bg disabled:opacity-60"
            >
              Excluir esta análise
            </button>
          </div>
        </div>
      ) : (
        <p className="text-[.95rem] text-muted">
          Só quem mandou esta análise pode dizer se era golpe.{' '}
          <Link to="/entrar" className="font-semibold text-navy">
            Entrar
          </Link>
        </p>
      )}
    </>
  )
}
