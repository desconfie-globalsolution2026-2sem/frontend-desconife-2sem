import type { Faixa } from '../../types/Analise/analise'

interface InfoFaixa {
  titulo: string
  texto: string
  bg: 'bg-danger-bg' | 'bg-warn-bg' | 'bg-safe-bg'
  fg: 'text-danger' | 'text-warn' | 'text-safe'
}

/* Mesma linguagem dos vereditos da Home, indexada pela faixa que a API devolve. */
export const faixas: Record<Faixa, InfoFaixa> = {
  golpe: {
    titulo: 'Muito provável golpe',
    texto: 'Não clique, não pague, não responda. Apague e bloqueie o contato.',
    bg: 'bg-danger-bg',
    fg: 'text-danger',
  },
  suspeito: {
    titulo: 'Suspeito',
    texto: 'Confirme por outro caminho: abra o app oficial ou ligue para o número do cartão.',
    bg: 'bg-warn-bg',
    fg: 'text-warn',
  },
  seguro: {
    titulo: 'Sem sinais de golpe',
    texto: 'Nada chamou atenção. Mesmo assim, nunca passe senha ou código por mensagem.',
    bg: 'bg-safe-bg',
    fg: 'text-safe',
  },
}
