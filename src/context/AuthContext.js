import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        carregarPerfil(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        carregarPerfil(session.user.id)
      } else {
        setUser(null)
        setPerfil(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function carregarPerfil(userId) {
    const { data } = await supabase.from('perfis').select('*').eq('id', userId).single()
    setPerfil(data)
    setLoading(false)
  }

  async function login(email, senha) {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    return { error }
  }

  async function cadastrar(nome, email, senha) {
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } }
    })
    return { error }
  }

  async function sair() {
    await supabase.auth.signOut()
  }

  const isPremium = perfil?.plano === 'Premium'

  return (
    <AuthContext.Provider value={{ user, perfil, loading, isPremium, login, cadastrar, sair, carregarPerfil }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
