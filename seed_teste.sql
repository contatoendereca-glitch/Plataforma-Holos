-- ============================================================
-- PLATAFORMA HOLOS — Dados de teste para a Fase 2
-- Rode isso depois do holos_fase1_schema.sql
-- ============================================================

insert into public.reflexoes_diarias (texto) values
  ('Nem todo pensamento precisa virar identidade.'),
  ('Você não precisa se curar hoje. Só precisa aparecer.'),
  ('Pequenas contribuições diárias transformam grandes jornadas.'),
  ('Descansar também é uma forma de avançar.'),
  ('A direção é para dentro.'),
  ('O que você sente hoje é real, mas não é definitivo.'),
  ('Cuidar de si não é luxo, é manutenção.'),
  ('Você pode recomeçar quantas vezes precisar, hoje mesmo.'),
  ('Nem toda pressa leva a algum lugar melhor.'),
  ('Estar presente já é um ato de coragem.'),
  ('Seu corpo guarda respostas que sua mente ainda não ouviu.'),
  ('Silêncio também é linguagem.'),
  ('Você não está atrasado. Você está no seu tempo.'),
  ('Cada check-in é um voto de confiança em você mesmo.'),
  ('O progresso raramente parece produtivo por dentro.')
on conflict do nothing;

-- Conteúdos de exemplo para a dor "Ansiedade" (ajuste os url_externa depois)
insert into public.conteudos (titulo, dor_id, instancia_id, formato, url_externa, plano_minimo, status, descricao)
select
  'Técnica de respiração 4-7-8',
  (select id from public.dores where nome = 'Ansiedade'),
  (select id from public.instancias where nome = 'Corpo'),
  'Audio', 'https://example.com/audio-respiracao', 'Premium', 'Aprovado',
  'Exercício guiado de respiração para momentos de ansiedade.'
union all
select
  'O que a ansiedade tenta te dizer',
  (select id from public.dores where nome = 'Ansiedade'),
  (select id from public.instancias where nome = 'Alma'),
  'Texto', 'https://example.com/texto-ansiedade-alma', 'Gratuito', 'Aprovado',
  'Uma leitura sobre a função psíquica da ansiedade.'
union all
select
  'Ansiedade e propósito: uma reflexão',
  (select id from public.dores where nome = 'Ansiedade'),
  (select id from public.instancias where nome = 'Espirito'),
  'Texto', 'https://example.com/texto-ansiedade-espirito', 'Premium', 'Aprovado',
  'Reflexão sobre ansiedade a partir de uma perspectiva de propósito e fé.'
on conflict do nothing;
