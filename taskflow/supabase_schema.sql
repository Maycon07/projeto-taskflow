-- ============================================================
-- TASKFLOW - Schema completo para Supabase
-- Execute este SQL no SQL Editor do seu projeto Supabase
-- ============================================================

-- Habilitar extensão UUID (já vem ativa no Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABELA: profiles
-- Estende os dados do auth.users com nome e avatar
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- TABELA: tasks
-- Tabela principal de tarefas
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  owner_email TEXT,
  owner_name TEXT,
  due_date DATE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- ÍNDICES para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS tasks_owner_id_idx ON public.tasks(owner_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON public.tasks(status);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON public.tasks(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Cada usuário só vê e edita as próprias tarefas
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Usuários podem ver o próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir o próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar o próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies para tasks
CREATE POLICY "Usuários podem ver as próprias tarefas"
  ON public.tasks FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Usuários podem criar tarefas"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Usuários podem atualizar as próprias tarefas"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Usuários podem deletar as próprias tarefas"
  ON public.tasks FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================================
-- FUNÇÃO: atualiza updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- FUNÇÃO: cria perfil automaticamente ao registrar usuário
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- HABILITAR REALTIME para a tabela tasks
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- ============================================================
-- FIM DO SCHEMA
-- ============================================================
