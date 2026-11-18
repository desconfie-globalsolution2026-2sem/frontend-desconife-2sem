import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import CardVeredito from '../../components/analise/CardVeredito'
import MsgErro from '../../components/form/MsgErro'
import { canais } from '../../data/Analise/canais'
import { enviarAnalise, modoDemonstracao } from '../../api/analises'
import type { Analise } from '../../types/Analise/analise'
import { mascararDados } from '../../utils/mascarar'

const wrap = 'mx-auto max-w-[1080px] px-5'
const eyebrow = 'text-[.95rem] font-semibold text-amber-text'

/* Limite alto o suficiente para um e-mail inteiro, baixo o suficiente para nao
   mandar um livro para a API. */
const MAX = 2000
const MIN = 15

type Erros = {
  canal?: string
  mensagem?: string
  lgpd?: string
}

/* Uma rodada da conversa: o que foi enviado e o que voltou. O veredito e o erro
   nascem vazios porque chegam depois do await. */
interface Rodada {
  id: string
  canal: string
  mensagem: string
  analise?: Analise
  erro?: string
}

export default function Analisar() {
  const [rodadas, setRodadas] = useState<Rodada[]>([])
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [rascunho, setRascunho] = useState('')
  const [canal, setCanal] = useState('')
  const [lgpd, setLgpd] = useState(false)

  const fim = useRef<HTMLDivElement>(null)

  /* A conversa cresce para baixo: sem isso a rodada nova nasceria fora da vista. */
  useEffect(() => {
    if (rodadas.length > 0) fim.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [rodadas])

  function alterar(id: string, mudanca: Partial<Rodada>) {
    setRodadas((atuais) => atuais.map((r) => (r.id === id ? { ...r, ...mudanca } : r)))
  }

  /* Chama a API e escreve a resposta na rodada que a pediu. Serve tanto para o
     primeiro envio quanto para o "tentar de novo". */
  async function analisar(rodada: Rodada) {
    alterar(rodada.id, { erro: undefined, analise: undefined })
    setEnviando(true)
    try {
      const analise = await enviarAnalise({ canal: rodada.canal, mensagem: rodada.mensagem })
      alterar(rodada.id, { analise })
    } catch {
      alterar(rodada.id, {
        erro: 'Não conseguimos falar com o Desconfie agora. Tente de novo em instantes.',
      })
    } finally {
      setEnviando(false)
    }
  }

  /* Validacao propria: o noValidate desliga a do navegador para esta rodar. */
  function enviar() {
    const mensagem = rascunho.trim()
    const novos: Erros = {}

    if (canal === '') novos.canal = 'Diga por onde a mensagem chegou.'
    if (mensagem.length < MIN) novos.mensagem = `Cole a mensagem inteira: pelo menos ${MIN} caracteres.`
    else if (mensagem.length > MAX) novos.mensagem = `Passou de ${MAX} caracteres. Mande só o trecho da mensagem.`
    if (!lgpd) novos.lgpd = 'Marque a caixa para enviar.'

    setErros(novos)
    if (Object.keys(novos).length > 0) return

    /* A mensagem entra na conversa ja mascarada: assim o que esta na tela e
       exatamente o que saiu do navegador. */
    const rodada: Rodada = {
      id: crypto.randomUUID(),
      canal,
      mensagem: mascararDados(mensagem),
    }
    setRodadas((atuais) => [...atuais, rodada])
    setRascunho('')
    void analisar(rodada)
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
          antes de clicar. A análise leva alguns segundos e não precisa do seu nome.
        </p>
      </div>

      <section className="pt-6 pb-18">
        <div className={`${wrap} grid gap-3`}>
          <div className="flex flex-col overflow-hidden rounded-[28px] border border-line bg-surface">
            {/* A conversa. aria-live para o leitor de tela anunciar o veredito novo. */}
            <div
              aria-live="polite"
              className="grid max-h-[60vh] min-h-[420px] content-start gap-7 overflow-y-auto px-5 py-7 md:px-8"
            >
              {rodadas.length === 0 ? (
                <div className="grid content-start gap-4">
                  <p className={eyebrow}>Antes de colar</p>
                  <ul className="grid max-w-[62ch] list-none gap-3 p-0 text-[1.02rem] text-muted">
                    <li>
                      <strong className="text-ink">Cole o link também.</strong> Boa parte do peso da
                      nota vem do endereço, não do texto.
                    </li>
                    <li>
                      <strong className="text-ink">Mande a mensagem como chegou.</strong> Pressa,
                      ameaça e erro de português são sinais que o modelo usa.
                    </li>
                    <li>
                      <strong className="text-ink">Não clique para "conferir".</strong> Um clique já
                      entrega que o número existe.
                    </li>
                    <li>
                      <strong className="text-ink">Não escreva senha.</strong> CPF, cartão, telefone
                      e e-mail saem mascarados antes do envio.
                    </li>
                  </ul>
                  <p className="text-[.95rem] text-muted">
                    O veredito aparece aqui, abaixo da mensagem que você colar.
                  </p>
                </div>
              ) : (
                rodadas.map((r) => (
                  <div key={r.id} className="grid gap-4">
                    {/* O que foi enviado, alinhado a direita. */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-[22px] rounded-br-md bg-navy px-5 py-3.5 text-white">
                        <p className="text-[.85rem] font-semibold text-white/70">{r.canal}</p>
                        <p className="mt-1 whitespace-pre-wrap text-[1.05rem] leading-[1.45]">
                          {r.mensagem}
                        </p>
                      </div>
                    </div>

                    {/* O que voltou: veredito, falha de rede ou espera. */}
                    {r.analise ? (
                      <div className="grid gap-2">
                        <CardVeredito analise={r.analise} />
                        <p className="text-[.98rem] text-muted">
                          Essa análise já está em{' '}
                          <Link to="/minhas-analises" className="font-semibold text-navy">
                            minhas análises
                          </Link>
                          .
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
                          onClick={() => void analisar(r)}
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

            {/* Rodape do bloco: canal, mensagem e a autorizacao, tudo em um envio. */}
            <form
              noValidate
              onSubmit={aoEnviar}
              className="grid gap-3 border-t border-line bg-white px-5 py-5 md:px-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="canal" className="font-semibold text-navy">
                  Por onde chegou?
                </label>
                <select
                  id="canal"
                  name="canal"
                  value={canal}
                  onChange={(e) => setCanal(e.currentTarget.value)}
                  aria-invalid={!!erros.canal}
                  aria-describedby={erros.canal ? 'erro-canal' : undefined}
                  className={[
                    'min-h-11 rounded-full border bg-white px-4 text-[1rem] text-ink',
                    erros.canal ? 'border-danger' : 'border-line',
                  ].join(' ')}
                >
                  <option value="">Escolha o canal</option>
                  {canais.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <MsgErro id="erro-canal" texto={erros.canal} />
              </div>

              <div className="flex items-end gap-3">
                <label htmlFor="mensagem" className="sr-only">
                  A mensagem que você quer analisar
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  rows={3}
                  maxLength={MAX}
                  value={rascunho}
                  placeholder="Cole a mensagem aqui, com o link e tudo…"
                  onChange={(e) => setRascunho(e.currentTarget.value)}
                  onKeyDown={aoTeclar}
                  aria-invalid={!!erros.mensagem}
                  aria-describedby={erros.mensagem ? 'erro-mensagem' : 'contagem-mensagem'}
                  className={[
                    'max-h-[220px] min-h-[92px] w-full resize-y rounded-2xl border bg-white px-4 py-3 text-[1.05rem] text-ink',
                    erros.mensagem ? 'border-danger' : 'border-line',
                  ].join(' ')}
                />
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
                  <span id="contagem-mensagem" className="font-mono text-[.85rem] text-muted">
                    {rascunho.length}/{MAX}
                  </span>
                </div>
              </div>
            </form>
          </div>

          {modoDemonstracao() && (
            <p className="text-[.95rem] text-muted">
              Demonstração: a API de decisão ainda não está ligada, então a nota sai de uma regra
              local e as análises ficam só neste navegador.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
