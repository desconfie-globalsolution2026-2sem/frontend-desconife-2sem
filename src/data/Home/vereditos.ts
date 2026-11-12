import type { Veredito } from '../../types/Home/veredito'

export const vereditos: Veredito[] = [
  { faixa: 'nota a partir de 0,70 ou sinal crítico', titulo: 'Muito provável golpe', texto: 'Não clique, não pague, não responda. Apague e bloqueie o contato.', bg: 'bg-danger-bg', fg: 'text-danger' },
  { faixa: 'nota de 0,40 a 0,69', titulo: 'Suspeito', texto: 'Confirme por outro caminho: abra o app oficial ou ligue para o número do cartão.', bg: 'bg-warn-bg', fg: 'text-warn' },
  { faixa: 'nota abaixo de 0,40', titulo: 'Sem sinais de golpe', texto: 'Nada chamou atenção. Mesmo assim, nunca passe senha ou código por mensagem.', bg: 'bg-safe-bg', fg: 'text-safe' },
]
