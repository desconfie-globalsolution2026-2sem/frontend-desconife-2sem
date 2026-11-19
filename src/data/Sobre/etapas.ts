import type { Etapa } from '../../types/Sobre/etapa'

/* Ordem real de uma analise: o site so fala com o Java, e o Java chama a IA. */
export const etapas: Etapa[] = [
  {
    titulo: 'Site',
    tech: 'React · Vite · TypeScript',
    texto:
      'Você entra na conta e cola a mensagem, o link ou o print. O site confere o formulário, troca CPF, telefone, e-mail e cartão por marcadores e envia para a API Java.',
    destaque: false,
  },
  {
    titulo: 'API de decisão',
    tech: 'Java · Spring Boot',
    texto:
      'Confere os padrões de golpe cadastrados no banco e gera a nota das regras. Pede a nota da IA, tira a média, decide o semáforo e devolve o veredito para o site.',
    destaque: true,
  },
  {
    titulo: 'Inteligência artificial',
    tech: 'Python · Flask · scikit-learn',
    texto:
      'Chamada pelo Java. Lê o texto do print (OCR) e roda o modelo de mensagem ou o de link, devolvendo a chance de golpe.',
    destaque: false,
  },
  {
    titulo: 'Banco de dados',
    tech: 'Oracle',
    texto:
      'Guarda os padrões de golpe, as análises, o que pesou em cada uma, os alertas do círculo de confiança e o seu feedback.',
    destaque: false,
  },
]
