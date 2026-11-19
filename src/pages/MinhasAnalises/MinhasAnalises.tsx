import { useState } from 'react'
import { mensagemDeErro } from '../../api/api'
import { buscarAnalise, excluirAnalise, listarAnalisesDoUsuario } from '../../api/endpoints/analises'
import Button from '../../components/button/Button'
import CardVeredito from '../../components/analise/CardVeredito'
import Feedback from '../../components/analise/Feedback'
import SeloFaixa from '../../components/analise/SeloFaixa'
import EstadoCarga from '../../components/layout/EstadoCarga'
import PedirLogin from '../../components/layout/PedirLogin'
import { rotuloDoTipo } from '../../data/Analise/tipos'
import { useCarregar } from '../../hooks/useCarregar'
import { useSessao } from '../../hooks/useSessao'
import type { AnaliseResponse, Risco } from '../../types/Api/dtos'
import { dataHoraBr, notaBr } from '../../utils/formatar'

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

  return (
    <main>
      <div className={`${wrap} pt-18 pb-6`}>
        <p className={eyebrow}>Minhas análises</p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.4rem,5.4vw,4rem)] font-bold">
          O que você já mandou analisar
        </h1>
        <p className="mt-4.5 max-w-[58ch] text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-muted">
          Cada linha guarda o veredito, a nota e os sinais daquela mensagem. Serve para comparar: o
          mesmo golpe costuma voltar com outro texto.
        </p>
      </div>

      <section className="pb-18">
        <div className={`${wrap} grid gap-6`}>
          {usuario ? (
            <Historico usuarioId={usuario.id} />
          ) : (
            <PedirLogin texto="Suas análises ficam guardadas na sua conta. Entre para ver o histórico." />
          )}
        </div>
      </section>
    </main>
  )
}

function Historico({ usuarioId }: { usuarioId: number }) {
  const { dados, setDados, carregando, erro, recarregar } = useCarregar(
    () => listarAnalisesDoUsuario(usuarioId),
    usuarioId,
  )
  const [erroAcao, setErroAcao] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todas')
  /* Id da analise aberta. Uma por vez, para a lista nao virar uma parede de texto. */
  const [aberta, setAberta] = useState<number | null>(null)
  /* A lista so traz o resumo; o detalhe e buscado ao abrir e fica guardado aqui. */
  const [detalhes, setDetalhes] = useState<Record<number, AnaliseResponse>>({})

  const analises = dados ?? []
  const lista = filtro === 'todas' ? analises : analises.filter((a) => a.risco === filtro)

  const guardarDetalhe = (analise: AnaliseResponse) =>
    setDetalhes((atuais) => ({ ...atuais, [analise.id]: analise }))

  async function alternar(id: number) {
    if (aberta === id) return setAberta(null)
    setAberta(id)
    if (detalhes[id]) return
    try {
      guardarDetalhe(await buscarAnalise(id))
    } catch (e) {
      setErroAcao(mensagemDeErro(e))
    }
  }

  async function aoApagar(id: number) {
    if (!confirm('Apagar esta análise?')) return
    try {
      await excluirAnalise(id)
      setDados((atuais) => atuais?.filter((a) => a.id !== id))
      setAberta(null)
    } catch (e) {
      setErroAcao(mensagemDeErro(e))
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Grupo de filtro: um botao por risco, com aria-pressed dizendo qual esta ativo. */}
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
                  ativo ? 'bg-navy font-semibold text-white' : 'bg-surface font-medium text-muted hover:text-navy',
                ].join(' ')}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <Button to="/analisar">Analisar outra mensagem</Button>
      </div>

      <EstadoCarga
        carregando={carregando}
        erro={erro}
        recarregar={recarregar}
        texto="Carregando suas análises…"
      />
      {erroAcao && (
        <p role="alert" className="rounded-2xl bg-danger-bg p-4 text-ink">
          {erroAcao}
        </p>
      )}

      {dados && lista.length === 0 && (
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

      {lista.length > 0 && (
        <ul className="grid list-none gap-3 p-0">
          {lista.map((a) => {
            const expandida = aberta === a.id
            const detalhe = detalhes[a.id]
            return (
              <li key={a.id} className="rounded-[20px] bg-surface p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <SeloFaixa risco={a.risco} />
                  <span className="font-mono text-[.95rem] text-muted">nota {notaBr(a.notaFinal)}</span>
                  <span className="text-[.95rem] text-muted">
                    {rotuloDoTipo(a.tipo)} · {dataHoraBr(a.dataAnalise)}
                  </span>
                </div>

                <p className="mt-3 text-[1.02rem] text-ink">
                  {a.categoriaPrincipal ?? 'Nenhuma categoria de golpe identificada'}
                </p>

                {expandida && (
                  <div className="mt-4 grid gap-4">
                    {detalhe ? (
                      <>
                        <p className="whitespace-pre-wrap rounded-xl bg-white px-4 py-3 text-[1.02rem]">
                          {detalhe.conteudo}
                        </p>
                        <CardVeredito analise={detalhe} />
                        <Feedback analise={detalhe} aoResponder={guardarDetalhe} />
                        <Button
                          variante="secundario"
                          type="button"
                          onClick={() => void aoApagar(a.id)}
                          className="justify-self-start"
                        >
                          Apagar esta análise
                        </Button>
                      </>
                    ) : (
                      <p className="text-muted">Carregando detalhes…</p>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  aria-expanded={expandida}
                  onClick={() => void alternar(a.id)}
                  className="mt-3 flex min-h-11 items-center text-[.95rem] font-semibold text-navy"
                >
                  {expandida ? 'Fechar detalhes' : 'Ver detalhes'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
