import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { mensagemDeErro } from '../../services/api'
import { analisar } from '../../services/endpoints/analises'
import CardVeredito from '../../components/analise/CardVeredito'
import EscolherImagem from '../../components/analise/EscolherImagem'
import Feedback from '../../components/analise/Feedback'
import MsgErro from '../../components/form/MsgErro'
import PedirLogin from '../../components/layout/PedirLogin'
import { rotuloDoTipo, tipos } from '../../data/Analise/tipos'
import { useSessao } from '../../hooks/useSessao'
import type { AnaliseRequest, AnaliseResponse, TipoAnalise } from '../../types/Api/dtos'
import { base64De, lerImagem, problemaNaImagem } from '../../utils/imagem'
import { mascararDados } from '../../utils/mascarar'

const wrap = 'mx-auto max-w-[1080px] px-5'
const eyebrow = 'text-[.95rem] font-semibold text-amber-text'

/* Limite alto o suficiente para um e-mail inteiro, baixo o suficiente para nao
   mandar um livro para a API. */
const MAX = 2000
const MIN = 15

type Erros = {
  mensagem?: string
  lgpd?: string
}

/* Uma rodada da conversa: o que foi enviado e o que voltou. O veredito e o erro
   nascem vazios porque chegam depois do await. */
interface Rodada {
  id: string
  tipo: TipoAnalise
  /* Texto ou link enviado; numa imagem, o nome do arquivo. */
  mensagem: string
  /* Data URL do print, so quando o tipo e IMAGEM. */
  imagem?: string
  analise?: AnaliseResponse
  erro?: string
}

interface Imagem {
  nome: string
  dataUrl: string
}

function pedidoDa(rodada: Rodada): AnaliseRequest {
  return rodada.imagem
    ? { tipo: 'IMAGEM', imagemBase64: base64De(rodada.imagem) }
    : { tipo: rodada.tipo, conteudo: rodada.mensagem }
}

export default function Analisar() {
  const { usuario } = useSessao()
  const [rodadas, setRodadas] = useState<Rodada[]>([])
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [rascunho, setRascunho] = useState('')
  const [imagem, setImagem] = useState<Imagem | null>(null)
  const [tipo, setTipo] = useState<TipoAnalise>('TEXTO')
  const [lgpd, setLgpd] = useState(false)

  const fim = useRef<HTMLDivElement>(null)

  /* O bloco cresce com a pagina, sem rolagem interna: a rodada nova fica abaixo
     da dobra, entao a propria pagina desce ate ela. */
  useEffect(() => {
    if (rodadas.length > 0) fim.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [rodadas])

  function alterar(id: string, mudanca: Partial<Rodada>) {
    setRodadas((atuais) => atuais.map((r) => (r.id === id ? { ...r, ...mudanca } : r)))
  }

  /* Chama a API e escreve a resposta na rodada que a pediu. Serve tanto para o
     primeiro envio quanto para o "tentar de novo". */
  async function buscarVeredito(rodada: Rodada) {
    if (!usuario) return
    alterar(rodada.id, { erro: undefined, analise: undefined })
    setEnviando(true)
    try {
      const analise = await analisar(usuario.id, pedidoDa(rodada))
      alterar(rodada.id, { analise })
    } catch (erro) {
      alterar(rodada.id, { erro: mensagemDeErro(erro) })
    } finally {
      setEnviando(false)
    }
  }

  /* Validacao propria: o noValidate desliga a do navegador para esta rodar. */
  function enviar() {
    const mensagem = rascunho.trim()
    const novos: Erros = {}

    if (tipo === 'IMAGEM') {
      if (!imagem) novos.mensagem = 'Escolha o print da mensagem.'
    } else if (tipo === 'LINK' && !/^\S+\.\S+$/.test(mensagem))
      novos.mensagem = 'Cole só o endereço do link, sem texto em volta.'
    else if (tipo === 'TEXTO' && mensagem.length < MIN)
      novos.mensagem = `Cole a mensagem inteira: pelo menos ${MIN} caracteres.`
    else if (mensagem.length > MAX) novos.mensagem = `Passou de ${MAX} caracteres. Mande só o trecho da mensagem.`
    if (!lgpd) novos.lgpd = 'Marque a caixa para enviar.'

    setErros(novos)
    if (Object.keys(novos).length > 0) return

    /* A mensagem entra na conversa ja mascarada: assim o que esta na tela e
       exatamente o que saiu do navegador. */
    const rodada: Rodada =
      tipo === 'IMAGEM' && imagem
        ? { id: crypto.randomUUID(), tipo, mensagem: imagem.nome, imagem: imagem.dataUrl }
        : { id: crypto.randomUUID(), tipo, mensagem: mascararDados(mensagem) }
    setRodadas((atuais) => [...atuais, rodada])
    setRascunho('')
    setImagem(null)
    void buscarVeredito(rodada)
  }

  async function aoEscolherImagem(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.currentTarget.files?.[0]
    evento.currentTarget.value = '' /* deixa escolher o mesmo arquivo de novo */
    if (!arquivo) return

    const problema = problemaNaImagem(arquivo)
    setErros((atuais) => ({ ...atuais, mensagem: problema }))
    if (problema) return

    setImagem({ nome: arquivo.name, dataUrl: await lerImagem(arquivo) })
  }

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    enviar()
  }

  /* Enter manda, Shift+Enter pula linha. Colar texto com varias linhas continua
     funcionando: paste nao passa por aqui. */
  function aoTeclar(evento: KeyboardEvent<HTMLTextAreaElement>) {
    if (evento.key === 'Enter' && !evento.shiftKey) {
      evento.preventDefault()
      enviar()
    }
  }

  return (
    <main>
      <div className={`${wrap} pt-18 pb-6`}>
        <p className={eyebrow}>Analisar</p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.4rem,5.4vw,4rem)] font-bold">
          Cole a mensagem e <span className="hl">desconfie</span> com dados
        </h1>
        <p className="mt-4.5 max-w-[58ch] text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] text-muted">
          Recebeu um SMS estranho, um link do banco ou um "oi mãe, troquei de número"? Cole aqui
          antes de clicar. A análise leva alguns segundos.
        </p>
      </div>

      <section className="pt-6 pb-18">
        <div className={`${wrap} grid gap-3`}>
          {!usuario ? (
            <PedirLogin texto="A análise fica guardada na sua conta, para você consultar depois e para avisar quem cuida de você se for golpe." />
          ) : (
            <div className="flex flex-col overflow-hidden rounded-[28px] border border-line bg-surface">
              {/* A conversa. aria-live para o leitor de tela anunciar o veredito novo. */}
              <div
                aria-live="polite"
                className="grid min-h-[420px] content-start gap-7 px-5 py-7 md:px-8"
              >
                {rodadas.length === 0 ? (
                  <div className="grid content-start gap-4">
                    <p className={eyebrow}>Antes de colar</p>
                    <p className="max-w-[58ch] text-[1.15rem] text-ink">
                      Quatro coisas mudam o resultado da análise:
                    </p>
                    <ul className="grid max-w-[62ch] list-none gap-3.5 p-0 text-[1.02rem] text-muted">
                      <li>
                        <strong className="text-ink">Cole o link junto.</strong> O endereço pesa mais
                        que o texto. É nele que aparece o domínio que imita o banco — e sem ele a
                        análise fica cega.
                      </li>
                      <li>
                        <strong className="text-ink">Não arrume a mensagem.</strong> A pressa, a ameaça
                        de bloqueio e o erro de português são a prova. Reescrever com suas palavras
                        apaga exatamente o que a gente procura.
                      </li>
                      <li>
                        <strong className="text-ink">Não clique para conferir.</strong> Abrir o link já
                        avisa ao golpista que o seu número está ativo. Cole aqui primeiro: é para isso
                        que esta tela existe.
                      </li>
                      <li>
                        <strong className="text-ink">Senha e código ficam com você.</strong> CPF,
                        cartão, telefone e e-mail saem mascarados daqui. Senha e código do banco
                        nenhuma análise precisa — apague antes de enviar.
                      </li>
                    </ul>
                    <p className="text-[.95rem] text-muted">
                      O veredito aparece aqui, logo abaixo da mensagem, com a nota e o que pesou nela.
                    </p>
                  </div>
                ) : (
                  rodadas.map((r) => (
                    <div key={r.id} className="grid gap-4">
                      {/* O que foi enviado, alinhado a direita. */}
                      <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-[22px] rounded-br-md bg-navy px-5 py-3.5 text-white">
                          <p className="text-[.85rem] font-semibold text-white/70">{rotuloDoTipo(r.tipo)}</p>
                          {r.imagem ? (
                            <img src={r.imagem} alt={`Print enviado: ${r.mensagem}`} className="mt-2 max-h-72 rounded-xl" />
                          ) : (
                            <p className="mt-1 whitespace-pre-wrap text-[1.05rem] leading-[1.45]">
                              {r.mensagem}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* O que voltou: veredito, falha de rede ou espera. */}
                      {r.analise ? (
                        <div className="grid gap-2">
                          {r.imagem && (
                            <p className="text-[.98rem] text-muted">
                              Texto que lemos no print: “{r.analise.conteudo}”
                            </p>
                          )}
                          <CardVeredito analise={r.analise} />
                          <Feedback analise={r.analise} aoResponder={(analise) => alterar(r.id, { analise })} />
                          <p className="text-[.98rem] text-muted">
                            Análise nº {r.analise.id} salva em{' '}
                            <Link to="/minhas-analises" className="font-semibold text-navy">
                              minhas análises
                            </Link>
                            {' · '}
                            <Link to={`/analises/${r.analise.id}`} className="font-semibold text-navy">
                              abrir a página dela
                            </Link>
                          </p>
                        </div>
                      ) : r.erro ? (
                        <div role="alert" className="grid justify-items-start gap-3 rounded-[28px] bg-danger-bg p-7">
                          <p className="text-ink">
                            <strong className="text-danger">Deu erro no envio.</strong> {r.erro}
                          </p>
                          <button
                            type="button"
                            disabled={enviando}
                            onClick={() => void buscarVeredito(r)}
                            className="min-h-11 rounded-full border border-navy bg-white px-4 font-semibold text-navy transition-colors hover:bg-surface-2 disabled:opacity-60"
                          >
                            Tentar de novo
                          </button>
                        </div>
                      ) : (
                        <p className="font-mono text-[1.02rem] text-muted">Analisando a mensagem…</p>
                      )}
                    </div>
                  ))
                )}

                <div ref={fim} />
              </div>

              {/* Rodape do bloco: tipo, mensagem e a autorizacao, tudo em um envio. */}
              <form
                noValidate
                onSubmit={aoEnviar}
                className="grid gap-3 border-t border-line bg-white px-5 py-5 md:px-8"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <label htmlFor="tipo" className="font-semibold text-navy">
                    O que você vai enviar?
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.currentTarget.value as TipoAnalise)}
                    className="min-h-11 rounded-full border border-line bg-white px-4 text-[1rem] text-ink"
                  >
                    {tipos.map((t) => (
                      <option key={t.valor} value={t.valor}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end gap-3">
                  {tipo === 'IMAGEM' ? (
                    <EscolherImagem
                      imagem={imagem}
                      invalido={!!erros.mensagem}
                      aoEscolher={(e) => void aoEscolherImagem(e)}
                    />
                  ) : (
                    <>
                      <label htmlFor="mensagem" className="sr-only">
                        A mensagem que você quer analisar
                      </label>
                      <textarea
                        id="mensagem"
                        name="mensagem"
                        rows={3}
                        maxLength={MAX}
                        value={rascunho}
                        placeholder={tipo === 'LINK' ? 'Cole o link aqui…' : 'Cole a mensagem aqui, com o link e tudo…'}
                        onChange={(e) => setRascunho(e.currentTarget.value)}
                        onKeyDown={aoTeclar}
                        aria-invalid={!!erros.mensagem}
                        aria-describedby={erros.mensagem ? 'erro-mensagem' : 'contagem-mensagem'}
                        className={[
                          'max-h-[220px] min-h-[92px] w-full resize-y rounded-2xl border bg-white px-4 py-3 text-[1.05rem] text-ink',
                          erros.mensagem ? 'border-danger' : 'border-line',
                        ].join(' ')}
                      />
                    </>
                  )}
                  {/* aria-busy avisa o leitor de tela de que o botao esta ocupado. */}
                  <button
                    type="submit"
                    disabled={enviando}
                    aria-busy={enviando}
                    aria-label="Analisar mensagem"
                    className="grid size-12 shrink-0 place-items-center rounded-full bg-navy text-[1.3rem] text-white transition-colors hover:bg-[#163a60] disabled:bg-surface-2 disabled:text-muted"
                  >
                    <span aria-hidden="true">↑</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                  <div className="grid gap-1.5">
                    <label htmlFor="lgpd" className="flex items-start gap-2.5 text-[.95rem]">
                      <input
                        type="checkbox"
                        id="lgpd"
                        name="lgpd"
                        checked={lgpd}
                        onChange={(e) => setLgpd(e.currentTarget.checked)}
                        aria-invalid={!!erros.lgpd}
                        aria-describedby={erros.lgpd ? 'erro-lgpd' : undefined}
                        className="mt-0.5 size-5 shrink-0 accent-navy"
                      />
                      <span className="max-w-[62ch] text-muted">
                        Concordo que o Desconfie guarde esta mensagem, já sem dados pessoais, para
                        gerar a análise e melhorar a detecção.
                      </span>
                    </label>
                    <MsgErro id="erro-lgpd" texto={erros.lgpd} />
                  </div>

                  <div className="ml-auto grid justify-items-end gap-1">
                    <MsgErro id="erro-mensagem" texto={erros.mensagem} />
                    {tipo !== 'IMAGEM' && (
                      <span id="contagem-mensagem" className="font-mono text-[.85rem] text-muted">
                        {rascunho.length}/{MAX}
                      </span>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
