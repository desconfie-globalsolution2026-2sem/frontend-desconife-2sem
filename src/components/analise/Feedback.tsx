import { useState } from 'react'
import { mensagemDeErro } from '../../services/api'
import { enviarFeedback } from '../../services/endpoints/analises'
import type { AnaliseResponse, Feedback as TipoFeedback } from '../../types/Api/dtos'

const respostas: { valor: TipoFeedback; label: string; agradecimento: string }[] = [
  { valor: 'ERA_GOLPE', label: 'Era golpe', agradecimento: 'Você confirmou que era golpe.' },
  { valor: 'FALSO_ALARME', label: 'Não era golpe', agradecimento: 'Você marcou como falso alarme.' },
]

interface Props {
  analise: AnaliseResponse
  /* Recebe a analise atualizada, para a tela guardar o novo feedback. */
  aoResponder: (analise: AnaliseResponse) => void
}

/* "Era golpe mesmo?" — a resposta volta para treinar o modelo. Uma vez por analise. */
export default function Feedback({ analise, aoResponder }: Props) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  const respondida = respostas.find((r) => r.valor === analise.feedback)
  if (respondida) {
    return <p className="text-[.95rem] text-muted">{respondida.agradecimento} Obrigado, isso ensina a IA.</p>
  }

  async function responder(valor: TipoFeedback) {
    setEnviando(true)
    setErro('')
    try {
      aoResponder(await enviarFeedback(analise.id, { feedback: valor }))
    } catch (e) {
      setErro(mensagemDeErro(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[.95rem] text-muted">Era golpe mesmo?</span>
      {respostas.map((r) => (
        <button
          key={r.valor}
          type="button"
          disabled={enviando}
          onClick={() => void responder(r.valor)}
          className="min-h-11 rounded-full border border-line bg-white px-4 text-[.95rem] font-semibold text-navy transition-colors hover:bg-surface-2 disabled:opacity-60"
        >
          {r.label}
        </button>
      ))}
      {erro && <p role="alert" className="w-full text-danger">{erro}</p>}
    </div>
  )
}
