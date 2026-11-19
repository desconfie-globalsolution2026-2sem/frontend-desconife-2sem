import { useState } from 'react'
import { mensagemDeErro } from '../../services/api'
import { listarAlertas, marcarAlertaComoLido } from '../../services/endpoints/alertas'
import { useCarregar } from '../../hooks/useCarregar'
import { dataHoraBr, notaBr } from '../../utils/formatar'
import SeloFaixa from '../analise/SeloFaixa'
import EstadoCarga from '../layout/EstadoCarga'
import Bloco from './Bloco'

/* Avisos de quando alguem do circulo analisou algo arriscado. Nao lidos primeiro. */
export default function Alertas({ usuarioId }: { usuarioId: number }) {
  const { dados, setDados, carregando, erro, recarregar } = useCarregar(
    () => listarAlertas(usuarioId),
    usuarioId,
  )
  const [erroLido, setErroLido] = useState('')

  const alertas = [...(dados ?? [])].sort((a, b) => Number(a.lido) - Number(b.lido))
  const naoLidos = alertas.filter((a) => !a.lido).length

  async function marcarComoLido(id: number) {
    setErroLido('')
    try {
      const atualizado = await marcarAlertaComoLido(id)
      setDados((atuais) => atuais?.map((a) => (a.id === id ? atualizado : a)))
    } catch (e) {
      setErroLido(mensagemDeErro(e))
    }
  }

  return (
    <Bloco
      titulo="Alertas"
      texto="Quando alguém do seu círculo analisa uma mensagem suspeita, o aviso chega aqui. Ligue para a pessoa antes que ela pague ou clique."
      extra={
        naoLidos > 0 && (
          <span className="rounded-full bg-danger px-2.5 py-0.5 text-[.85rem] font-semibold text-white">
            {naoLidos} {naoLidos === 1 ? 'novo' : 'novos'}
          </span>
        )
      }
    >
      <EstadoCarga carregando={carregando} erro={erro} recarregar={recarregar} />

      {dados && alertas.length === 0 && (
        <p className="text-[.98rem] text-muted">Nenhum alerta. Tudo tranquilo no seu círculo.</p>
      )}

      {alertas.length > 0 && (
        <ul className="grid list-none gap-2 p-0">
          {alertas.map((a) => (
            <li
              key={a.id}
              className={`grid gap-2 rounded-xl px-4 py-3 ${a.lido ? 'bg-white/60 text-muted' : 'bg-white'}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <SeloFaixa risco={a.risco} />
                <span className="font-mono text-[.92rem] text-muted">nota {notaBr(a.notaFinal)}</span>
                <span className="text-[.92rem] text-muted">{dataHoraBr(a.dataAlerta)}</span>
              </div>
              <p>
                <strong>{a.autor.nome}</strong> recebeu{' '}
                {a.categoriaPrincipal ? `uma mensagem de “${a.categoriaPrincipal}”` : 'uma mensagem suspeita'}.
              </p>
              <div className="flex flex-wrap gap-4">
                {a.autor.telefone && (
                  <a href={`tel:${a.autor.telefone}`} className="min-h-11 content-center font-semibold text-navy">
                    Ligar para {a.autor.nome.split(' ')[0]}
                  </a>
                )}
                {!a.lido && (
                  <button
                    type="button"
                    onClick={() => void marcarComoLido(a.id)}
                    className="min-h-11 font-semibold text-navy"
                  >
                    Marcar como lido
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {erroLido && <p role="alert" className="text-danger">{erroLido}</p>}
    </Bloco>
  )
}
