-- ============================================================
-- PLATAFORMA HOLOS — Formulário "Profissionais Parceiros Holos"
-- Rodar UMA vez no SQL Editor do Supabase (projeto holos-v2).
-- Cria a tabela onde ficam as respostas do formulário.
-- Visitantes do site podem apenas ENVIAR; ninguém de fora consegue LER.
-- As respostas aparecem em: Table Editor > parceiros_interesse.
-- ============================================================

create table if not exists public.parceiros_interesse (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  nome text not null check (char_length(nome) between 2 and 150),
  email text not null check (char_length(email) between 5 and 200 and email like '%@%'),
  whatsapp text check (char_length(whatsapp) <= 30),
  profissao text not null check (profissao in ('Psicóloga(o)', 'Psicanalista', 'Psicóloga(o) e psicanalista')),
  registro text check (char_length(registro) <= 200),
  cidade text check (char_length(cidade) <= 120),
  link_profissional text check (char_length(link_profissional) <= 300),
  mensagem text check (char_length(mensagem) <= 2000),
  consentimento boolean not null check (consentimento = true),
  status text not null default 'Novo'
);

alter table public.parceiros_interesse enable row level security;

drop policy if exists "Visitantes podem enviar interesse" on public.parceiros_interesse;
create policy "Visitantes podem enviar interesse"
  on public.parceiros_interesse
  for insert
  to anon, authenticated
  with check (consentimento = true and status = 'Novo');

grant insert on public.parceiros_interesse to anon, authenticated;
