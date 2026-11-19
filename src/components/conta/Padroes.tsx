import { useState, type Dispatch, type SetStateAction } from 'react'
import { useFormulario } from '../../hooks/useFormulario'
import { mensagemDeErro } from '../../services/api'
import { atualizarPadrao, cadastrarPadrao, excluirPadrao } from '../../services/endpoints/padroes'
import type { CategoriaResponse, PadraoResponse, TipoPadrao } from '../../types/Api/dtos'
import { textoDe } from '../../utils/validacoes'
import Button from '../button/Button'
import { classeCampo } from '../form/classeCampo'
import MsgErro from '../form/MsgErro'
import Bloco from '../layout/Bloco'

/* Onde a API procura cada tipo de padrao. */
const tipos: { valor: TipoPadrao; nome: string }[] = [
  { valor: 'TEXTO', nome: 'Frase na mensagem' },
  { valor: 'ENCURTADOR', nome: 'Encurtador de link' },
  { valor: 'TLD', nome: 'Final do endereço (.xyz)' },
  { valor: 'MARCA', nome: 'Marca imitada no link' },
  { valor: 'DOMINIO_OFICIAL', nome: 'Site oficial (nunca é golpe)' },
]
const nomeDoTipo = (tipo: TipoPadrao) => tipos.find((t) => t.valor === tipo)?.nome ?? tipo

type Erros = { categoria?: string; termo?: string; peso?: string }

/* Mesmos limites da API (PadraoRequest). Site oficial nao tem categoria nem peso. */
function validar(dados: FormData): Erros {
  const novos: Erros = {}
  const tipo = textoDe(dados, 'tipo') as TipoPadrao
  const termo = textoDe(dados, 'termo')
  const peso = Number(textoDe(dados, 'peso'))
  if (tipo !== 'DOMINIO_OFICIAL' && !textoDe(dados, 'categoria')) novos.categoria = 'Escolha a categoria.'
  if (!termo || termo.length > 120) novos.termo = 'Escreva o termo, com até 120 caracteres.'
  if (tipo !== 'DOMINIO_OFICIAL' && (!Number.isInteger(peso) || peso < 0 || peso > 50))
    novos.peso = 'O peso vai de 0 a 50.'
  return novos
}

interface Props {
  padroes: PadraoResponse[]
  setPadroes: Dispatch<SetStateAction<PadraoResponse[] | undefined>>
  categorias: CategoriaResponse[]
}

/*
 * Padroes que o motor de regras procura. Cada um soma o seu peso na nota uma
 * vez so. A API nao exclui padrao que ja apareceu em analise (fica no
 * historico): nesse caso, desative.
 */
export default function Padroes({ padroes, setPadroes, categorias }: Props) {
  const [tipo, setTipo] = useState<TipoPadrao>('TEXTO')
  const [erroAcao, setErroAcao] = useState('')
  const oficial = tipo === 'DOMINIO_OFICIAL'

  const { erros, sucesso, enviando, erroEnvio, aoEnviar } = useFormulario(validar, async (form) => {
    const novo = await cadastrarPadrao({
      tipo,
      termo: textoDe(form, 'termo'),
      categoriaId: oficial ? undefined : Number(textoDe(form, 'categoria')),
      peso: oficial ? 0 : Number(textoDe(form, 'peso')),
    })
    setPadroes((atuais) => [...(atuais ?? []), novo])
    setTipo('TEXTO')
  })

  const trocar = (novo: PadraoResponse) =>
    setPadroes((atuais) => atuais?.map((p) => (p.id === novo.id ? novo : p)))

  async function alternar(p: PadraoResponse) {
    setErroAcao('')
    try {
      trocar(
        await atualizarPadrao(p.id, {
          categoriaId: p.categoriaId ?? undefined,
          tipo: p.tipo,
          termo: p.termo,
          peso: p.peso,
          ativo: !p.ativo,
        }),
      )
    } catch (e) {
      setErroAcao(mensagemDeErro(e))
    }
  }

  async function excluir(p: PadraoResponse) {
    if (!confirm(`Excluir o padrão "${p.termo}"?`)) return
    setErroAcao('')
    try {
      await excluirPadrao(p.id)
      setPadroes((atuais) => atuais?.filter((x) => x.id !== p.id))
    } catch (e) {
      setErroAcao(mensagemDeErro(e))
    }
  }

  /* Agrupados pela categoria, na ordem do cadastro delas; sites oficiais no fim. */
  const grupos = [
    ...categorias.map((c) => ({ nome: c.nome, itens: padroes.filter((p) => p.categoriaId === c.id) })),
    { nome: 'Sites oficiais', itens: padroes.filter((p) => p.categoriaId === null) },
  ].filter((g) => g.itens.length > 0)

  return (
    <Bloco
      titulo="Padrões de golpe"
      texto="Frases e pedaços de link que o Desconfie procura. Cada padrão encontrado soma o peso dele na nota das regras."
    >
      <div className="grid gap-4">
        {grupos.map((g) => (
          <div key={g.nome} className="grid gap-2">
            <h3 className="text-[1rem] font-semibold text-navy">{g.nome}</h3>
            <ul className="grid list-none gap-2 p-0">
              {[...g.itens]
                .sort((a, b) => b.peso - a.peso)
                .map((p) => (
                  <li
                    key={p.id}
                    className={`flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-4 py-2.5 ${p.ativo ? '' : 'opacity-60'}`}
                  >
                    <span className="min-w-0">
                      <code className="font-mono text-[.95rem] break-all text-ink">{p.termo}</code>
                      <span className="block text-[.85rem] text-muted">
                        {nomeDoTipo(p.tipo)}
                        {p.tipo !== 'DOMINIO_OFICIAL' && ` · +${p.peso}`}
                        {!p.ativo && ' · desativado'}
                      </span>
                    </span>
                    <span className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => void alternar(p)}
                        className="min-h-11 px-2 text-[.92rem] font-semibold text-navy"
                      >
                        {p.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => void excluir(p)}
                        className="min-h-11 px-2 text-[.92rem] font-semibold text-danger"
                      >
                        Excluir
                      </button>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      {erroAcao && <p role="alert" className="text-danger">{erroAcao}</p>}

      <form noValidate onSubmit={(e) => void aoEnviar(e)} className="grid gap-3 border-t border-line pt-4">
        <h3 className="text-[1.1rem] font-semibold">Novo padrão</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid content-start gap-1.5">
            <label htmlFor="pad-tipo" className="font-semibold text-navy">
              Onde procurar
            </label>
            <select
              id="pad-tipo"
              name="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoPadrao)}
              className={classeCampo(false)}
            >
              {tipos.map((t) => (
                <option key={t.valor} value={t.valor}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>

          {!oficial && (
            <div className="grid content-start gap-1.5">
              <label htmlFor="pad-categoria" className="font-semibold text-navy">
                Categoria
              </label>
              <select
                id="pad-categoria"
                name="categoria"
                defaultValue=""
                aria-invalid={!!erros.categoria}
                aria-describedby={erros.categoria ? 'erro-pad-categoria' : undefined}
                className={classeCampo(!!erros.categoria)}
              >
                <option value="" disabled>
                  Escolha…
                </option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
              <MsgErro id="erro-pad-categoria" texto={erros.categoria} />
            </div>
          )}
        </div>

        <div className={`grid gap-3 ${oficial ? '' : 'sm:grid-cols-[minmax(0,1fr)_140px]'}`}>
          <div className="grid content-start gap-1.5">
            <label htmlFor="pad-termo" className="font-semibold text-navy">
              {oficial ? 'Endereço oficial (ex.: meubanco.com.br)' : 'Termo'}
            </label>
            <input
              id="pad-termo"
              name="termo"
              maxLength={120}
              autoComplete="off"
              aria-invalid={!!erros.termo}
              aria-describedby={erros.termo ? 'erro-pad-termo' : 'dica-pad-termo'}
              className={classeCampo(!!erros.termo)}
            />
            <span id="dica-pad-termo" className="text-[.88rem] text-muted">
              Pode escrever com acento e maiúscula: a API guarda sem acento e em minúsculas.
            </span>
            <MsgErro id="erro-pad-termo" texto={erros.termo} />
          </div>

          {!oficial && (
            <div className="grid content-start gap-1.5">
              <label htmlFor="pad-peso" className="font-semibold text-navy">
                Peso (0 a 50)
              </label>
              <input
                id="pad-peso"
                name="peso"
                type="number"
                min={0}
                max={50}
                step={1}
                inputMode="numeric"
                aria-invalid={!!erros.peso}
                aria-describedby={erros.peso ? 'erro-pad-peso' : undefined}
                className={classeCampo(!!erros.peso)}
              />
              <MsgErro id="erro-pad-peso" texto={erros.peso} />
            </div>
          )}
        </div>

        <Button type="submit" disabled={enviando} aria-busy={enviando} className="justify-self-start disabled:opacity-60">
          {enviando ? 'Cadastrando…' : 'Cadastrar padrão'}
        </Button>
        {sucesso && <p role="status" className="font-medium text-safe">Padrão cadastrado.</p>}
        {erroEnvio && <p role="alert" className="text-danger">{erroEnvio}</p>}
      </form>
    </Bloco>
  )
}
