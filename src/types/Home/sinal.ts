import type { TipoPadrao } from '../Api/dtos'

export interface Sinal {
  nome: string
  /* Peso na nota das regras (0 a 100), como texto: "+35" ou "+10 a +15". */
  peso: string
  /* Termos ou pedacos de endereco que a API procura. */
  termos: string[]
  texto: string
  /*
   * Quais padroes do GET /padroes alimentam este cartao. Sem filtro, o cartao
   * e uma regra fixa do motor (nao esta no banco) e fica sempre como esta aqui.
   */
  filtro?: { categoria: string; tipos: TipoPadrao[] }
}
