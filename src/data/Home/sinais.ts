import type { Sinal } from '../../types/Home/sinal'

export const sinais: Sinal[] = [
  { nome: 'Pressa', peso: '+0,20', codigo: 'URGENCIA', critico: false, texto: '"Só hoje", "últimas horas", "responda agora". Golpista não quer que você pense.' },
  { nome: 'Pede PIX', peso: '+0,25', codigo: 'PEDE_PIX', critico: false, texto: 'Pedido de transferência para resolver um problema que você não sabia que tinha.' },
  { nome: 'Pede dados', peso: '+0,30', codigo: 'PEDE_DADOS', critico: false, texto: 'Senha, código do SMS, CPF ou número do cartão. Banco nenhum pede isso por mensagem.' },
  { nome: 'Ameaça de bloqueio', peso: '+0,20', codigo: 'AMEACA_BLOQUEIO', critico: false, texto: '"Sua conta será bloqueada", "seu CPF está irregular". Medo faz a pessoa agir rápido.' },
  { nome: 'Prêmio', peso: '+0,20', codigo: 'PREMIO', critico: false, texto: 'Sorteio que você não lembra de ter entrado, sempre com uma "taxa" para liberar.' },
  { nome: 'Finge ser parente', peso: '+0,25', codigo: 'FINGE_PARENTE', critico: false, texto: '"Oi mãe, troquei de número". Ligue no número antigo antes de qualquer coisa.' },
  { nome: 'Link suspeito', peso: '+0,35', codigo: 'URL_SUSPEITA', critico: false, texto: 'Endereço com cara de phishing, avaliado por um modelo treinado com 101 mil links.' },
  { nome: 'Link encurtado', peso: '+0,15', codigo: 'LINK_ENCURTADO', critico: false, texto: 'bit.ly e parecidos escondem o destino real. Empresa séria usa o próprio site.' },
  { nome: 'Imita uma marca', peso: 'crítico', codigo: 'DOMINIO_IMITA_MARCA', critico: true, texto: 'Usa o nome de um banco ou dos Correios num site que não é o oficial.' },
]
