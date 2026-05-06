# TaskFlow — Kanban para Times

Sistema completo de gerenciamento de tarefas estilo Trello/Monday.com.
**Stack**: React + Vite + Supabase + Tailwind CSS

---

## 🚀 Como rodar em 5 passos

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Clique em **New Project** e preencha os dados
3. Aguarde a criação (cerca de 2 minutos)
4. Vá em **SQL Editor** e cole todo o conteúdo de `supabase_schema.sql`
5. Clique em **Run** — as tabelas e políticas serão criadas

### 2. Pegar as credenciais

No painel do Supabase:
- Vá em **Settings → API**
- Copie a **Project URL** e a **anon/public key**

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Instalar e rodar localmente

```bash
npm install
npm run dev
```

Acesse: [http://localhdirost:5173](http://localhost:5173)

### 5. Deploy na Vercel

```bash
# Instale a CLI da Vercel (se não tiver)
npm i -g vercel

# Faça o deploy
vercel

# Siga as instruções e adicione as variáveis de ambiente quando pedido:
# VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
```

Ou conecte seu repositório GitHub diretamente no painel da [vercel.com](https://vercel.com).

---

## 📁 Estrutura do Projeto

```
taskflow/
├── public/
├── src/
│   ├── components/
│   │   ├── FilterBar.jsx      # Barra de busca e filtros
│   │   ├── Header.jsx         # Cabeçalho com usuário
│   │   ├── KanbanColumn.jsx   # Coluna do board (droppable)
│   │   ├── TaskCard.jsx       # Card de tarefa (draggable)
│   │   └── TaskModal.jsx      # Modal criar/editar tarefa
│   ├── hooks/
│   │   ├── useAuth.js         # Contexto de autenticação
│   │   └── useTasks.js        # CRUD + realtime de tarefas
│   ├── pages/
│   │   ├── BoardPage.jsx      # Página principal (Kanban)
│   │   ├── LoginPage.jsx      # Tela de login
│   │   └── RegisterPage.jsx   # Tela de cadastro
│   ├── services/
│   │   ├── auth.js            # Funções de autenticação
│   │   ├── supabase.js        # Cliente Supabase
│   │   └── tasks.js           # Operações de banco de dados
│   ├── styles/
│   │   └── globals.css        # Estilos globais + Tailwind
│   ├── App.jsx                # Rotas da aplicação
│   └── main.jsx               # Ponto de entrada
├── supabase_schema.sql        # SQL para criar o banco
├── .env.example               # Modelo de variáveis de ambiente
├── vercel.json                # Config de deploy
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## ✨ Funcionalidades

- **Autenticação** completa (login, cadastro, logout) via Supabase Auth
- **Board Kanban** com 3 colunas: A Fazer / Em Andamento / Concluído
- **Drag & Drop** entre colunas com @dnd-kit
- **CRUD completo** de tarefas
- **Prioridades**: Baixa / Média / Alta
- **Data de vencimento** com alerta visual de atraso
- **Busca** por título e descrição
- **Filtro** por prioridade
- **Realtime**: atualizações instantâneas via Supabase Realtime
- **RLS (Row Level Security)**: cada usuário só acessa suas próprias tarefas

---

## 🛠 Tecnologias

| Tecnologia | Uso |
|---|---|
| React 18 + Vite | Frontend |
| Supabase | Auth + PostgreSQL + Realtime |
| Tailwind CSS | Estilização |
| @dnd-kit | Drag and Drop |
| React Router v6 | Navegação |
| react-hot-toast | Notificações |
| date-fns | Formatação de datas |
| Lucide React | Ícones |
| Vercel | Deploy |
