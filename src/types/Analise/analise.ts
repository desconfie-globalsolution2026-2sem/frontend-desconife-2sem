/* Tipos do fluxo de analise de mensagem: o que o site envia e o que recebe. */

/* Faixa de risco. Vem decidida pela API; o site so escolhe a cor e o texto. */
export type Faixa = 'golpe' | 'suspeito' | 'seguro'

export interface SinalDetectado {
  codigo: string
  nome: string
  /* Quanto esse sinal somou na nota. Sinal critico pode vir com peso 0. */
  peso: number
  critico: boolean
}

/* O que o site manda para a API. */
export interface NovaAnalise {
  canal: string
  mensagem: string
}

/* O que a API devolve e o que o historico lista. */
export interface Analise {
  id: string
  /* ISO 8601, como vem de banco. A formatacao para pt-BR fica na tela. */
  criadoEm: string
  canal: string
  /* Mensagem ja mascarada: sem CPF, telefone, e-mail ou cartao. */
  mensagem: string
  /* 0 a 1. */
  nota: number
  faixa: Faixa
  sinais: SinalDetectado[]
}
