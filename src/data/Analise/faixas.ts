import type { Risco } from '../../types/Api/dtos'

interface InfoFaixa {
  titulo: string
  bg: 'bg-danger-bg' | 'bg-warn-bg' | 'bg-safe-bg'
  fg: 'text-danger' | 'text-warn' | 'text-safe'
}

/* Mesma linguagem dos vereditos da Home, indexada pelo risco que a API devolve. */
export const faixas: Record<Risco, InfoFaixa> = {
  VERMELHO: { titulo: 'Muito provável golpe', bg: 'bg-danger-bg', fg: 'text-danger' },
  AMARELO: { titulo: 'Suspeito', bg: 'bg-warn-bg', fg: 'text-warn' },
  VERDE: { titulo: 'Sem sinais de golpe', bg: 'bg-safe-bg', fg: 'text-safe' },
}
