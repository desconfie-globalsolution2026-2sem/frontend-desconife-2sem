import type { GrupoFaq } from '../../types/FAQ/pergunta'

export const grupos: GrupoFaq[] = [
  {
    titulo: 'Como usar',
    perguntas: [
      {
        pergunta: 'O Desconfie é de graça?',
        resposta:
          'Sim, para quem recebe a mensagem. Quem paga são bancos e fintechs que colocam o Desconfie nos próprios apps.',
      },
      {
        pergunta: 'Preciso criar conta?',
        resposta:
          'Não. Você pode analisar de forma anônima. Com cadastro, você ganha o histórico das suas análises.',
      },
      {
        pergunta: 'Como copio uma mensagem do WhatsApp?',
        resposta:
          'Segure o dedo em cima da mensagem até ela ficar marcada, toque em Copiar e depois segure o dedo no campo do Desconfie e toque em Colar.',
      },
      {
        pergunta: 'Posso analisar só um link?',
        resposta:
          'Pode. Cole apenas o endereço. O modelo de links avalia o formato do endereço mesmo sem texto em volta.',
      },
    ],
  },
  {
    titulo: 'Sobre o resultado',
    perguntas: [
      {
        pergunta: 'O Desconfie acerta sempre?',
        resposta:
          'Não. Nenhum sistema acerta sempre. Por isso mostramos os motivos: assim você também julga. Na dúvida, confirme pelo canal oficial da empresa.',
      },
      {
        pergunta: 'Deu "sem sinais", então posso clicar?',
        resposta:
          'Significa que não encontramos sinais conhecidos. Golpes novos aparecem todo dia. Nunca passe senha, código do SMS ou dados do cartão por mensagem.',
      },
      {
        pergunta: 'O que é um sinal crítico?',
        resposta:
          'É um sinal grave o bastante para o alerta máximo sozinho. Hoje é o link que usa o nome de uma marca, como um banco, num site que não é o oficial.',
      },
      {
        pergunta: 'Como aviso que o resultado estava errado?',
        resposta:
          'Na tela do resultado há os botões "era golpe" e "não era golpe". Esse retorno ajuda a melhorar os modelos.',
      },
    ],
  },
  {
    titulo: 'Seus dados',
    perguntas: [
      {
        pergunta: 'Vocês guardam o que eu colo?',
        resposta:
          'Guardamos a mensagem com CPF, telefone e e-mail trocados por marcadores como [CPF]. Isso serve para o seu histórico e para melhorar os modelos.',
      },
      {
        pergunta: 'Vocês veem minhas conversas do WhatsApp?',
        resposta:
          'Não. O Desconfie só recebe o que você copia e cola. Não temos acesso ao seu celular nem às suas conversas.',
      },
    ],
  },
  {
    titulo: 'Golpes e o que fazer',
    perguntas: [
      {
        pergunta: 'Banco manda mensagem com link?',
        resposta:
          'Bancos podem mandar avisos, mas não pedem senha, código ou PIX por mensagem e não mandam link para "regularizar" conta. Na dúvida, abra o app do banco você mesmo.',
      },
      {
        pergunta: 'O que faço se já cliquei ou paguei?',
        resposta:
          'Ligue para o banco pelo número do verso do cartão, troque suas senhas e registre um boletim de ocorrência. Na página de Contato tem o passo a passo completo.',
      },
    ],
  },
]
