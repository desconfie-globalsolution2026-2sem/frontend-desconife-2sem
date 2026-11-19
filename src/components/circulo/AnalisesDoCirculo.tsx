import { listarAnalisesDoCirculo } from '../../services/endpoints/analises'
import { rotuloDoTipo } from '../../data/Analise/tipos'
import { useCarregar } from '../../hooks/useCarregar'
import { dataHoraBr, notaBr } from '../../utils/formatar'
import SeloFaixa from '../analise/SeloFaixa'
import EstadoCarga from '../layout/EstadoCarga'
import Bloco from './Bloco'

/* Tudo que o circulo mandou analisar, inclusive o proprio usuario. */
export default function AnalisesDoCirculo({ usuarioId }: { usuarioId: number }) {
  const { dados, carregando, erro, recarregar } = useCarregar(
    () => listarAnalisesDoCirculo(usuarioId),
    usuarioId,
  )

  return (
    <Bloco
      titulo="O que o círculo analisou"
      texto="As mensagens que vocês mandaram para análise. O mesmo golpe costuma chegar para a família inteira."
    >
      <EstadoCarga carregando={carregando} erro={erro} recarregar={recarregar} />

      {dados && dados.length === 0 && (
        <p className="text-[.98rem] text-muted">Ninguém do círculo analisou nada ainda.</p>
      )}

      {dados && dados.length > 0 && (
        <ul className="grid list-none gap-2 p-0">
          {dados.map((a) => (
            <li key={a.id} className="grid gap-2 rounded-xl bg-white px-4 py-3">
              <div className="flex flex-wrap items-center gap-3">
                <SeloFaixa risco={a.risco} />
                <span className="font-semibold">{a.autor.id === usuarioId ? 'Você' : a.autor.nome}</span>
                <span className="text-[.92rem] text-muted">
                  {rotuloDoTipo(a.tipo)} · nota {notaBr(a.notaFinal)} · {dataHoraBr(a.dataAnalise)}
                </span>
              </div>
              <p className="line-clamp-3 text-[1rem]">{a.conteudo}</p>
            </li>
          ))}
        </ul>
      )}
    </Bloco>
  )
}
