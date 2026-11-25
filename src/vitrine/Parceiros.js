import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const VAZIO = {
  nome: '',
  email: '',
  whatsapp: '',
  profissao: '',
  registro: '',
  cidade: '',
  link_profissional: '',
  mensagem: '',
  consentimento: false,
  site: '', // campo invisível contra robôs
}

export default function Parceiros() {
  const [form, setForm] = useState(VAZIO)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState(null)

  function campo(nome, valor) {
    setForm((f) => ({ ...f, [nome]: valor }))
  }

  async function enviar(e) {
    e.preventDefault()
    setErro(null)
    if (form.site) {
      setEnviado(true)
      return
    }
    if (!form.nome.trim() || !form.email.trim() || !form.profissao) {
      setErro('Preencha nome, e-mail e profissão.')
      return
    }
    if (!form.consentimento) {
      setErro('Para enviar, marque a autorização de uso dos seus dados.')
      return
    }
    setEnviando(true)
    const { error } = await supabase.from('parceiros_interesse').insert({
      nome: form.nome.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim() || null,
      profissao: form.profissao,
      registro: form.registro.trim() || null,
      cidade: form.cidade.trim() || null,
      link_profissional: form.link_profissional.trim() || null,
      mensagem: form.mensagem.trim() || null,
      consentimento: true,
    })
    setEnviando(false)
    if (error) {
      setErro('Não conseguimos enviar agora. Tente de novo em alguns minutos ou fale com a gente pelo Instagram.')
      return
    }
    setEnviado(true)
    setForm(VAZIO)
  }

  return (
    <section className="v-secao v-secao-topo">
      <div className="v-container v-duas-colunas v-parceiros">
        <div>
          <p className="v-sobretitulo">Para psicólogos e psicanalistas</p>
          <h1 className="v-titulo-pagina">Profissionais Parceiros Holos</h1>
          <p className="v-texto v-texto-destaque">
            Estamos formando uma rede de psicólogos e psicanalistas que compartilham a visão da Holos: cuidar do ser
            humano por inteiro, com seriedade e respeito.
          </p>
          <p className="v-texto">
            Os parceiros poderão conhecer os cursos de perto, acompanhar seus temas e, se desejarem, dar seu aval a
            eles. Preencha o formulário e entraremos em contato para conversar.
          </p>
          <p className="v-pequeno">
            O envio do formulário não cria nenhum vínculo nem compromisso. Seus dados são usados apenas para esse
            contato. Veja a nossa <Link to="/privacidade">Política de Privacidade</Link>.
          </p>
        </div>

        <div className="v-caixa">
          {enviado ? (
            <div className="v-sucesso" role="status">
              <p className="v-nome">Recebemos o seu contato.</p>
              <p className="v-texto">Obrigada pelo interesse. Em breve a equipe Holos vai falar com você.</p>
              <button className="v-botao v-botao-linha" onClick={() => setEnviado(false)}>Enviar outro</button>
            </div>
          ) : (
            <form onSubmit={enviar} className="v-form" noValidate>
              <label>
                Nome completo *
                <input value={form.nome} onChange={(e) => campo('nome', e.target.value)} maxLength={150} autoComplete="name" required />
              </label>
              <label>
                E-mail *
                <input type="email" value={form.email} onChange={(e) => campo('email', e.target.value)} maxLength={200} autoComplete="email" required />
              </label>
              <label>
                WhatsApp
                <input type="tel" value={form.whatsapp} onChange={(e) => campo('whatsapp', e.target.value)} maxLength={30} autoComplete="tel" placeholder="(00) 00000-0000" />
              </label>
              <label>
                Profissão *
                <select value={form.profissao} onChange={(e) => campo('profissao', e.target.value)} required>
                  <option value="">Escolha</option>
                  <option>Psicóloga(o)</option>
                  <option>Psicanalista</option>
                  <option>Psicóloga(o) e psicanalista</option>
                </select>
              </label>
              <label>
                Registro (CRP) ou formação em psicanálise
                <input value={form.registro} onChange={(e) => campo('registro', e.target.value)} maxLength={200} placeholder="Ex.: CRP 00/00000 ou instituição de formação" />
              </label>
              <label>
                Cidade / estado
                <input value={form.cidade} onChange={(e) => campo('cidade', e.target.value)} maxLength={120} />
              </label>
              <label>
                Instagram ou site profissional
                <input value={form.link_profissional} onChange={(e) => campo('link_profissional', e.target.value)} maxLength={300} />
              </label>
              <label>
                Conte um pouco sobre você e seu interesse
                <textarea rows={4} value={form.mensagem} onChange={(e) => campo('mensagem', e.target.value)} maxLength={2000} />
              </label>
              <label className="v-escondido" aria-hidden="true">
                Site
                <input tabIndex={-1} autoComplete="off" value={form.site} onChange={(e) => campo('site', e.target.value)} />
              </label>
              <label className="v-check">
                <input type="checkbox" checked={form.consentimento} onChange={(e) => campo('consentimento', e.target.checked)} />
                <span>Autorizo a Plataforma Holos a guardar estes dados para entrar em contato comigo sobre a parceria.</span>
              </label>
              {erro && <p className="v-erro" role="alert">{erro}</p>}
              <button type="submit" className="v-botao v-botao-cheio" disabled={enviando}>
                {enviando ? 'Enviando…' : 'Enviar'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
