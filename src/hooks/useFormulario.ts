import { useState, type FormEvent } from 'react'

/*
 * Estado compartilhado pelos formularios do site.
 *
 * Recebe a funcao que valida (as regras continuam em cada pagina, porque sao
 * diferentes) e cuida do que se repetia igual nas tres: guardar os erros,
 * guardar se o envio deu certo e limpar o formulario no sucesso.
 *
 * A validacao roda no envio, nao a cada tecla: quem esta digitando ainda nao
 * terminou, e acusar erro no meio da digitacao atrapalha mais do que ajuda.
 */
export function useFormulario<E extends object>(
  validar: (dados: FormData) => E,
  aoSucesso?: () => void,
) {
  const [erros, setErros] = useState<E>({} as E)
  const [sucesso, setSucesso] = useState(false)

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const form = evento.currentTarget
    const novos = validar(new FormData(form))
    setErros(novos)

    const valido = Object.keys(novos).length === 0
    setSucesso(valido)

    if (valido) {
      aoSucesso?.()
      form.reset()
    }
  }

  return { erros, sucesso, aoEnviar }
}
