import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import CardVeredito from '../../components/analise/CardVeredito'
import MsgErro from '../../components/form/MsgErro'
import { classeCampo } from '../../components/form/classeCampo'
import { canais } from '../../data/Analise/canais'
import { enviarAnalise, modoDemonstracao } from '../../api/analises'
import type { Analise } from '../../types/Analise/analise'
import { marcado, textoDe } from '../../utils/validacoes'

const wrap = 'mx-auto max-w-[1080px] px-5'
const eyebrow = 'text-[.95rem] font-semibold text-amber-text'

/* Limite alto o suficiente para um e-mail inteiro, baixo o suficiente para nao
   mandar um livro para a API. */
const MAX = 2000

type Erros = {
  canal?: string
  mensagem?: string
  lgpd?: string
}

/* Regras desta pagina. Fora do componente porque nao dependem de nada dele. */
function validar(dados: FormData): Erros {
  const novos: Erros = {}
  const canal = textoDe(dados, 'canal')
  const mensagem = textoDe(dados, 'mensagem')

  if (canal === '') novos.canal = 'Diga por onde a mensagem chegou.'
  if (mensagem.length < 15) novos.mensagem = 'Cole a mensagem inteira: pelo menos 15 caracteres.'
  else if (mensagem.length > MAX) novos.mensagem = `Passou de ${MAX} caracteres. Mande só o trecho da mensagem.`
  if (!marcado(dados, 'lgpd')) novos.lgpd = 'Marque a caixa acima para enviar.'

  return novos
}

export default function Analisar() {
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<Analise | null>(null)
  /* Falha de rede nao e erro de campo: entra separado, com o botao de tentar de novo. */
  const [erroEnvio, setErroEnvio] = useState('')
  const [contagem, setContagem] = useState(0)

  /* noValidate no form desliga a validacao do navegador para a nossa rodar.
     O envio e assincrono, por isso esta pagina nao usa o useFormulario: ele
     foi feito para formulario que termina no proprio clique. */
  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const form = evento.currentTarget
    const dados = new FormData(form)
    const novos = validar(dados)
    setErros(novos)
    setErroEnvio('')

    if (Object.keys(novos).length > 0) return

    setEnviando(true)
    try {
      const analise = await enviarAnalise({
        canal: textoDe(dados, 'canal'),
        mensagem: textoDe(dados, 'mensagem'),
      })
      setResultado(analise)
      form.reset()
      setContagem(0)
    } catch {
      setErroEnvio('Não conseguimos falar com o Desconfie agora. Tente de novo em instantes.')
    } finally {
      setEnviando(false)
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

      <section className="py-18">
        <div className={`${wrap} grid gap-9 md:grid-cols-[1.1fr_1fr] md:gap-14`}>
          <form noValidate onSubmit={aoEnviar} className="grid gap-5 rounded-[28px] bg-surface p-7">
            <div className="grid gap-1.5">
              <label htmlFor="canal" className="font-semibold text-navy">
                Por onde chegou?
              </label>
              <select
                id="canal"
                name="canal"
                defaultValue=""
                aria-invalid={!!erros.canal}
                aria-describedby={erros.canal ? 'erro-canal' : undefined}
                className={classeCampo(!!erros.canal)}
              >
                <option value="">Escolha o canal</option>
                {canais.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <MsgErro id="erro-canal" texto={erros.canal} />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="mensagem" className="font-semibold text-navy">
                A mensagem
              </label>
              <span className="text-[.9rem] text-muted">
                Cole o texto inteiro, com o link. Não escreva senhas, CPF ou número de cartão — se
                vier junto, mascaramos antes de enviar.
              </span>
              <textarea
                id="mensagem"
                name="mensagem"
                maxLength={MAX}
                onChange={(e) => setContagem(e.currentTarget.value.length)}
                aria-invalid={!!erros.mensagem}
                aria-describedby={erros.mensagem ? 'erro-mensagem' : 'contagem-mensagem'}
                className={`${classeCampo(!!erros.mensagem)} min-h-[190px] resize-y`}
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <MsgErro id="erro-mensagem" texto={erros.mensagem} />
                <span id="contagem-mensagem" className="ml-auto font-mono text-[.85rem] text-muted">
                  {contagem}/{MAX}
                </span>
              </div>
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="lgpd" className="flex items-start gap-2.5 text-[.98rem]">
                <input
                  type="checkbox"
                  id="lgpd"
                  name="lgpd"
                  aria-invalid={!!erros.lgpd}
                  aria-describedby={erros.lgpd ? 'erro-lgpd' : undefined}
                  className="mt-1 size-5 shrink-0 accent-navy"
                />
                <span>
                  Concordo que o Desconfie guarde esta mensagem, já sem dados pessoais, para gerar a
                  análise e melhorar a detecção.
                </span>
              </label>
              <MsgErro id="erro-lgpd" texto={erros.lgpd} />
            </div>

            {/* aria-busy avisa o leitor de tela de que o botao esta ocupado. */}
            <Button type="submit" disabled={enviando} aria-busy={enviando}
              className={enviando ? 'opacity-60' : ''}>
              {enviando ? 'Analisando…' : 'Analisar mensagem'}
            </Button>

            {erroEnvio && (
              <p role="alert" className="rounded-2xl bg-danger-bg p-4 text-ink">
                <strong className="text-danger">Deu erro no envio.</strong> {erroEnvio}
              </p>
            )}

            {modoDemonstracao() && (
              <p className="text-[.95rem] text-muted">
                Demonstração: a API de decisão ainda não está ligada, então a nota sai de uma regra
                local e as análises ficam só neste navegador.
              </p>
            )}
          </form>

          <div className="grid content-start gap-6">
            {resultado ? (
              <>
                <CardVeredito analise={resultado} />
                <p className="text-[.98rem] text-muted">
                  Essa análise já está em{' '}
                  <Link to="/minhas-analises" className="font-semibold text-navy">
                    minhas análises
                  </Link>
                  .
                </p>
              </>
            ) : (
              <div className="grid content-start gap-4 rounded-[28px] border border-line p-7">
                <p className={eyebrow}>Antes de enviar</p>
                <ul className="grid list-none gap-3 p-0 text-[1.02rem] text-muted">
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
                </ul>
                <p className="text-[.95rem] text-muted">
                  O veredito aparece aqui assim que a análise terminar.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
