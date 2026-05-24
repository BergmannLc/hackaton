# Guia de Integração: Frontend (React) ↔ Backend (FastAPI)

Como responsável pelo frontend do seu grupo no hackathon, seu principal objetivo agora é preparar o código (que atualmente funciona com dados fixos/mockados) para consumir dados reais e dinâmicos de uma API. Seus colegas usarão **FastAPI** (em Python) para criar essa API.

Aqui está o passo a passo exato de como você deve estruturar o frontend para essa integração ser tranquila e rápida:

## 1. Centralize as Chamadas de API (Camada de Serviços)
Nunca faça chamadas diretas com `fetch` ou `axios` dentro dos seus componentes React (`App.jsx`). Isso vira uma bagunça rápido. Crie uma pasta específica para gerenciar a comunicação com o backend.

**O que fazer:**
Crie uma pasta `src/services/` (ou `src/api/`) e crie arquivos para cada "domínio" da sua aplicação:
- `src/services/api.js` (Configuração base do Axios ou Fetch)
- `src/services/auth.js` (Login, Logout)
- `src/services/events.js` (Buscar eventos, inscrever-se)
- `src/services/user.js` (Buscar horas complementares, perfil)

*Exemplo de configuração com Axios (`src/services/api.js`):*
```javascript
import axios from 'axios';

// A URL base virá de uma variável de ambiente
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Interceptor para injetar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@FlowUp:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 2. Variáveis de Ambiente
O frontend precisa saber para onde enviar as requisições. Durante o hackathon será o `localhost`, mas se vocês derem deploy, a URL vai mudar.
**O que fazer:**
Crie um arquivo `.env` na raiz do projeto (junto do `package.json`):
```env
VITE_API_URL=http://localhost:8000
```
> [!IMPORTANT]  
> Avise seu time de backend que o frontend vai rodar (geralmente) em `http://localhost:5173` (Vite) e o backend (FastAPI) em `http://localhost:8000`. **Eles precisam configurar o CORS (Cross-Origin Resource Sharing)** no FastAPI liberando a porta do seu frontend, senão o navegador vai bloquear todas as requisições.

## 3. Substituindo os Mocks por Estados Reais
Atualmente, você tem variáveis fixas como `INITIAL_EVENTS` e `MOCK_USER` no topo do `App.jsx`. Você precisa trocar isso por estados que iniciam vazios e são preenchidos via API.

**O que fazer:**
```javascript
import { useState, useEffect } from 'react';
import api from './services/api'; // Importa a api que você configurou

const App = () => {
  // 1. Troque const por useState
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Use o useEffect para buscar os dados ao carregar a página
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Exemplo de como você vai buscar os dados reais:
        const responseEvents = await api.get('/events');
        setEvents(responseEvents.data);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      } finally {
        setLoading(false);
      }
    };

    // Só busca dados se o usuário estiver logado
    if (user) {
      fetchDashboardData();
    }
  }, [user]); // Roda quando o usuário logar
  
  // ... resto do código
}
```

## 4. O Fluxo de Login (Autenticação JWT)
O FastAPI costuma usar **JWT (JSON Web Tokens)** para autenticação. O fluxo funciona assim:
1. O usuário digita email e senha na sua tela de Login.
2. Você envia um `POST /login` para o FastAPI.
3. O FastAPI valida e devolve um token (ex: `eyJhbGciOiJIUzI1...`).
4. Você salva esse token no `localStorage` do navegador do usuário.
5. Em toda requisição futura (ex: "Me dê os eventos"), o seu Axios envia esse token no cabeçalho (como configuramos no Passo 1).

*Exemplo de função de login no frontend:*
```javascript
const handleLogin = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    const { token, userData } = response.data; // O que o backend retornar
    
    // Salva o token no navegador
    localStorage.setItem('@FlowUp:token', token);
    
    // Atualiza o estado do usuário logado
    setUser(userData);
  } catch (error) {
    alert("Email ou senha incorretos");
  }
};
```

## 5. Como trabalhar em paralelo no Hackathon (Mock API)
Vocês estão correndo contra o tempo. O backend não estará pronto imediatamente. 
**O que fazer:**
Crie os arquivos da camada de serviços (`src/services/...`), mas no início faça as funções retornarem os seus dados mockados usando `Promises`.
Quando a API do FastAPI ficar pronta, você só troca o conteúdo da função em UM lugar, e a aplicação inteira passa a consumir dados reais mágicamente.

*Exemplo de Mock Temporário (em `src/services/events.js`):*
```javascript
import { INITIAL_EVENTS } from '../mocks'; // Mova os mocks para um arquivo separado

export const getEvents = async () => {
  // Simula o delay da rede (meio segundo)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: INITIAL_EVENTS }); // Simula a resposta do Axios
    }, 500);
  });
};

// --- QUANDO O BACKEND FICAR PRONTO, VOCÊ SÓ MUDA PARA ISTO: ---
// import api from './api';
// export const getEvents = async () => {
//   return api.get('/events');
// };
```

## Resumo do que pedir para a equipe de Backend:
Alinhe isso com eles desde já:
1. **"Habilitem o CORS no FastAPI para a minha porta do localhost (ou para todas com `*` durante o dev)."**
2. **"Vamos usar JWT para autenticação? Vocês vão me mandar um campo `access_token` no login?"**
3. **"Mandem os contratos/payloads:"** Peça que eles escrevam qual formato de JSON eles vão te enviar (ex: formato de datas) para você já ir moldando o frontend para bater com o que eles vão enviar. (Se eles usarem Pydantic no FastAPI, eles já geram uma documentação Swagger/OpenAPI automaticamente em `http://localhost:8000/docs`).
