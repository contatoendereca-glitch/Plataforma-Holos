import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { ReactComponent as HolosLogo } from '../assets/holos-logo.svg'

export default function Login() {
  const { login, cadastrar } = useAuth()
  const [modo, setModo] = useState('login') // 'login' | 'cadastro'
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [avisoCadastro, setAvisoCadastro] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    if (modo === 'login') {
      const { error } = await login(email, senha)
      if (error) setErro('E-mail ou senha inválidos.')
    } else {
      const { error } = await cadastrar(nome, email, senha)
      if (error) setErro(error.message)
      else setAvisoCadastro(true)
    }
    setCarregando(false)
  }

  return (
    <div className="page-content" style={{ paddingTop: '48px', textAlign: 'center' }}>
      <HolosLogo width={72} height={72} style={{ marginBottom: '8px' }} />
      <h1 className="titulo" style={{ color: 'var(--gold)', fontSize: '26px', marginBottom: '4px' }}>
        PLATAFORMA HOLOS
      </h1>
      <p className="page-subtitle" style={{ fontStyle: 'italic', marginBottom: '2px' }}>A direção é para dentro.</p>
      <p className="page-subtitle">Seu caminho de transformação começa aqui.</p>

      {avisoCadastro ? (
        <div className="card">
          <p>Conta criada! Verifique seu e-mail para confirmar o cadastro e depois faça login.</p>
        </div>
      ) : (
        <form onSubmit={enviar} style={{ textAlign: 'left', marginTop: '24px' }}>
          {modo === 'cadastro' && (
            <input className="input" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
          )}
          <input className="input" type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required minLength={6} />

          {erro && <p style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '10px' }}>{erro}</p>}

          <button className="btn btn-gold" disabled={carregando}>
            {carregando ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar conta'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
            {modo === 'login' ? (
              <>Não tem conta? <span style={{ color: 'var(--gold)', cursor: 'pointer' }} onClick={() => setModo('cadastro')}>Criar conta</span></>
            ) : (
              <>Já tem conta? <span style={{ color: 'var(--gold)', cursor: 'pointer' }} onClick={() => setModo('login')}>Entrar</span></>
            )}
          </p>
        </form>
      )}

      <p style={{ marginTop: '28px' }}>
        <a href="/sobre" style={{ color: 'var(--text-muted)', fontSize: '12px', textDecoration: 'underline' }}>
          Sobre a Holos
        </a>
      </p>
    </div>
  )
}
