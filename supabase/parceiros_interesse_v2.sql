-- ============================================================
-- PLATAFORMA HOLOS — Formulário de Parceiros, versão 2
-- Rodar UMA vez no SQL Editor do Supabase (projeto zrcdxzadhquijqpyandu),
-- depois do parceiros_interesse.sql.
-- 1) Aceita "Terapeuta" como profissão.
-- 2) Cria o campo "especializacao".
-- Não apaga nenhuma resposta já recebida.
-- ============================================================

alter table public.parceiros_interesse
  add column if not exists especializacao text check (char_length(especializacao) <= 200);

alter table public.parceiros_interesse
  drop constraint if exists parceiros_interesse_profissao_check;

alter table public.parceiros_interesse
  add constraint parceiros_interesse_profissao_check
  check (profissao in ('Psicóloga(o)', 'Psicanalista', 'Psicóloga(o) e psicanalista', 'Terapeuta'));
