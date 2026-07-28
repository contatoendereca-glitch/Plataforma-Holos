# Plataforma Holos — v2 (Fase 2: MVP assinatura)

App React conectado ao Supabase (projeto `holos-v2`).

## O que já funciona
- Login / Criar conta (Supabase Auth)
- Reflexão Diária (sorteia uma frase da tabela `reflexoes_diarias`)
- Check-in Diário (Corpo, Alma, Espírito — 1 por dia)
- Home por dor, com Alma sempre liberada e Corpo/Espírito bloqueados para quem não é Premium
- Tela Premium (upsell — checkout de pagamento entra na Fase 3)
- Perfil (dados básicos + sair)

## Rodar localmente
```bash
npm install
npm start
```
Abre em http://localhost:3000

## Antes de testar, popular dados de teste
Rode o arquivo `seed_teste.sql` no SQL Editor do Supabase — ele adiciona:
- 15 Reflexões Diárias de teste
- Alguns conteúdos de exemplo (Corpo/Alma/Espírito) para a dor "Ansiedade"

Sem isso, as telas vão aparecer vazias (não é bug — é falta de dado).

## Deploy (Vercel)
1. Suba esse projeto pra um repositório novo no GitHub (ex: `holos-v2`).
2. Em vercel.com, "Add New Project" → importe o repositório.
3. Framework preset: Create React App (detecta sozinho).
4. Deploy.

Não precisa configurar variáveis de ambiente — as chaves do Supabase (URL + anon key) já estão em `src/lib/supabase.js`. Isso é seguro: a anon key é pública por natureza (é como o Supabase foi projetado pra funcionar em apps client-side).

## Próximos passos (Fase 3)
- Checkout de pagamento (Stripe ou Mercado Pago) ligado a `assinaturas`
- Motor de Leitura Holos (regras + templates) na tela Meu Caminho
- Biblioteca e Vitrine de Profissionais
