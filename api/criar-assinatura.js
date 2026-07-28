// /api/criar-assinatura.js
// Roda no servidor (Vercel), nunca no navegador — por isso pode usar o
// Access Token secreto do Mercado Pago com segurança.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { userId, email } = req.body || {}

  if (!userId || !email) {
    return res.status(400).json({ error: 'userId e email são obrigatórios' })
  }

  try {
    const response = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: 'Plataforma Holos Premium',
        external_reference: userId,
        payer_email: email,
        back_url: process.env.APP_URL || 'https://plataforma-holos.vercel.app/perfil',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: 39.9,
          currency_id: 'BRL',
        },
        status: 'pending',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Erro Mercado Pago:', data)
      return res.status(500).json({ error: 'Erro ao criar assinatura', details: data })
    }

    return res.status(200).json({ init_point: data.init_point })
  } catch (err) {
    console.error('Erro interno:', err)
    return res.status(500).json({ error: 'Erro interno ao criar assinatura' })
  }
}
