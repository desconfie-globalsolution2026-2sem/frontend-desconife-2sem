import type { Modelo } from '../../types/Sobre/modelo'

export const modelos: Modelo[] = [
  {
    pergunta: 'Essa mensagem é golpe?',
    resumo: 'Lê o texto e aprende as palavras e combinações que aparecem em golpes.',
    tecnica: 'TF-IDF + Regressão Logística, comparada com Naive Bayes',
    dados:
      'Mensagens de golpe públicas, exemplos em português do Brasil e mensagens legítimas anonimizadas',
    metrica: 'Recall da classe golpe, testado só com mensagens reais',
  },
  {
    pergunta: 'Esse link é phishing?',
    resumo: 'Olha o formato do endereço: tamanho, subdomínios, HTTPS e caracteres estranhos.',
    tecnica: 'Random Forest, comparada com Regressão Logística',
    dados: 'LegitPhish, base pública com 101 mil URLs',
    metrica: 'Recall e precisão, com matriz de confusão e curva ROC',
  },
]
