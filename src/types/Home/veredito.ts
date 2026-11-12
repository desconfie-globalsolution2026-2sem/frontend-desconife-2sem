export interface Veredito {
    faixa: string
    titulo: string
    texto: string
    /* Uniao fechada: so aceita classe que existe no tema.
       Com 'string' um erro de digitacao passaria batido e o card ficaria sem cor. */
    bg: 'bg-danger-bg' | 'bg-warn-bg' | 'bg-safe-bg'
    fg: 'text-danger' | 'text-warn' | 'text-safe'
}
