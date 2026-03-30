import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // If already logged in, skip login screen
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) onLogin(session.user)
    })
  }, [])

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Wrong email or password.')
      setLoading(false)
      return
    }

    onLogin(data.user)
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Instrument+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Instrument Sans', sans-serif; background: #fdfaf5; color: #1c1812; -webkit-font-smoothing: antialiased; }

        .login-input {
          width: 100%;
          padding: 13px 16px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          color: #1c1812;
          background: transparent;
          border: 1px solid #ccc4b4;
          outline: none;
          transition: border-color 0.2s;
        }
        .login-input:focus { border-color: #b8955a; }
        .login-input::placeholder { color: #b0a494; }

        .login-btn {
          width: 100%;
          padding: 14px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          background: #1c1812;
          color: #fdfaf5;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .login-btn:hover:not(:disabled) { background: #b8955a; }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#fdfaf5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'linear-gradient(135deg, #b8955a, #d4b87a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 20, fontStyle: 'italic', color: '#1c1812', fontWeight: 700,
              margin: '0 auto 20px',
            }}>
              M
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.8rem', fontWeight: 700, color: '#1c1812',
              marginBottom: 6,
            }}>
              Admin
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(28,24,18,0.4)', letterSpacing: '0.04em' }}>
              Sign in to manage your blog
            </p>
          </div>

          {/* Gold rule */}
          <div style={{ width: 36, height: 2, background: '#b8955a', margin: '0 auto 36px' }} />

          {/* Error */}
          {error && (
            <div style={{
              padding: '12px 16px', marginBottom: 20,
              background: '#faeef4', border: '1px solid #d88fb8',
              fontSize: 13, color: '#8b2252',
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(28,24,18,0.45)', display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <input
                className="login-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div>
              <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(28,24,18,0.45)', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input
                className="login-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <button
              className="login-btn"
              onClick={handleLogin}
              disabled={loading || !email || !password}
              style={{ marginTop: 8 }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(28,24,18,0.25)', marginTop: 32, letterSpacing: '0.04em' }}>
            Only the blog owner can access this page.
          </p>
        </div>
      </div>
    </>
  )
}

export default AdminLogin
