import { useEffect, useState } from 'react'
import Button from '../../components/button/Button'
import SeloFaixa from '../../components/analise/SeloFaixa'
import { apagarAnalises, listarAnalises, modoDemonstracao } from '../../services/analises'
import type { Analise, Faixa } from '../../types/Analise/analise'
import { dataHoraBr, notaBr, pesoBr } from '../../utils/formatar'

const wrap = 'mx-auto max-w-[1080px] px-5'
const eyebrow = 'text-[.95rem] font-semibold text-amber-text'

/* 'todas' nao e uma faixa da API: e so a opcao do filtro desta tela. */
type Filtro = Faixa | 'todas'

const filtros: { valor: Filtro; label: string }[] = [
  { valor: 'todas', label: 'Todas' },
  { valor: 'golpe', label: 'Muito provável golpe' },
  { valor: 'suspeito', label: 'Suspeito' },
  { valor: 'seguro', label: 'Sem sinais' },
]

export default function MinhasAnalises() {
  const [analises, setAnalises] = useState<Analise[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todas')
  /* Id da analise aberta. Uma por vez, para a lista nao virar uma parede de texto. */
  const [aberta, setAberta] = useState<string | null>(null)

  const MSG_ERRO = 'Não conseguimos carregar suas análises agora.'

  /* Busca na montagem. O estado so muda depois do await, nunca no corpo do
     efeito, e 'ativo' impede setState depois de a tela sair do ar. */
  useEffect(() => {
    let ativo = true
    listarAnalises()
      .then((lista) => ativo && setAnalises(lista))
      .catch(() => ativo && setErro(MSG_ERRO))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [])

  /* Recarga pedida pelo usuario: botao de tentar de novo e depois de apagar. */
  async function recarregar() {
    setCarregando(true)
    setErro('')
    try {
      setAnalises(await listarAnalises())
    } catch {
      setErro(MSG_ERRO)
    } finally {
      setCarregando(false)
    }
  }

  async function aoApagar() {
    if (!confirm('Apagar todas as análises deste navegador?')) return
    await apagarAnalises()
    await recarregar()
  }

  const lista = filtro === 'todas' ? analises : analises.filter((a) => a.faixa === filtro)

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
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Grupo de filtro: um botao por faixa, com aria-pressed dizendo qual esta ativo. */}
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

          {erro && (
            <div role="alert" className="grid justify-items-start gap-3 rounded-2xl bg-danger-bg p-5">
              <p className="text-ink">
                <strong className="text-danger">Deu erro.</strong> {erro}
              </p>
              <Button type="button" onClick={() => void recarregar()}>
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

          {lista.length > 0 && (
            <ul className="grid list-none gap-3 p-0">
              {lista.map((a) => {
                const expandida = aberta === a.id
                return (
                  <li key={a.id} className="rounded-[20px] bg-surface p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <SeloFaixa faixa={a.faixa} />
                      <span className="font-mono text-[.95rem] text-muted">
                        nota {notaBr(a.nota)}
                      </span>
                      <span className="text-[.95rem] text-muted">
                        {a.canal} · {dataHoraBr(a.criadoEm)}
                      </span>
                    </div>

                    <p
                      className={[
                        'mt-3 text-[1.02rem] text-ink',
                        /* Fechada, a mensagem fica em duas linhas; aberta, inteira. */
                        expandida ? '' : 'line-clamp-2',
                      ].join(' ')}
                    >
                      {a.mensagem}
                    </p>

                    {expandida && (
                      <div className="mt-4">
                        <h3 className="text-[1.02rem] font-semibold">Sinais encontrados</h3>
                        {a.sinais.length > 0 ? (
                          <ul className="mt-2 grid list-none gap-2 p-0">
                            {a.sinais.map((s) => (
                              <li
                                key={s.codigo}
                                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-4 py-2.5"
                              >
                                <span className="font-medium">{s.nome}</span>
                                <span className="font-mono text-[.92rem] text-muted">
                                  {s.critico ? 'crítico' : pesoBr(s.peso)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-1 text-[.98rem] text-muted">
                            Nenhum sinal de golpe nesta mensagem.
                          </p>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      aria-expanded={expandida}
                      onClick={() => setAberta(expandida ? null : a.id)}
                      className="mt-3 flex min-h-11 items-center text-[.95rem] font-semibold text-navy"
                    >
                      {expandida ? 'Fechar detalhes' : 'Ver detalhes'}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          {modoDemonstracao() && analises.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
              <p className="text-[.95rem] text-muted">
                Demonstração: estas análises estão salvas só neste navegador.
              </p>
              <Button variante="secundario" type="button" onClick={() => void aoApagar()}>
                Apagar tudo
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
