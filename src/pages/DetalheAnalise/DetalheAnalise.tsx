import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErroApi, mensagemDeErro } from '../../services/api'
import { buscarAnalise, excluirAnalise } from '../../services/endpoints/analises'
import CardVeredito from '../../components/analise/CardVeredito'
import Feedback from '../../components/analise/Feedback'
import Button from '../../components/button/Button'
import EstadoCarga from '../../components/layout/EstadoCarga'
import { rotuloDoTipo } from '../../data/Analise/tipos'
import { useCarregar } from '../../hooks/useCarregar'
import { useSessao } from '../../hooks/useSessao'
import { dataHoraBr } from '../../utils/formatar'

const wrap = 'mx-auto max-w-[1080px] px-5'
const eyebrow = 'text-[.95rem] font-semibold text-amber-text'

/* /analises/:id — abre uma analise pelo id da URL (GET), recebe o feedback (PUT)
   e deixa quem mandou excluir (DELETE). */
export default function DetalheAnalise() {
  const { id } = useParams()
  const numero = Number(id)
  const idValido = Number.isInteger(numero) && numero > 0

  if (!idValido) {
    return <Moldura numero={null}><NaoAchou texto="Esse endereço não aponta para uma análise." /></Moldura>
  }
  /* key: trocar de /analises/1 para /analises/2 recomeça a tela do zero. */
  return <Carregada key={numero} numero={numero} />
}

function Carregada({ numero }: { numero: number }) {
  const { usuario } = useSessao()
  const navegar = useNavigate()
  const { dados: analise, setDados, carregando, erro, recarregar } = useCarregar(
    () => buscarAnalise(numero),
    numero,
  )
  const [excluindo, setExcluindo] = useState(false)
  const [erroExcluir, setErroExcluir] = useState('')

  /* useCarregar ja transforma o erro em texto; o 404 da API vem com essa frase. */
  const naoExiste = erro.includes('não encontrad')

  async function aoExcluir() {
    if (!confirm('Excluir esta análise? Isso não pode ser desfeito.')) return
    setExcluindo(true)
    setErroExcluir('')
    try {
      await excluirAnalise(numero)
      navegar('/minhas-analises')
    } catch (e) {
      setErroExcluir(e instanceof ErroApi ? e.message : mensagemDeErro(e))
      setExcluindo(false)
    }
  }

  const dono = !!analise && usuario?.id === analise.usuarioId

  return (
    <Moldura numero={numero}>
      {naoExiste ? (
        <NaoAchou texto={erro} />
      ) : (
        <EstadoCarga
          carregando={carregando}
          erro={erro}
          recarregar={recarregar}
          texto="Carregando a análise…"
        />
      )}

      {!carregando && analise && (
        <>
          <div className="grid gap-2 rounded-[22px] bg-navy px-5 py-4 text-white">
            <p className="text-[.85rem] font-semibold text-white/70">
              {rotuloDoTipo(analise.tipo)} · {dataHoraBr(analise.dataAnalise)}
            </p>
            <p className="whitespace-pre-wrap break-words text-[1.05rem] leading-[1.45]">
              {analise.conteudo}
            </p>
          </div>

          <CardVeredito analise={analise} />

          {dono ? (
            <div className="grid justify-items-start gap-4 rounded-[28px] border border-line p-7">
              <Feedback analise={analise} aoResponder={setDados} />
              <Button
                variante="secundario"
                type="button"
                disabled={excluindo}
                onClick={() => void aoExcluir()}
              >
                {excluindo ? 'Excluindo…' : 'Excluir esta análise'}
              </Button>
              {erroExcluir && (
                <p role="alert" className="text-danger">
                  {erroExcluir}
                </p>
              )}
            </div>
          ) : (
            <p className="text-[.95rem] text-muted">
              Só quem mandou esta análise pode dizer se era golpe ou excluí-la.{' '}
              {!usuario && (
                <Link to="/entrar" className="font-semibold text-navy">
                  Entrar
                </Link>
              )}
            </p>
          )}
        </>
      )}
    </Moldura>
  )
}

function Moldura({ numero, children }: { numero: number | null; children: ReactNode }) {
  return (
    <main>
      <div className={`${wrap} pt-18 pb-6`}>
        <Link to="/minhas-analises" className="text-[.95rem] font-semibold text-navy">
          ← Minhas análises
        </Link>
        <p className={`${eyebrow} mt-6`}>Análise nº {numero ?? '—'}</p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.2rem,5vw,3.4rem)] font-bold">
          O que o Desconfie encontrou
        </h1>
      </div>
      <section className="pb-18">
        <div className={`${wrap} grid gap-6`}>{children}</div>
      </section>
    </main>
  )
}

function NaoAchou({ texto }: { texto: string }) {
  return (
    <div role="alert" className="grid justify-items-start gap-3 rounded-2xl bg-danger-bg p-5">
      <p className="text-ink">
        <strong className="text-danger">Análise não encontrada.</strong> {texto}
      </p>
      <Button to="/minhas-analises">Ver minhas análises</Button>
    </div>
  )
}
