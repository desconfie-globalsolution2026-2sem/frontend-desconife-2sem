export interface Pergunta {
    pergunta: string
    resposta: string
}

export interface GrupoFaq {
    titulo: string
    perguntas: Pergunta[]
}
