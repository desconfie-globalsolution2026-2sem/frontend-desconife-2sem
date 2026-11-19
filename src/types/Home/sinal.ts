export interface Sinal {
    nome: string
    /* Peso na nota das regras (0 a 100), como texto: "+35" ou "+10 a +15". */
    peso: string
    /* Termos ou pedacos de endereco que a API procura. */
    termos: string[]
    texto: string
}
