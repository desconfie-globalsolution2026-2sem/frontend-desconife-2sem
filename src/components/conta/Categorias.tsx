import { useState, type Dispatch, type SetStateAction } from 'react'
import { useFormulario } from '../../hooks/useFormulario'
import { mensagemDeErro } from '../../services/api'
import { cadastrarCategoria, excluirCategoria } from '../../services/endpoints/categorias'
import type { CategoriaResponse, PadraoResponse } from '../../types/Api/dtos'
import { textoDe } from '../../utils/validacoes'
import Button from '../button/Button'
import { classeCampo } from '../form/classeCampo'
import MsgErro from '../form/MsgErro'
import Bloco from '../layout/Bloco'

type Erros = { nome?: string; descricao?: string; orientacao?: string }

/* Mesmos limites da API (CategoriaRequest), para o erro aparecer antes de enviar. */
function validar(dados: FormData): Erros {
  const novos: Erros = {}
  const nome = textoDe(dados, 'nome')
  const descricao = textoDe(dados, 'descricao')
  const orientacao = textoDe(dados, 'orientacao')
  if (nome.length < 3 || nome.length > 60) novos.nome = 'Use de 3 a 60 caracteres.'
  if (!descricao || descricao.length > 300) novos.descricao = 'Explique o golpe em até 300 caracteres.'
  if (!orientacao || orientacao.length > 400)
    novos.orientacao = 'Diga o que a pessoa deve fazer, em até 400 caracteres.'
  return novos
}

interface Props {
  categorias: CategoriaResponse[]
  setCategorias: Dispatch<SetStateAction<CategoriaResponse[] | undefined>>
  padroes: PadraoResponse[]
}

/*
 * Categorias de golpe (ex.: "Falso parente"). Cada padrao pertence a uma, e a
 * orientacao dela e o "o que fazer" que aparece no resultado da analise.
 * A API so exclui categoria sem padroes; a tela avisa antes.
 */
export default function Categorias({ categorias, setCategorias, padroes }: Props) {
  const [erroExcluir, setErroExcluir] = useState('')

  const { erros, sucesso, enviando, erroEnvio, aoEnviar } = useFormulario(validar, async (form) => {
    const nova = await cadastrarCategoria({
      nome: textoDe(form, 'nome'),
      descricao: textoDe(form, 'descricao'),
      orientacao: textoDe(form, 'orientacao'),
    })
    setCategorias((atuais) => [...(atuais ?? []), nova])
  })

  async function excluir(categoria: CategoriaResponse) {
    if (!confirm(`Excluir a categoria "${categoria.nome}"?`)) return
    setErroExcluir('')
    try {
      await excluirCategoria(categoria.id)
      setCategorias((atuais) => atuais?.filter((c) => c.id !== categoria.id))
    } catch (e) {
      setErroExcluir(mensagemDeErro(e))
    }
  }

  return (
    <Bloco
      titulo="Categorias de golpe"
      texto="Cada categoria agrupa padrões parecidos e diz o que a pessoa deve fazer quando um deles aparece."
    >
      <ul className="grid list-none gap-2 p-0">
        {categorias.map((c) => {
          const total = padroes.filter((p) => p.categoriaId === c.id).length
          return (
            <li key={c.id} className="grid gap-1 rounded-xl bg-white px-4 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold">{c.nome}</span>
                <span className="text-[.9rem] text-muted">
                  {total} {total === 1 ? 'padrão' : 'padrões'}
                </span>
              </div>
              <p className="text-[.95rem] text-muted">{c.orientacao}</p>
              {total === 0 && (
                <button
                  type="button"
                  onClick={() => void excluir(c)}
                  className="min-h-11 justify-self-start px-0 text-[.95rem] font-semibold text-danger"
                >
                  Excluir categoria
                </button>
              )}
            </li>
          )
        })}
      </ul>
      {erroExcluir && <p role="alert" className="text-danger">{erroExcluir}</p>}

      <form noValidate onSubmit={(e) => void aoEnviar(e)} className="grid gap-3 border-t border-line pt-4">
        <h3 className="text-[1.1rem] font-semibold">Nova categoria</h3>

        <div className="grid gap-1.5">
          <label htmlFor="cat-nome" className="font-semibold text-navy">
            Nome
          </label>
          <input
            id="cat-nome"
            name="nome"
            maxLength={60}
            aria-invalid={!!erros.nome}
            aria-describedby={erros.nome ? 'erro-cat-nome' : undefined}
            className={classeCampo(!!erros.nome)}
          />
          <MsgErro id="erro-cat-nome" texto={erros.nome} />
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="cat-descricao" className="font-semibold text-navy">
            Como é o golpe
          </label>
          <textarea
            id="cat-descricao"
            name="descricao"
            rows={2}
            maxLength={300}
            aria-invalid={!!erros.descricao}
            aria-describedby={erros.descricao ? 'erro-cat-descricao' : undefined}
            className={classeCampo(!!erros.descricao)}
          />
          <MsgErro id="erro-cat-descricao" texto={erros.descricao} />
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="cat-orientacao" className="font-semibold text-navy">
            O que fazer
          </label>
          <textarea
            id="cat-orientacao"
            name="orientacao"
            rows={2}
            maxLength={400}
            aria-invalid={!!erros.orientacao}
            aria-describedby={erros.orientacao ? 'erro-cat-orientacao' : undefined}
            className={classeCampo(!!erros.orientacao)}
          />
          <MsgErro id="erro-cat-orientacao" texto={erros.orientacao} />
        </div>

        <Button type="submit" disabled={enviando} aria-busy={enviando} className="justify-self-start disabled:opacity-60">
          {enviando ? 'Cadastrando…' : 'Cadastrar categoria'}
        </Button>
        {sucesso && <p role="status" className="font-medium text-safe">Categoria cadastrada.</p>}
        {erroEnvio && <p role="alert" className="text-danger">{erroEnvio}</p>}
      </form>
    </Bloco>
  )
}
