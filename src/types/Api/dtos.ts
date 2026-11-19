/*
 * Formatos que a API Java recebe e devolve, copiados do Swagger
 * (https://java-desconfie-api.onrender.com/swagger-ui/index.html).
 * Datas chegam como texto ISO; a formatacao fica na tela.
 */

export type TipoAnalise = 'TEXTO' | 'IMAGEM' | 'LINK'
export type Risco = 'VERDE' | 'AMARELO' | 'VERMELHO'
export type Feedback = 'SEM_FEEDBACK' | 'ERA_GOLPE' | 'FALSO_ALARME'
export type TipoPadrao = 'TEXTO' | 'TLD' | 'ENCURTADOR' | 'MARCA' | 'DOMINIO_OFICIAL'

/* Usuarios */

export interface UsuarioRequest {
  nome: string
  email: string
  senha: string
  telefone?: string
}

export interface UsuarioUpdateRequest {
  nome: string
  email: string
  telefone?: string
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface UsuarioResponse {
  id: number
  nome: string
  email: string
  telefone: string
  status: string
  dataCadastro: string
}

export interface UsuarioResumoResponse {
  id: number
  nome: string
  email: string
}

/* Circulo de confianca: guardiao e dependentes */

export interface DependenteRequest {
  emailDependente: string
}

export interface VinculoResponse {
  guardiaoId: number
  dependente: UsuarioResumoResponse
  dataVinculo: string
}

export interface MembroCirculoResponse {
  id: number
  nome: string
  email: string
  dataVinculo: string
}

export interface AutorResponse {
  id: number
  nome: string
  telefone: string
}

/* Analises */

export interface AnaliseRequest {
  tipo: TipoAnalise
  conteudo?: string
  imagemBase64?: string
}

export interface FeedbackRequest {
  feedback: Feedback
}

export interface PadraoEncontradoResponse {
  id: number
  termo: string
  tipo: TipoPadrao
  categoria: string
  peso: number
  ocorrencias: number
}

export interface SinalLinkResponse {
  descricao: string
  peso: number
}

export interface AnaliseResponse {
  id: number
  usuarioId: number
  tipo: TipoAnalise
  conteudo: string
  notaRegras: number
  notaIa: number
  notaFinal: number
  risco: Risco
  iaDisponivel: boolean
  padroesEncontrados: PadraoEncontradoResponse[]
  sinaisLink: SinalLinkResponse[]
  categoriaPrincipal: string | null
  orientacao: string
  alertasGerados: number
  feedback: Feedback
  dataAnalise: string
}

export interface AnaliseResumoResponse {
  id: number
  tipo: TipoAnalise
  notaFinal: number
  risco: Risco
  categoriaPrincipal: string | null
  dataAnalise: string
}

export interface CirculoAnaliseResponse {
  id: number
  autor: AutorResponse
  tipo: TipoAnalise
  conteudo: string
  notaFinal: number
  risco: Risco
  categoriaPrincipal: string | null
  dataAnalise: string
}

/* Alertas */

export interface AlertaResponse {
  id: number
  analiseId: number
  autor: AutorResponse
  risco: Risco
  categoriaPrincipal: string | null
  notaFinal: number
  dataAlerta: string
  lido: boolean
}

/* Padroes (regras do motor), listados na Home */

export interface PadraoResponse {
  id: number
  categoriaId: number
  categoriaNome: string
  tipo: TipoPadrao
  termo: string
  peso: number
  ativo: boolean
}
