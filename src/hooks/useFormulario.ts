import { useState, type FormEvent } from 'react'
import { mensagemDeErro } from '../services/api'

/*
 * Estado compartilhado pelos formularios do site.
 *
 * Recebe a funcao que valida (as regras continuam em cada pagina, porque sao
 * diferentes) e, opcionalmente, o envio para a API. Cuida do que se repetia
 * igual nas telas: guardar os erros, o "enviando", o erro da API e limpar o
 * formulario no sucesso.
 *
 * A validacao roda no envio, nao a cada tecla: quem esta digitando ainda nao
 * terminou, e acusar erro no meio da digitacao atrapalha mais do que ajuda.
 */
export function useFormulario<E extends object>(
  validar: (dados: FormData) => E,
  enviar?: (dados: FormData) => void | Promise<void>,
) {
  const [erros, setErros] = useState<E>({} as E)
  const [sucesso, setSucesso] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState('')

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const form = evento.currentTarget
    const dados = new FormData(form)
    const novos = validar(dados)
    setErros(novos)
    setSucesso(false)
    setErroEnvio('')

    if (Object.keys(novos).length > 0) return

    setEnviando(true)
    try {
      await enviar?.(dados)
      setSucesso(true)
      form.reset()
    } catch (erro) {
      setErroEnvio(mensagemDeErro(erro))
    } finally {
      setEnviando(false)
    }
  }

  return { erros, sucesso, enviando, erroEnvio, aoEnviar }
}
