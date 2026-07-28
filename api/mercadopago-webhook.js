// /api/mercadopago-webhook.js
// O Mercado Pago chama essa URL sozinho quando algo muda numa assinatura
// (aprovada, cancelada, atrasada). Usa a service_role key do Supabase,
// que ignora RLS — por isso ela NUNCA pode ir pro código do front-end,
// só aqui, como variável de ambiente no servidor.

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true })
  }

  try {
    const { type, data } = req.body || {}

    if (type === 'subscription_preapproval' && data?.id) {
      const detailResp = await fetch(`https://api.mercadopago.com/preapproval/${data.id}`, {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
      })
      const detail = await detailResp.json()

      const userId = detail.external_reference
      const status = detail.status

      if (userId) {
        if (status === 'authorized') {
          await supabaseAdmin.from('perfis').update({ plano: 'Premium' }).eq('id', userId)
          await supabaseAdmin.from('assinaturas').upsert(
            {
              perfil_id: userId,
              status: 'ativa',
              periodicidade: 'mensal',
              valor_pago: detail.auto_recurring?.transaction_amount || null,
              gateway_ref: detail.id,
            },
            { onConflict: 'gateway_ref' }
          )
        } else if (status === 'cancelled' || status === 'paused') {
          await supabaseAdmin.from('perfis').update({ plano: 'Gratuito' }).eq('id', userId)
          await supabaseAdmin
            .from('assinaturas')
            .update({ status: status === 'cancelled' ? 'cancelada' : 'atrasada' })
            .eq('gateway_ref', detail.id)
        }
      }
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('Erro no webhook do Mercado Pago:', err)
    return res.status(200).json({ received: true })
  }
}
