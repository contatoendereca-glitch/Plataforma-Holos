export default function Privacidade() {
  return (
    <div className="page-content" style={{ paddingTop: '32px' }}>
      <h1 className="titulo" style={{ color: 'var(--gold)', fontSize: '22px', marginBottom: '16px' }}>
        Política de Privacidade
      </h1>

      <div style={{ fontSize: 14, lineHeight: 1.7 }}>
        <p style={{ marginBottom: 12 }}>
          A Plataforma Holos existe pra apoiar seu cuidado em Corpo, Alma e Espírito. Para isso, coletamos alguns dados —
          e queremos ser claros sobre quais são, pra que servem e quais são os seus direitos.
        </p>

        <p className="section-label" style={{ marginTop: 20 }}>O que coletamos</p>
        <p style={{ marginBottom: 12 }}>
          Nome, e-mail e senha no cadastro; seus check-ins diários, registros de gratidão e diário, e as dores que você
          seleciona pra cuidar. Se você vira Profissional, também coletamos área de atuação, WhatsApp e documentação
          profissional. Se você assina o Premium ou solicita um match, processamos dados de pagamento através do
          Mercado Pago (a Holos não armazena número de cartão).
        </p>

        <p className="section-label" style={{ marginTop: 20 }}>Como usamos</p>
        <p style={{ marginBottom: 12 }}>
          Pra manter sua jornada dentro do app (calendário, mapa evolutivo, selos), pra conectar você a um profissional
          quando solicitado, e pra gerir sua assinatura. Nunca vendemos seus dados pra terceiros.
        </p>

        <p className="section-label" style={{ marginTop: 20 }}>Dados sensíveis</p>
        <p style={{ marginBottom: 12 }}>
          Seus check-ins e registros podem incluir informações sobre seu estado emocional. Tratamos isso com cuidado
          extra: só você, e a equipe Holos quando estritamente necessário (por exemplo, pra processar um match), tem
          acesso a esse conteúdo.
        </p>

        <p className="section-label" style={{ marginTop: 20 }}>Contato entre usuário e profissional</p>
        <p style={{ marginBottom: 12 }}>
          A Holos não expõe seu contato direto a nenhum profissional (nem o contrário) até que uma solicitação de
          match seja aprovada e o processo de intermediação seja concluído.
        </p>

        <p className="section-label" style={{ marginTop: 20 }}>Seus direitos (LGPD)</p>
        <p style={{ marginBottom: 12 }}>
          Você pode, a qualquer momento, exportar uma cópia dos seus dados ou solicitar a exclusão da sua conta —
          ambas as opções estão disponíveis na tela de Perfil, dentro do app.
        </p>

        <p className="section-label" style={{ marginTop: 20 }}>Dúvidas</p>
        <p style={{ marginBottom: 12 }}>
          Fale com a gente pelo e-mail de contato da Holos ou pelo Instagram @psi.fernandalima_.
        </p>
      </div>
    </div>
  )
}
