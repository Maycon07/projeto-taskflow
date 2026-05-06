// src/pages/RegisterPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signUp } from '../services/auth'
import toast from 'react-hot-toast'
import { Layers, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.password) return toast.error('Preencha todos os campos')
    if (form.password.length < 6) return toast.error('Senha precisa ter ao menos 6 caracteres')
    if (form.password !== form.confirm) return toast.error('As senhas não coincidem')

    setLoading(true)
    try {
      await signUp({ email: form.email, password: form.password, fullName: form.fullName })
      setDone(true)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-surface-900 to-surface-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-800/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl mb-4 shadow-lg shadow-brand-900/50">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">TaskFlow</h1>
          <p className="text-surface-400 mt-1 text-sm">Organize. Priorize. Entregue.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-brand-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📬</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Confirme seu email!</h2>
              <p className="text-surface-400 text-sm mb-6">
                Enviamos um link de confirmação para <span className="text-brand-400">{form.email}</span>.<br />
                Verifique sua caixa de entrada.
              </p>
              <Link to="/login" className="btn-primary rounded-xl px-6 py-2.5">
                Ir para o login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-6">Criar conta gratuita</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label text-surface-300">Seu nome</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input name="fullName" value={form.fullName} onChange={handleChange}
                      placeholder="João Silva"
                      className="input pl-9 bg-white/10 border-white/10 text-white placeholder:text-surface-500" />
                  </div>
                </div>
                <div>
                  <label className="label text-surface-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="seu@email.com"
                      className="input pl-9 bg-white/10 border-white/10 text-white placeholder:text-surface-500" />
                  </div>
                </div>
                <div>
                  <label className="label text-surface-300">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input type="password" name="password" value={form.password} onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      className="input pl-9 bg-white/10 border-white/10 text-white placeholder:text-surface-500" />
                  </div>
                </div>
                <div>
                  <label className="label text-surface-300">Confirmar senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
                      placeholder="Repita a senha"
                      className="input pl-9 bg-white/10 border-white/10 text-white placeholder:text-surface-500" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="btn-primary w-full py-2.5 rounded-xl text-base font-semibold shadow-lg shadow-brand-900/40 mt-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Criando...</> : <>Criar conta <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
              <p className="text-center text-surface-400 text-sm mt-6">
                Já tem conta?{' '}
                <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Entrar</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
