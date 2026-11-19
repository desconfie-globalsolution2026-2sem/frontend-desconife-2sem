import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { mensagemDeErro } from '../../api/api'
import { listarAnalisesDoUsuario } from '../../api/endpoints/analises'
import PedirLogin from '../../components/analise/PedirLogin'
import SeloFaixa from '../../components/analise/SeloFaixa'
import Button from '../../components/button/Button'
import { useSessao } from '../../hooks/useSessao'
import type { AnaliseResumoResponse, Risco } from '../../types/Api/dtos'
import { dataHoraBr, nomeDoTipo, notaBr } from '../../utils/formatar'

const wrap = 'mx-auto max-w-[1080px] px-5'
const eyebrow = 'text-[.95rem] font-semibold text-amber-text'

/* 'todas' nao e um risco da API: e so a opcao do filtro desta tela. */
type Filtro = Risco | 'todas'

const filtros: { valor: Filtro; label: string }[] = [
  { valor: 'todas', label: 'Todas' },
  { valor: 'VERMELHO', label: 'Muito provável golpe' },
  { valor: 'AMARELO', label: 'Suspeito' },
  { valor: 'VERDE', label: 'Sem sinais' },
]

export default function MinhasAnalises() {
  const { usuario } = useSessao()
  const usuarioId = usuario?.id
  const [analises, setAnalises] = useState<AnaliseResumoResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todas')

  const [tentativa, setTentativa] = useState(0)

  /* GET /usuarios/{id}/analises. A API ja devolve da mais nova para a mais antiga.
     O estado so muda depois do await, e 'ativo' ignora a resposta se a tela saiu. */
  useEffect(() => {
    if (usuarioId === undefined) return
    let ativo = true
    listarAnalisesDoUsuario(usuarioId)
      .then((lista) => ativo && setAnalises(lista))
      .catch((e) => ativo && setErro(mensagemDeErro(e)))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [usuarioId, tentativa])

  /* Botao "tentar de novo": volta ao carregando e dispara o efeito outra vez. */
  function carregar() {
    setCarregando(true)
    setErro('')
    setTentativa((t) => t + 1)
  }

  const lista = filtro === 'todas' ? analises : analises.filter((a) => a.risco === filtro)

  return (
    <main>
      <div className={`${wrap} pt-18 pb-6`}>
        <p className={eyebrow}>Minhas análises</p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.4rem,5.4vw,4rem)] font-bold">
          O que você já mandou analisar
        </h1>
        <p className="mt-4.5 max-w-[58ch] text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-muted">
          Cada linha guarda o veredito e a nota daquela mensagem. Abra uma para ver o que pesou e
          contar se era golpe mesmo.
        </p>
      </div>

      <section className="pb-18">
        <div className={`${wrap} grid gap-6`}>
          {!usuario ? (
            <PedirLogin texto="Suas análises ficam guardadas na sua conta. Entre para ver o histórico." />
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Um botao por risco, com aria-pressed dizendo qual esta ativo. */}
                <div role="group" aria-label="Filtrar por veredito" className="flex flex-wrap gap-1.5">
                  {filtros.map((f) => {
                    const ativo = filtro === f.valor
                    return (
                      <button
                        key={f.valor}
                        type="button"
                        aria-pressed={ativo}
                        onClick={() => setFiltro(f.valor)}
                        className={[
                          'flex min-h-11 items-center rounded-full px-4 text-[.95rem] transition-colors',
                          ativo
                            ? 'bg-navy font-semibold text-white'
                            : 'bg-surface font-medium text-muted hover:text-navy',
                        ].join(' ')}
                      >
                        {f.label}
                      </button>
                    )
                  })}
                </div>

                <Button to="/analisar">Analisar outra mensagem</Button>
              </div>

              {carregando && (
                <p role="status" className="rounded-2xl bg-surface p-5 text-muted">
                  Carregando suas análises…
                </p>
              )}

              {!carregando && erro && (
                <div role="alert" className="grid justify-items-start gap-3 rounded-2xl bg-danger-bg p-5">
                  <p className="text-ink">
                    <strong className="text-danger">Não deu para carregar.</strong> {erro}
                  </p>
                  <Button type="button" onClick={carregar}>
                    Tentar de novo
                  </Button>
                </div>
              )}

              {!carregando && !erro && lista.length === 0 && (
                <div className="grid justify-items-start gap-4 rounded-[28px] border border-line p-7">
                  <h2 className="text-[1.4rem] font-semibold">
                    {analises.length === 0 ? 'Nada analisado ainda' : 'Nenhuma análise nesse veredito'}
                  </h2>
                  <p className="max-w-[52ch] text-muted">
                    {analises.length === 0
                      ? 'Quando você mandar uma mensagem para análise, ela aparece aqui com o veredito.'
                      : 'Troque o filtro acima para ver as outras análises.'}
                  </p>
                  {analises.length === 0 && <Button to="/analisar">Analisar uma mensagem</Button>}
                </div>
              )}

              {!carregando && !erro && lista.length > 0 && (
                <ul className="grid list-none gap-3 p-0">
                  {lista.map((a) => (
                    <li key={a.id}>
                      <Link
                        to={`/analises/${a.id}`}
                        className="flex flex-wrap items-center gap-3 rounded-[20px] bg-surface p-5 no-underline transition-colors hover:bg-surface-2"
                      >
                        <SeloFaixa risco={a.risco} />
                        <span className="font-mono text-[.95rem] text-muted">
                          nota {notaBr(a.notaFinal)}
                        </span>
                        <span className="text-[.95rem] text-muted">
                          {nomeDoTipo[a.tipo]} · {dataHoraBr(a.dataAnalise)}
                        </span>
                        {a.categoriaPrincipal && (
                          <span className="text-[.95rem] font-medium text-ink">
                            {a.categoriaPrincipal}
                          </span>
                        )}
                        <span className="ml-auto text-[.95rem] font-semibold text-navy">
                          Ver detalhes →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
