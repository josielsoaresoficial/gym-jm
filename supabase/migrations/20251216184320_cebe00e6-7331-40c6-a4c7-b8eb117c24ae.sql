-- Criar tabela de profiles para autenticação
CREATE TABLE public.profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name text,
  avatar_url text,
  onboarding_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);