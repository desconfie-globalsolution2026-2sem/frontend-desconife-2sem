/*
 * Mock do fluxo de analise, usado so enquanto os endpoints nao existem.
 *
 * Nao e o modelo de IA: e uma regra simples de palavra-chave com os mesmos
 * codigos e pesos que a Home explica, para a tela mostrar nota, sinais e
 * historico de verdade na apresentacao. Quando a API entrar, este arquivo sai.
 *
 * O historico fica em localStorage para sobreviver a troca de tela e ao F5.
 */
import type { Analise, Faixa, NovaAnalise, SinalDetectado } from '../types/Analise/analise'

const CHAVE = 'desconfie:analises'

interface Regra {
  codigo: string
  nome: string
  peso: number
  critico: boolean
  regex: RegExp
}

const REGRAS: Regra[] = [
  { codigo: 'URGENCIA', nome: 'Pressa', peso: 0.2, critico: false, regex: /\b(agora|só hoje|urgente|últimas? horas|imediatamente|expira)\b/i },
  { codigo: 'PEDE_PIX', nome: 'Pede PIX', peso: 0.25, critico: false, regex: /\b(pix|transfer[êe]ncia|dep[óo]sito|taxa|boleto)\b/i },
  { codigo: 'PEDE_DADOS', nome: 'Pede dados', peso: 0.3, critico: false, regex: /\b(senha|c[óo]digo|token|cpf|cart[ãa]o|cvv|\[cpf\]|\[cart[ãa]o\])\b/i },
  { codigo: 'AMEACA_BLOQUEIO', nome: 'Ameaça de bloqueio', peso: 0.2, critico: false, regex: /\b(bloquei\w*|suspens\w*|cancelad\w*|irregular|pend[êe]ncia|d[íi]vida)\b/i },
  { codigo: 'PREMIO', nome: 'Prêmio', peso: 0.2, critico: false, regex: /\b(pr[êe]mio|sorteio|ganhou|contemplad\w*|resgate)\b/i },
  { codigo: 'FINGE_PARENTE', nome: 'Finge ser parente', peso: 0.25, critico: false, regex: /\b(troquei de n[úu]mero|oi m[ãa]e|oi pai|novo n[úu]mero)\b/i },
  { codigo: 'LINK_ENCURTADO', nome: 'Link encurtado', peso: 0.15, critico: false, regex: /\b(bit\.ly|tinyurl|encurtador|is\.gd|cutt\.ly|t\.co)\b/i },
  { codigo: 'URL_SUSPEITA', nome: 'Link suspeito', peso: 0.35, critico: false, regex: /https?:\/\/[^\s]*(\.xyz|\.top|\.click|\.icu|-?seguro|atualiz|verific|liberar)/i },
  { codigo: 'DOMINIO_IMITA_MARCA', nome: 'Imita uma marca', peso: 0, critico: true, regex: /https?:\/\/[^\s]*(nubank|itau|bradesco|caixa|santander|correios|gov|mercadopago)[^\s]*\.(?!com\.br\b)[a-z]/i },
]

export function faixaDe(nota: number, temCritico: boolean): Faixa {
  if (temCritico || nota >= 0.7) return 'golpe'
  if (nota >= 0.4) return 'suspeito'
  return 'seguro'
}

function detectar(mensagem: string): SinalDetectado[] {
  return REGRAS.filter((r) => r.regex.test(mensagem)).map(({ codigo, nome, peso, critico }) => ({
    codigo,
    nome,
    peso,
    critico,
  }))
}

export function analisarLocal(nova: NovaAnalise): Analise {
  const sinais = detectar(nova.mensagem)
  const soma = sinais.reduce((acc, s) => acc + s.peso, 0)
  /* A nota nao passa de 1: tres sinais pesados ja estourariam a escala. */
  const nota = Math.min(1, Number(soma.toFixed(2)))
  const temCritico = sinais.some((s) => s.critico)

  return {
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
    canal: nova.canal,
    mensagem: nova.mensagem,
    nota,
    faixa: faixaDe(nota, temCritico),
    sinais,
  }
}

/* localStorage pode falhar (modo privado, cota). O historico nao vale uma tela
   quebrada, entao a leitura e a escrita engolem o erro. */
export function lerHistorico(): Analise[] {
  try {
    const bruto = localStorage.getItem(CHAVE)
    return bruto ? (JSON.parse(bruto) as Analise[]) : []
  } catch {
    return []
  }
}

export function salvarNoHistorico(analise: Analise) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify([analise, ...lerHistorico()]))
  } catch {
    /* sem historico persistido nesta sessao */
  }
}

export function limparHistorico() {
  try {
    localStorage.removeItem(CHAVE)
  } catch {
    /* nada a fazer */
  }
}
