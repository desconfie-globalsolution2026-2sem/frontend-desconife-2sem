import type { Sinal } from '../../types/Home/sinal'

/*
 * Os mesmos padroes e pesos da API Java: os de texto e de link ficam no banco
 * (GET /padroes) e os de endereco disfarcado sao regras fixas do motor.
 *
 * A Home busca os termos e pesos atuais na API (hooks/useSinais); esta lista e
 * a reserva para quando a API nao responde, e o filtro diz de onde vem cada cartao.
 */
export const sinais: Sinal[] = [
  {
    nome: 'Falso parente',
    peso: '+30 a +35',
    termos: ['troquei de numero', 'numero novo'],
    texto: '"Oi mãe, troquei de número". Ligue no número antigo antes de qualquer coisa.',
    filtro: { categoria: 'Falso parente', tipos: ['TEXTO'] },
  },
  {
    nome: 'Falsa central do banco',
    peso: '+25 a +35',
    termos: [
      'codigo de verificacao',
      'central de seguranca',
      'compra nao reconhecida',
      'confirme seus dados',
      'atualize seus dados',
      'suspeita de fraude',
    ],
    texto: 'Finge ser do banco para pegar senha e código. Banco nenhum pede isso por mensagem.',
    filtro: { categoria: 'Falsa central do banco', tipos: ['TEXTO'] },
  },
  {
    nome: 'Urgência e ameaça',
    peso: '+20 a +30',
    termos: [
      'sua conta sera bloqueada',
      'foi bloqueado',
      'foi bloqueada',
      'sera encerrada',
      'regularize',
      'evite o bloqueio',
      'urgente',
      'ultima chance',
    ],
    texto: 'Cria pressa ou medo para você agir sem pensar.',
    filtro: { categoria: 'Urgência e ameaça', tipos: ['TEXTO'] },
  },
  {
    nome: 'Pedido de dinheiro',
    peso: '+10 a +15',
    termos: ['pix', 'transferencia', 'preciso de'],
    texto: 'Pede Pix ou pagamento para resolver um problema que você não sabia que tinha.',
    filtro: { categoria: 'Pedido de dinheiro', tipos: ['TEXTO'] },
  },
  {
    nome: 'Falso emprego',
    peso: '+25',
    termos: ['renda extra'],
    texto: 'Trabalho fácil que no fim cobra uma taxa ou pede seus dados.',
    filtro: { categoria: 'Falso emprego', tipos: ['TEXTO'] },
  },
  {
    nome: 'Pede para clicar',
    peso: '+30',
    termos: ['clique no link'],
    texto: 'O golpe quase sempre termina num link. Abra o app oficial você mesmo.',
    filtro: { categoria: 'Phishing de link', tipos: ['TEXTO'] },
  },
  {
    nome: 'Link que imita marca',
    peso: '+35',
    termos: ['nubank', 'itau'],
    texto: 'Nome do banco num endereço que não é o site oficial dele.',
    filtro: { categoria: 'Phishing de link', tipos: ['MARCA'] },
  },
  {
    nome: 'Encurtador ou final suspeito',
    peso: '+15 a +25',
    termos: ['bit.ly', 'tinyurl.com', 'cutt.ly', 'is.gd', '.xyz', '.click', '.top', '.online'],
    texto: 'Esconde o destino real ou usa um final de endereço barato, comum em sites falsos.',
    filtro: { categoria: 'Phishing de link', tipos: ['ENCURTADOR', 'TLD'] },
  },
  {
    nome: 'Endereço disfarçado',
    peso: '+10 a +30',
    termos: ['IP no lugar do nome', '@ no link', 'letras que imitam outras', 'sem HTTPS'],
    texto: 'Truques no próprio endereço para parecer um site que ele não é.',
  },
]
