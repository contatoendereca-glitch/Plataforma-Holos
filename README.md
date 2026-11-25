# Plataforma Holos — Direção para dentro

Site em React, publicado na Vercel (plataforma-holos.vercel.app), com banco no Supabase (`holos-v2`).

## Etapa 1 — Vitrine (atual)
Site aberto, sem login:
- `/` Início · `/cursos` Catálogo (filtro por caminho) · `/cursos/i10` Página de cada curso
- `/parceiros` Profissionais Parceiros Holos (formulário salva na tabela `parceiros_interesse`)
- `/sobre` · `/privacidade`

Onde mexer:
- **Cursos:** `src/data/cursos.js`. Para abrir a compra de um curso, coloque o link da Kiwify em `LINKS_KIWIFY`.
- **Cores e visual:** `src/styles/vitrine.css`.
- **Tabela do formulário:** `supabase/parceiros_interesse.sql` (rodar uma vez no SQL Editor do Supabase).

Preços e cargas horárias do catálogo ainda são propostas e não aparecem no site.

## Guardado para as próximas etapas
As telas antigas (check-in, diário, mapa, calendário, marketplace, loja, premium, admin) continuam em `src/pages`, sem aparecer no site, para a Etapa 2 (área da aluna). As funções de pagamento em `api/` continuam no servidor.

## Rodar localmente
```bash
npm install
npm start
```
