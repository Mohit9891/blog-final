import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const TAGS = ['Essay', 'Craft', 'Tech', 'Life', 'Books', 'Notes']

const tagColors = {
  Essay: { bg: '#f5efe4', text: '#8b6914', border: '#d4b87a' },
  Craft: { bg: '#edf4f0', text: '#2d6a4f', border: '#74c69d' },
  Tech:  { bg: '#eef2fa', text: '#2c4fa3', border: '#7fa6e0' },
  Life:  { bg: '#faeef4', text: '#8b2252', border: '#d88fb8' },
  Books: { bg: '#f0eefc', text: '#4a3594', border: '#a899e8' },
  Notes: { bg: '#f4f0ec', text: '#6b5a47', border: '#c4a882' },
}

const emptyForm = { tag: 'Essay', title: '', excerpt: '', content: '', date: '', read_time: '' }

const AdminDashboard = ({ user, onLogout }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [toast, setToast] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Fetch posts ────────────────────────────────────────────────────────────
  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  // ── Auto-fill today's date when opening new form ───────────────────────────
  const openNewForm = () => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    setForm({ ...emptyForm, date: today })
    setEditingId(null)
    setShowForm(true)
  }

  const openEditForm = (post) => {
    setForm({
      tag: post.tag,
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content || '',
      date: post.date || '',
      read_time: post.read_time || '',
    })
    setEditingId(post.id)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setForm(emptyForm)
    setEditingId(null)
  }

  // ── Save (insert or update) ────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim() || !form.excerpt.trim()) {
      showToast('Title and excerpt are required.', 'error')
      return
    }
    setSaving(true)

    if (editingId) {
      const { error } = await supabase
        .from('posts')
        .update(form)
        .eq('id', editingId)
      if (error) showToast('Failed to update post.', 'error')
      else { showToast('Post updated!'); fetchPosts(); closeForm() }
    } else {
      const { error } = await supabase
        .from('posts')
        .insert(form)
      if (error) showToast('Failed to add post.', 'error')
      else { showToast('Post published!'); fetchPosts(); closeForm() }
    }
    setSaving(false)
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeleting(id)
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) showToast('Failed to delete.', 'error')
    else { showToast('Post deleted.'); fetchPosts() }
    setDeleting(null)
  }

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Instrument+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Instrument Sans', sans-serif; background: #f7f3ed; color: #1c1812; -webkit-font-smoothing: antialiased; }

        .dash-input {
          width: 100%;
          padding: 11px 14px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          color: #1c1812;
          background: #fdfaf5;
          border: 1px solid #ddd5c5;
          outline: none;
          transition: border-color 0.2s;
          border-radius: 2px;
        }
        .dash-input:focus { border-color: #b8955a; }
        .dash-input::placeholder { color: #b0a494; }

        .dash-textarea {
          width: 100%;
          padding: 11px 14px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          color: #1c1812;
          background: #fdfaf5;
          border: 1px solid #ddd5c5;
          outline: none;
          resize: vertical;
          min-height: 100px;
          transition: border-color 0.2s;
          border-radius: 2px;
          line-height: 1.6;
        }
        .dash-textarea:focus { border-color: #b8955a; }

        .dash-textarea.large {
          min-height: 300px;
          font-size: 13px;
        }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 22px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          background: #1c1812; color: #fdfaf5;
          border: none; cursor: pointer;
          transition: background 0.2s;
          border-radius: 2px;
        }
        .btn-primary:hover:not(:disabled) { background: #b8955a; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 16px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          background: transparent; color: #6b5f52;
          border: 1px solid #ccc4b4; cursor: pointer;
          transition: all 0.2s;
          border-radius: 2px;
        }
        .btn-outline:hover { border-color: #b8955a; color: #b8955a; }

        .btn-danger {
          display: inline-flex; align-items: center;
          padding: 8px 14px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          background: transparent; color: #b0a494;
          border: 1px solid #e0d8cc; cursor: pointer;
          transition: all 0.2s;
          border-radius: 2px;
        }
        .btn-danger:hover { border-color: #d88fb8; color: #8b2252; background: #faeef4; }
        .btn-danger:disabled { opacity: 0.4; cursor: not-allowed; }

        .tag-select {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .tag-opt {
          padding: 5px 14px;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          border-radius: 99px; border: 1px solid #ddd5c5;
          cursor: pointer; transition: all 0.15s;
          background: transparent; color: #6b5f52;
        }
        .tag-opt.selected { border-width: 1.5px; }

        .post-card {
          background: #fdfaf5;
          border: 1px solid #e8e0d0;
          padding: 20px 24px;
          transition: box-shadow 0.2s;
        }
        .post-card:hover { box-shadow: 0 4px 20px rgba(28,24,18,0.07); }

        .field-label {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(28,24,18,0.45);
          display: block; margin-bottom: 7px;
        }

        /* Toast */
        .toast {
          position: fixed; bottom: 28px; right: 28px;
          padding: 13px 20px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          border-radius: 2px;
          animation: slideUp 0.25s ease;
          z-index: 9999;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Modal overlay */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(18,14,9,0.5);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .modal {
          background: #fdfaf5;
          width: 100%; max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 36px;
        }
        .modal::-webkit-scrollbar { width: 3px; }
        .modal::-webkit-scrollbar-thumb { background: #d4c9b5; }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div className="toast" style={{
          background: toast.type === 'error' ? '#faeef4' : '#1c1812',
          color: toast.type === 'error' ? '#8b2252' : '#fdfaf5',
          border: toast.type === 'error' ? '1px solid #d88fb8' : 'none',
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── Top bar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(253,250,245,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e8e0d0',
        padding: '0 32px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #b8955a, #d4b87a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 12, fontStyle: 'italic', color: '#1c1812', fontWeight: 700,
          }}>M</div>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: '#1c1812' }}>
            Admin Dashboard
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'rgba(28,24,18,0.38)' }}>{user?.email}</span>
          <button className="btn-outline" onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 32px 80px' }}>

        {/* ── Header row ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', fontWeight: 700, color: '#1c1812', marginBottom: 4 }}>
              Posts
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(28,24,18,0.4)' }}>
              {loading ? '...' : `${posts.length} post${posts.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
          <button className="btn-primary" onClick={openNewForm}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </button>
        </div>

        {/* ── Gold rule ── */}
        <div style={{ width: 36, height: 2, background: '#b8955a', marginBottom: 32 }} />

        {/* ── Post list ── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(n => (
              <div key={n} style={{ background: '#fdfaf5', border: '1px solid #e8e0d0', padding: '20px 24px', height: 88, opacity: 0.5 }} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', border: '1px dashed #ddd5c5' }}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(28,24,18,0.35)', marginBottom: 16 }}>
              No posts yet.
            </p>
            <button className="btn-primary" onClick={openNewForm}>Write your first post →</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {posts.map((post) => {
              const c = tagColors[post.tag] || tagColors['Notes']
              return (
                <div key={post.id} className="post-card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '2px 9px', borderRadius: 99 }}>
                          {post.tag}
                        </span>
                        <span style={{ fontSize: 11, color: 'rgba(28,24,18,0.35)' }}>{post.date}</span>
                        {post.read_time && (
                          <>
                            <span style={{ color: 'rgba(28,24,18,0.2)', fontSize: 11 }}>·</span>
                            <span style={{ fontSize: 11, color: 'rgba(28,24,18,0.35)' }}>{post.read_time}</span>
                          </>
                        )}
                      </div>
                      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.05rem', fontWeight: 600, color: '#1c1812', marginBottom: 4, lineHeight: 1.35 }}>
                        {post.title}
                      </h3>
                      <p style={{ fontSize: 12, color: 'rgba(28,24,18,0.45)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.excerpt}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button className="btn-outline" onClick={() => openEditForm(post)}>Edit</button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                      >
                        {deleting === post.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeForm()}>
          <div className="modal">

            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.3rem', fontWeight: 700, color: '#1c1812' }}>
                {editingId ? 'Edit Post' : 'New Post'}
              </h3>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(28,24,18,0.4)', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Tag */}
              <div>
                <label className="field-label">Tag</label>
                <div className="tag-select">
                  {TAGS.map((t) => {
                    const c = tagColors[t]
                    const selected = form.tag === t
                    return (
                      <button
                        key={t}
                        className={`tag-opt ${selected ? 'selected' : ''}`}
                        onClick={() => setForm({ ...form, tag: t })}
                        style={selected ? { background: c.bg, color: c.text, borderColor: c.border } : {}}
                      >
                        {t}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="field-label">Title *</label>
                <input
                  className="dash-input"
                  placeholder="Post title..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="field-label">Excerpt *</label>
                <textarea
                  className="dash-textarea"
                  placeholder="A short summary shown on the homepage..."
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                />
              </div>

              {/* Content / Full Post Body */}
              <div>
                <label className="field-label">Content</label>
                <textarea
                  className="dash-textarea large"
                  placeholder="Write your full post here... You can use plain text, markdown, or HTML."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>

              {/* Date + Read time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="field-label">Date</label>
                  <input
                    className="dash-input"
                    placeholder="March 18, 2026"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="field-label">Read time</label>
                  <input
                    className="dash-input"
                    placeholder="5 min read"
                    value={form.read_time}
                    onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                  {saving ? 'Saving...' : editingId ? 'Update Post' : 'Publish Post'}
                </button>
                <button className="btn-outline" onClick={closeForm}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminDashboard
