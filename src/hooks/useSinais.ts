import { useEffect, useState } from 'react'
import { listarPadroes } from '../api/endpoints/padroes'
import { sinais as sinaisFixos } from '../data/Home/sinais'
import type { PadraoResponse } from '../types/Api/dtos'
import type { Sinal } from '../types/Home/sinal'

/* "+35" quando todos pesam igual; "+20 a +30" quando variam. */
function faixaDePeso(pesos: number[]) {
  const min = Math.min(...pesos)
  const max = Math.max(...pesos)
  return min === max ? `+${min}` : `+${min} a +${max}`
}

/* Troca termos e pesos de cada cartao pelos padroes ativos que vieram da API. */
function comPadroes(padroes: PadraoResponse[]): Sinal[] {
  return sinaisFixos.map((sinal) => {
    if (!sinal.filtro) return sinal
    const { categoria, tipos } = sinal.filtro
    const doCartao = padroes
      .filter((p) => p.ativo && p.categoriaNome === categoria && tipos.includes(p.tipo))
      .sort((a, b) => b.peso - a.peso)
    /* Sem padrao ativo na API, o cartao some: a API nao procura mais por isso. */
    if (doCartao.length === 0) return null
    return {
      ...sinal,
      peso: faixaDePeso(doCartao.map((p) => p.peso)),
      termos: doCartao.map((p) => p.termo),
    }
  }).filter((s): s is Sinal => s !== null)
}

/*
 * Sinais da Home ("O que a gente procura"). Comeca com a lista fixa, para a
 * secao aparecer na hora, e troca pelos padroes do banco quando a API responde.
 * Se a API falhar ou estiver dormindo, a lista fixa continua.
 */
export function useSinais() {
  const [sinais, setSinais] = useState<Sinal[]>(sinaisFixos)

  useEffect(() => {
    let ativo = true
    listarPadroes()
      .then((padroes) => {
        if (ativo) setSinais(comPadroes(padroes))
      })
      .catch(() => {})
    return () => {
      ativo = false
    }
  }, [])

  return sinais
}
