import type { Etapa } from '../../types/Sobre/etapa'

export const etapas: Etapa[] = [
  {
    titulo: 'Site',
    tech: 'React · Vite · TypeScript',
    texto: 'Você cola a mensagem ou o link e envia para análise.',
    destaque: false,
  },
  {
    titulo: 'Preparo e IA',
    tech: 'Python · Flask · scikit-learn',
    texto:
      'Limpa o texto, mascara CPF, telefone e e-mail, e roda os modelos que dizem a chance de golpe.',
    destaque: false,
  },
  {
    titulo: 'API de decisão',
    tech: 'Java · Spring Boot',
    texto:
      'Valida o login, faz a conta final, grava a análise e devolve o veredito para o site.',
    destaque: true,
  },
  {
    titulo: 'Banco de dados',
    tech: 'Oracle',
    texto: 'Recebe da API Java as análises, os sinais e os feedbacks.',
    destaque: false,
  },
]
