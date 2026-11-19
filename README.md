# 🕵️ Desconfie — Detector de Golpes

> Cole a mensagem, o link ou o print que você recebeu e descubra, antes de clicar ou pagar, se é golpe. O Desconfie aponta o que parece fraude e explica em palavras simples o que fazer em seguida.

---

## 📋 Descrição

O **Desconfie** é o front-end da solução desenvolvida para a **Global Solution 2026/2 da FIAP**, no tema **CitizenTech**, na disciplina de **Front-End Design Engineering**.

**O problema:** golpes por SMS, WhatsApp e e-mail ("oi mãe, troquei de número", falso boleto, link que imita o banco) fazem vítimas todos os dias. Quem cai costuma ser quem tem menos acesso a informação para desconfiar.

**A solução:** uma SPA em que a pessoa cola o que recebeu e, em segundos, recebe um veredito (**Muito provável golpe**, **Suspeito** ou **Sem sinais de golpe**), com uma nota de 0 a 100, o que pesou na decisão e a orientação do que fazer. A análise é feita pela **API REST em Java** da disciplina de Domain Driven Design, que combina um motor de regras com um modelo de IA. O resultado fica salvo na conta e pode ser compartilhado com um **círculo de confiança** (familiares que recebem alerta quando alguém do círculo recebe um golpe).

O site foi construído com **React, TypeScript, Vite e Tailwind CSS**, com roteamento via **React Router**, requisições com **Fetch API** e sem bibliotecas de UI prontas.

---

## 🚀 Funcionalidades

- **Home** com a proposta, os sinais de golpe mais comuns e como funciona a análise
- **Integrantes** com a apresentação da equipe e os ODS atendidos
- **Sobre**, **FAQ** e **Contato** (formulário com validação e passos de socorro para quem já caiu em golpe)
- **Cadastro e login** ligados na API, com sessão guardada no navegador ("manter conectado")
- **Analisar** mensagem, link ou print (imagem), com validação, estado de carregamento e mensagens de erro claras
- **Resultado da análise** com veredito, nota, categoria do golpe, orientação, padrões encontrados e notas das regras e da IA
- **Feedback** ("era golpe" ou "não era golpe") enviado para a API para melhorar a detecção
- **Minhas análises** com o histórico do usuário, filtro por veredito, detalhe e exclusão
- **Página da análise** em rota dinâmica (`/analises/:id`)
- **Círculo de confiança**: guardião, dependentes, alertas e análises do círculo
- **Menu mobile** com botão de abrir e fechar
- **Página 404** para endereços que não existem
- **Design responsivo** para mobile (390 × 844), tablet (768 × 1024) e desktop (1440 × 900)

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| React 19 | Biblioteca de componentes da interface |
| TypeScript | Tipagem de componentes, props, estados e respostas da API |
| Vite | Build tool e servidor de desenvolvimento |
| React Router DOM 7 | Rotas estáticas e dinâmicas da SPA |
| Tailwind CSS 4 | Estilização utilitária de toda a interface, com tokens de tema via `@theme` |
| Fetch API | Todas as chamadas HTTP para a API Java (sem Axios) |
| Oxlint | Linting do código |
| Vercel | Deploy do front-end |
| Git + GitHub | Versionamento e colaboração |

---

## 🔌 Integração com a API Java

A URL da API vem da variável de ambiente `VITE_API_URL`. Toda requisição passa por `src/services/api.ts`, que usa `fetch`, trata o JSON de erro padrão da API (`{ status, erro, mensagem, campos }`) e expõe atalhos `get`, `post`, `put`, `patch` e `del`. Cada recurso tem seu arquivo de serviço em `src/services/endpoints/`.

| Tela | Método | Endpoint |
|---|---|---|
| Cadastro | `POST` | `/usuarios` |
| Entrar | `POST` | `/usuarios/login` |
| Analisar | `POST` | `/usuarios/{id}/analises` |
| Minhas análises | `GET` | `/usuarios/{id}/analises` |
| Página da análise | `GET` | `/analises/{id}` |
| Feedback | `PUT` | `/analises/{id}` |
| Excluir análise | `DELETE` | `/analises/{id}` |
| Círculo de confiança | `GET` / `POST` / `DELETE` | `/usuarios/{id}/guardiao`, `/usuarios/{id}/dependentes`, `/usuarios/{id}/alertas`, `/usuarios/{id}/circulo/analises` |
| Alertas | `PATCH` | `/alertas/{id}/lido` |
| Minha conta | `PUT` / `DELETE` | `/usuarios/{id}` |
| Home (sinais) | `GET` | `/padroes` |
| Abertura do site | `GET` | `/health` (acorda a API no Render) |

Os tipos de requisição e resposta (DTOs) ficam em `src/types/Api/dtos.ts`.

---

## 🧭 Rotas

| Rota | Página | Tipo |
|---|---|---|
| `/` | Home | Estática |
| `/integrantes` | Integrantes | Estática |
| `/sobre` | Sobre | Estática |
| `/faq` | Perguntas frequentes | Estática |
| `/contato` | Contato | Estática |
| `/entrar` | Login | Estática |
| `/cadastro` | Criar conta | Estática |
| `/analisar` | Analisar mensagem, link ou print | Estática |
| `/minhas-analises` | Histórico do usuário | Estática |
| `/circulo` | Círculo de confiança | Estática |
| `/minha-conta` | Editar dados e excluir a conta | Estática |
| `/analises/:id` | Página de uma análise | **Dinâmica** |
| `*` | Página não encontrada (404) | Coringa |

---

## 📱 Responsividade

O layout é **mobile-first**: as classes do Tailwind sem prefixo valem para o celular, e os breakpoints ampliam o layout em telas maiores.

| Prefixo Tailwind | Breakpoint | Faixa de tela |
|---|---|---|
| _(sem prefixo)_ | — | Mobile, até 767px |
| `md:` | `48rem` (768px) | Tablet, 768px+ |
| `lg:` | `64rem` (1024px) | Desktop, 1024px+ (o menu deixa de ser hambúrguer) |

Exemplo: `grid gap-9 md:grid-cols-2` empilha o formulário de contato e os passos de socorro no celular e os coloca lado a lado a partir do tablet.

---

## 📁 Estrutura de Pastas

```
desconfie-front-end/
│
├── index.html                    # Ponto de entrada da aplicação
├── public/                       # Arquivos estáticos (favicon)
├── vercel.json                   # Rewrite de SPA para as rotas abrirem direto na Vercel
├── .env.example                  # Modelo da variável VITE_API_URL
│
└── src/
    ├── main.tsx                  # Bootstrap da aplicação (React + global.css)
    ├── App.tsx                   # Componente raiz (SessaoProvider + BrowserRouter)
    ├── global.css                # Import do Tailwind CSS + tokens de tema (@theme)
    │
    ├── routes/
    │   └── AppRoutes.tsx         # Todas as rotas da SPA (estáticas, dinâmica e 404)
    │
    ├── pages/                    # Uma pasta por página (padrão pages/<Nome>/<Nome>.tsx)
    │   ├── Home/
    │   ├── QuemSomos/            # Página de integrantes
    │   ├── Sobre/
    │   ├── FAQ/
    │   ├── Contato/
    │   ├── Entrar/
    │   ├── Cadastro/
    │   ├── Analisar/             # Envio de mensagem, link ou print (POST)
    │   ├── MinhasAnalises/       # Histórico do usuário (GET)
    │   ├── DetalheAnalise/       # Rota dinâmica /analises/:id (GET, PUT, DELETE)
    │   ├── Circulo/              # Círculo de confiança
    │   └── NaoEncontrada/        # Página 404
    │
    ├── components/
    │   ├── layout/               # Header (com menu mobile), Footer, Layout, MenuConta, EstadoCarga, PedirLogin
    │   ├── analise/              # CardVeredito, SeloFaixa, Feedback, EscolherImagem
    │   ├── circulo/              # SeuGuardiao, Dependentes, Alertas, AnalisesDoCirculo, Bloco
    │   ├── form/                 # CampoSenha, MsgErro, classes de campo
    │   └── button/               # Button (botão ou link de rota)
    │
    ├── services/
    │   ├── api.ts                # Camada de rede com fetch e tratamento de erro
    │   └── endpoints/            # Um arquivo por recurso: usuarios, analises, alertas, categorias, padroes, health
    │
    ├── hooks/                    # useFormulario, useCarregar (loading/erro/dados), useSessao
    ├── context/                  # Sessão do usuário logado
    ├── data/                     # Textos e listas estáticas de cada página
    ├── types/                    # Interfaces e tipos, incluindo os DTOs da API (types/Api/dtos.ts)
    ├── utils/                    # Validações, formatação pt-BR, máscara de dados pessoais, imagem
    └── assets/                   # Logo e fotos da equipe
```

---

## 🖥️ Como Usar

- **Repositório:** https://github.com/desconfie-globalsolution2026-2sem/frontend-desconife-2sem
- **Deploy (Vercel):** https://desconfie-eight.vercel.app
- **API (Java/DDD) publicada:** https://java-desconfie-api.onrender.com
- **Documentação da API (Swagger):** https://java-desconfie-api.onrender.com/swagger-ui/index.html
- **Vídeo de apresentação (YouTube):** https://youtu.be/imekWGyVqMo

> A API está no plano gratuito do Render, que desliga o serviço quando fica parado. A primeira requisição do dia pode levar até um minuto.

### Executando localmente

```bash
# 1. Clone o repositório
git clone https://github.com/desconfie-globalsolution2026-2sem/frontend-desconife-2sem.git

# 2. Acesse a pasta do projeto
cd frontend-desconife-2sem

# 3. Instale as dependências
npm install

# 4. Configure a URL da API (copie o .env.example para .env)
cp .env.example .env
# e troque VITE_API_URL por https://java-desconfie-api.onrender.com

# 5. Rode o servidor de desenvolvimento
npm run dev
```

O projeto ficará disponível em `http://localhost:5173`.

Outros scripts disponíveis:

```bash
npm run build     # gera o build de produção
npm run preview   # serve o build de produção localmente
npm run lint      # roda o linter (Oxlint)
```

---

## 👥 Autores e Créditos

| Foto | Nome | RM | Turma | GitHub | LinkedIn |
|---|---|---|---|---|---|
| <img src="./src/assets/foto-pedro.jpeg" width="80" alt="Pedro" /> | **Pedro Amaro Pires** | RM570636 | 1TDSPW | [pedroamarop](https://github.com/pedroamarop) | [pedro-amaro-pires](https://www.linkedin.com/in/pedro-amaro-pires) |
| <img src="./src/assets/foto-juan.jpeg" width="80" alt="Juan" /> | **Juan Souza Marques** | RM573469 | 1TDSPJ | [juansouzamarques](https://github.com/juansouzamarques) | [juan-marques](https://www.linkedin.com/in/juan-marques-297b293b4/) |
| <img src="./src/assets/foto-lucas.jpeg" width="80" alt="Lucas" /> | **Lucas Leite Carlos** | RM571985 | 1TDSPJ | [Leite-1309](https://github.com/Leite-1309) | [lucas-leite-carlos](https://www.linkedin.com/in/lucas-leite-carlos-5b72973a9/) |
| <img src="./src/assets/foto-matheus.jpeg" width="80" alt="Matheus" /> | **Matheus Matsushita de Souza** | RM570017 | 1TDSPJ | [Matsushita1907](https://github.com/Matsushita1907) | [matheus-matsushita](https://www.linkedin.com/in/matheus-matsushita-de-souza-543269346/) |

---

## 🔗 Repositório

[![GitHub](https://img.shields.io/badge/GitHub-Repositório_Público-181717?style=for-the-badge&logo=github)](https://github.com/desconfie-globalsolution2026-2sem/frontend-desconife-2sem)

> **Link direto:** https://github.com/desconfie-globalsolution2026-2sem/frontend-desconife-2sem

---

## 🎥 Vídeo de Apresentação

Apresentação das páginas, do fluxo de análise e da integração com a API Java (até 3 minutos):

> **Link:** https://youtu.be/imekWGyVqMo

---

## 📬 Contato

Para dúvidas ou sugestões sobre o projeto:

- **Pedro Amaro** — [LinkedIn](https://www.linkedin.com/in/pedro-amaro-pires) · [GitHub](https://github.com/pedroamarop)
- **Juan Marques** — [LinkedIn](https://www.linkedin.com/in/juan-marques-297b293b4/) · [GitHub](https://github.com/juansouzamarques)
- **Lucas Leite** — [LinkedIn](https://www.linkedin.com/in/lucas-leite-carlos-5b72973a9/) · [GitHub](https://github.com/Leite-1309)
- **Matheus Matsushita** — [LinkedIn](https://www.linkedin.com/in/matheus-matsushita-de-souza-543269346/) · [GitHub](https://github.com/Matsushita1907)

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos — **FIAP Global Solution 2026/2 · CitizenTech**.
Todos os direitos reservados aos autores.

---

<p align="center">
  Desenvolvido com 🕵️ pela equipe <strong>Desconfie</strong> — FIAP 2026
</p>
