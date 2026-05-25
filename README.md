# 📋 Ficha de Acompanhamento e Diagnóstico do Projeto

> Este documento foi preenchido pela equipe para alinhar as expectativas do projeto com os mentores e organizadores. Respostas diretas, honestas e realistas.

---

## 🏛️ 1. Identificação da Equipe

- **Nome da Equipe:** FlowUp
- **Nome dos Integrantes e Períodos:**
  - Lucas Bergmann — 3º período de Sistemas de Informação
  - Thauan Rabelo — 3º período de Sistemas de Informação
  - Iago Ferreira — 3º período de Sistemas de Informação
  - Jonas Pereira — 3º período de Sistemas de Informação
- **Link do Repositório (GitHub):** https://github.com/BergmannLc/hackaton
- **Link do Rascunho/Design:** Não usamos Figma/Excalidraw separados — o próprio frontend em React é o nosso protótipo navegável. Toda iteração visual aconteceu direto no código com Tailwind.

---

## 💡 2. O Problema e a Proposta de Valor

### 2.1. Qual problema real e específico vocês estão resolvendo?

Alunos universitários precisam acumular **horas complementares** ao longo da graduação participando de palestras, workshops e cursos. Hoje, na maioria das faculdades, esse processo é manual e cheio de pontos de falha: inscrições em papel, presença marcada com lista assinada (fácil de fraudar com foto compartilhada no grupo), validação de certificados externos exige protocolo físico na secretaria, e a comunicação dos eventos chega tarde ou nem chega no aluno certo. Resultado: alunos perdem horas legítimas e a coordenação não tem dados pra entender o que funciona.

### 2.2. O diferencial da solução está claro? O que torna a ideia única?

Três diferenciais que nenhuma planilha do Google e nenhum sistema atual da faculdade entrega:

1. **QR Code invertido** — quem exibe o QR é o **professor**, não o aluno. O aluno escaneia com o celular dele. Acaba a foto compartilhada no grupo do WhatsApp e a fila no professor pra assinar lista. Token rotativo no servidor com expiração de 30 segundos.
2. **Multi-curso de verdade** — Medicina, Direito, Engenharia Civil, Arquitetura, Comunicação Social, Pedagogia e mais 6 cursos no mesmo sistema, com filtros e palestras direcionadas. Não é "sistema de TI" disfarçado de universal.
3. **Hub de cursos patrocinados** — alunos completam horas com cursos curados pela coordenação, gratuitos via parceiros (Alura, Rocketseat, FGV, Albert Einstein, OAB, Sebrae, Senai), sem sair da plataforma. Trilhas FlowUp guiam o aluno por sequências de cursos com tema único.

---

## ⚙️ 3. A Solução na Prática

### 3.1. Como a solução funciona para o usuário final?

**Aluno:**
1. Faz login com matrícula e senha.
2. Vê eventos filtrados pelo seu curso (com hero rotativo de destaque).
3. Inscreve-se em um clique. Recebe toast confirmando.
4. No dia do evento, abre o app, vai no card do evento, clica em "Registrar Presença" e aponta a câmera para o QR Code projetado pelo professor.
5. Presença registrada, horas computadas automaticamente.
6. Em paralelo, navega no **Hub** pra fazer cursos online (com parceiros) e submeter certificado para validar horas extras.

**Professor / Coordenação:**
1. Cria o evento com data, local, vagas e cursos elegíveis.
2. No dia, clica em "Presença" no card do evento → escolhe a aba **QR Code** → projeta o token em tela cheia. Conforme alunos escaneiam, o contador sobe em tempo real.
3. Se preferir, usa a aba **Chamada Manual** como fallback, marcando presença na lista.
4. Ao encerrar, baixa CSV completo dos presentes e ausentes.
5. Na aba "Tarefas", valida sugestões da comunidade e transforma ideias aprovadas em eventos.

### 3.2. Quais são as principais tecnologias, linguagens ou ferramentas que decidiram usar?

| Camada       | Tecnologia                                                              |
| ------------ | ----------------------------------------------------------------------- |
| **Frontend** | React 19 + Vite + Tailwind CSS 4 + Framer Motion + react-hot-toast      |
| **Backend**  | Python 3.14 + FastAPI + SQLAlchemy + Pydantic + python-jose (JWT)       |
| **Banco**    | PostgreSQL 16 (local)                                                   |
| **Auth**     | JWT HS256 com bcrypt (60 min de expiração)                              |
| **QR Code**  | `qrcode` (backend) + `qrcode.react` + `@yudiel/react-qr-scanner` (front)|

**Arquitetura:** API REST separada (Front e Back independentes), backend organizado em camadas Controller → Service → Repository → Model com DTOs Pydantic, exatamente como o guia recomenda na Fase 6.2.

---

## 👥 4. Gestão e Divisão de Trabalho

### 4.1. Quem está fazendo o quê na equipe?

- **Lucas Bergmann:** Frontend (React/Tailwind), integração com API, mocks, vídeo da demo.
- **Thauan Rabelo:** Backend (FastAPI), arquitetura de serviços, autenticação JWT, vídeo da demo, slides do pitch.
- **Iago Ferreira:** Frontend (React/Tailwind), telas, criação de Hooks.
- **Jonas Pereira:** Backend (modelos SQLAlchemy), banco de dados, repositories + apresentação. 

---

## 🛠️ 5. Status Atual do Desenvolvimento (O MVP)

### 5.1. Vocês já começaram o protótipo visual ou o código do MVP? Qual o percentual de conclusão estimado?

Status: ( ) Não começamos | ( ) Apenas rascunho visual | ( ) Código inicial iniciado | **(X) Mais da metade pronto**

Estimativa: **~85% do MVP funcional**. Estrutura completa do backend e frontend prontas. Falta apenas conectar algumas telas do front nas APIs reais (hoje rodam em mock) e o deploy.

### 5.2. O projeto já funciona em alguma parte? O que já está codificado e operacional?

Frontend (operacional, rodando em `localhost:5173`):
- Login com diferenciação de perfil (aluno / professor)
- Tela "Explorar" com 24 eventos, filtros por categoria, curso, data e busca
- Hero rotativo de eventos próximos
- Modal de detalhes do evento com inscrição/cancelamento e botão de leitura de QR
- Perfil do aluno com barra de horas (92/120h), agendados, histórico, sugestões
- Painel do professor com gestão de eventos, geração de QR Code real, chamada manual, exportação CSV
- Aba "Tarefas" pra aprovar/rejeitar sugestões
- **Hub** completo com 18 cursos de 10 parceiros, 4 Trilhas FlowUp, filtros e modal de validação de horas
- Tema dark consistente, mobile-first, animações com framer-motion

Backend (operacional, rodando em `localhost:8000`):
- API REST com Swagger automático em `/docs`
- Autenticação JWT funcional (`POST /auth/login`)
- 7 controllers: User, Curso, Evento, Sugestao, Inscricao, QrCode, Auth
- 7 modelos SQLAlchemy com migrations automáticas (`create_all`)
- Cadastro público de aluno + cadastro restrito de credenciado
- QR Code com token rotativo (30s de expiração) e validação de presença
- Restrição de acesso por perfil (`require_aluno` / `require_credenciado`)

### 5.3. O que foi ou será "Mockado" (dados fictícios/estáticos)?

O frontend tem **plano B completo via mocks** em `src/services/mocks.js`:
- 24 eventos cobrindo 12 áreas (TI, Saúde, Direito, Engenharia, Arquitetura, Comunicação, etc.)
- 9 sugestões de alunos de cursos variados
- 18 cursos no Hub com 10 parceiros institucionais (Alura, Rocketseat, FGV, Albert Einstein, OAB, etc.)
- 4 Trilhas FlowUp curadas
- 14 alunos fictícios pra popular a chamada manual

Se o backend cair na demo, o front continua funcional 100% com esses dados. Fluxo do QR Code também simula leitura/escrita localmente.

### 5.4. O que ainda falta finalizar obrigatoriamente para a entrega?

- [ ] Conectar telas que ainda rodam em mock à API real (hooks/factories já prontos, falta substituir `useState(INITIAL_*)` por `useEffect + fetch`)
- [ ] Gravar vídeo da demo como rede de segurança
- [ ] Slides do pitch
- [ ] Limpar histórico do Git de commits sem padrão (ou só não piorar daqui pra frente)

Não-obrigatórios (deixaremos pra depois se sobrar tempo):
- Deploy (Vercel + Render + Supabase)
- Notificações por e-mail
- Configurar PWA (manifest + service worker)

---

## 🚧 6. Obstáculos e Pedidos de Ajuda

### 6.1. Qual maior dificuldade da equipe?

Três pontos onde batemos a cabeça por mais tempo:

1. **Setup do PostgreSQL no Windows:** o `psycopg2` mascarava o erro real ("banco não existe") com um `UnicodeDecodeError` confuso por causa do locale pt-BR. Quase ficamos em loop até descobrir que precisava criar o banco `hackathon` antes do `create_all`.
2. **Encoding de arquivos em Windows:** `requirements.txt` salvo em UTF-16 quebrava `pip install` em qualquer máquina não-Windows, e o editor padrão padding null bytes no fim dos arquivos quebrava o `py_compile`. Tivemos que normalizar tudo pra UTF-8 sem BOM.
3. **Combinar nomes de variáveis Front × Back:** o backend usa `nome`/`matricula` (pt-BR), o front usa `name`/`matricula` (mix). Tivemos que criar uma camada de **Factories** no front que mapeia o formData do React pro payload exato esperado pelo FastAPI. Sem isso, requisições falhavam silenciosamente.

---

## 🎤 7. Preparação para o Show (O Pitch)

### 7.1. Como será a estratégia de apresentação de vocês na segunda-feira?

**Estratégia:** Slides + vídeo gravado da demo.

- O pitch é apoiado em slides com a história do problema, demonstração de uso (vídeo gravado), arquitetura técnica e diferenciais.
- O **vídeo da demo** roda direto dentro do slide. Isso elimina o risco do wifi do evento falhar, do backend hibernar, ou de qualquer travamento ao vivo derrubar a apresentação.
- A auditoria do GitHub no domingo à noite vai confirmar que o código existe e foi feito por nós.

---

## 📦 Como rodar localmente

### Pré-requisitos
- Node.js 20+ e npm
- Python 3.11+ (testado em 3.14)
- PostgreSQL 16 rodando localmente

### Banco
```bash
psql -U postgres -h localhost -c "CREATE DATABASE hackathon;"
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env         # edite com a senha do seu Postgres
uvicorn main:app --reload
# -> http://localhost:8000/docs (Swagger)
```

Pra criar um admin inicial:
```bash
python Populate.py
# matricula=admin, senha=admin123, role=credenciado
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# -> http://localhost:5173
```

---

*Projeto acadêmico — 1º Hackathon Híbrido UGB, 2026.*
