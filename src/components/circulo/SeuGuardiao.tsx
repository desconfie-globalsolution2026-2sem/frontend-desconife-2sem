import { buscarGuardiao } from '../../services/endpoints/usuarios'
import { useCarregar } from '../../hooks/useCarregar'
import type { UsuarioResponse } from '../../types/Api/dtos'
import { dataBr } from '../../utils/formatar'
import EstadoCarga from '../layout/EstadoCarga'
import Bloco from './Bloco'

/* Quem recebe aviso quando esta pessoa analisa algo arriscado. */
export default function SeuGuardiao({ usuario }: { usuario: UsuarioResponse }) {
  const { dados: guardiao, carregando, erro, recarregar } = useCarregar(
    () => buscarGuardiao(usuario.id),
    usuario.id,
  )

  return (
    <Bloco
      titulo="Quem cuida de você"
      texto="Seu guardião é avisado quando você analisa uma mensagem com cara de golpe."
    >
      <EstadoCarga carregando={carregando} erro={erro} recarregar={recarregar} />

      {guardiao && (
        <div className="rounded-xl bg-white px-4 py-3">
          <p className="font-semibold">{guardiao.nome}</p>
          <p className="text-[.95rem] text-muted">
            {guardiao.email} · desde {dataBr(guardiao.dataVinculo)}
          </p>
        </div>
      )}

      {guardiao === null && (
        <p className="rounded-xl bg-white px-4 py-3 text-[.98rem]">
          Você ainda não tem guardião. Peça para um filho, neto ou amigo de confiança criar uma
          conta e adicionar o seu e-mail: <strong>{usuario.email}</strong>
        </p>
      )}
    </Bloco>
  )
}
