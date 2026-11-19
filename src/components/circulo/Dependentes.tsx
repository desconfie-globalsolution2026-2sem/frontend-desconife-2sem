import { useState } from 'react'
import { mensagemDeErro } from '../../services/api'
import { adicionarDependente, listarDependentes, removerDependente } from '../../services/endpoints/usuarios'
import { useCarregar } from '../../hooks/useCarregar'
import { useFormulario } from '../../hooks/useFormulario'
import type { MembroCirculoResponse } from '../../types/Api/dtos'
import { dataBr } from '../../utils/formatar'
import { emailValido, mensagens, textoDe } from '../../utils/validacoes'
import Button from '../button/Button'
import { classeCampo } from '../form/classeCampo'
import MsgErro from '../form/MsgErro'
import EstadoCarga from '../layout/EstadoCarga'
import Bloco from '../layout/Bloco'

type Erros = { email?: string }

function validar(dados: FormData): Erros {
  return emailValido(textoDe(dados, 'email')) ? {} : { email: mensagens.email }
}

/* Pessoas que este usuario protege: ele recebe os alertas delas. */
export default function Dependentes({ usuarioId }: { usuarioId: number }) {
  const { dados, setDados, carregando, erro, recarregar } = useCarregar(
    () => listarDependentes(usuarioId),
    usuarioId,
  )
  const [erroRemover, setErroRemover] = useState('')

  /* A API devolve o vinculo; ele entra na lista sem buscar tudo de novo. */
  const { erros, enviando, erroEnvio, aoEnviar } = useFormulario(validar, async (form) => {
    const vinculo = await adicionarDependente(usuarioId, { emailDependente: textoDe(form, 'email') })
    setDados((atuais) => [...(atuais ?? []), { ...vinculo.dependente, dataVinculo: vinculo.dataVinculo }])
  })

  async function remover(membro: MembroCirculoResponse) {
    if (!confirm(`Tirar ${membro.nome} do seu círculo? Você deixa de receber os alertas dessa pessoa.`)) return
    setErroRemover('')
    try {
      await removerDependente(usuarioId, membro.id)
      setDados((atuais) => atuais?.filter((m) => m.id !== membro.id))
    } catch (e) {
      setErroRemover(mensagemDeErro(e))
    }
  }

  return (
    <Bloco
      titulo="Quem você protege"
      texto="Adicione o e-mail de quem você quer acompanhar. A pessoa precisa já ter conta no Desconfie."
    >
      <EstadoCarga carregando={carregando} erro={erro} recarregar={recarregar} />

      {dados && dados.length === 0 && (
        <p className="text-[.98rem] text-muted">Ninguém por enquanto.</p>
      )}

      {dados && dados.length > 0 && (
        <ul className="grid list-none gap-2 p-0">
          {dados.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-4 py-3">
              <span>
                <span className="block font-semibold">{m.nome}</span>
                <span className="text-[.95rem] text-muted">
                  {m.email} · desde {dataBr(m.dataVinculo)}
                </span>
              </span>
              <button
                type="button"
                onClick={() => void remover(m)}
                className="min-h-11 px-2 text-[.95rem] font-semibold text-danger"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
      {erroRemover && <p role="alert" className="text-danger">{erroRemover}</p>}

      <form noValidate onSubmit={(e) => void aoEnviar(e)} className="grid gap-2">
        <label htmlFor="dependente-email" className="font-semibold text-navy">
          E-mail da pessoa
        </label>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <input
            id="dependente-email"
            name="email"
            type="email"
            inputMode="email"
            aria-invalid={!!erros.email}
            aria-describedby={erros.email ? 'erro-dependente' : undefined}
            className={classeCampo(!!erros.email)}
          />
          <Button type="submit" disabled={enviando} aria-busy={enviando} className="disabled:opacity-60">
            {enviando ? 'Adicionando…' : 'Adicionar'}
          </Button>
        </div>
        <MsgErro id="erro-dependente" texto={erros.email} />
        {erroEnvio && <p role="alert" className="text-danger">{erroEnvio}</p>}
      </form>
    </Bloco>
  )
}
