import React, { useEffect, useRef, useState } from 'react'

const tagColors = {
  Essay: { bg: '#f5efe4', text: '#8b6914', border: '#d4b87a' },
  Craft: { bg: '#edf4f0', text: '#2d6a4f', border: '#74c69d' },
  Tech:  { bg: '#eef2fa', text: '#2c4fa3', border: '#7fa6e0' },
  Life:  { bg: '#faeef4', text: '#8b2252', border: '#d88fb8' },
  Books: { bg: '#f0eefc', text: '#4a3594', border: '#a899e8' },
  Notes: { bg: '#f4f0ec', text: '#6b5a47', border: '#c4a882' },
}

const Tag = ({ label }) => {
  const c = tagColors[label] || tagColors['Notes']
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      fontSize: 10, fontWeight: 600, letterSpacing: '0.16em',
      textTransform: 'uppercase', padding: '3px 10px',
      borderRadius: 99, display: 'inline-block',
    }}>
      {label}
    </span>
  )
}

// ── Reading progress bar tied to panel scroll ─────────────────────────────────
const ReadingBar = ({ containerRef }) => {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => {
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? (el.scrollTop / total) * 100 : 0)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [containerRef])
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 10,
      background: '#ede5d8',
    }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: 'linear-gradient(to right, #b8955a, #d4b87a)',
        transition: 'width 0.1s linear',
      }} />
    </div>
  )
}

// ── PostDetail popup panel ────────────────────────────────────────────────────
const PostDetail = ({ post, onClose }) => {
  const scrollRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => { requestAnimationFrame(() => setVisible(true)) }, [])

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => onClose?.(), 320)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!post) return null

  // Get initials from author name or use first letter of title
  const authorName = post.author || 'Mohit'
  const initials = authorName.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Instrument+Sans:wght@300;400;500;600&display=swap');

        .pd-scroll::-webkit-scrollbar { width: 3px; }
        .pd-scroll::-webkit-scrollbar-track { background: transparent; }
        .pd-scroll::-webkit-scrollbar-thumb { background: #d4c9b5; border-radius: 99px; }

        .pd-prose p { margin: 0 0 1.65em; font-size: 15px; line-height: 1.9; }
        .pd-prose h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.1rem, 2.4vw, 1.35rem);
          font-weight: 600; color: #1c1812;
          margin: 2.6em 0 0.75em; line-height: 1.3;
        }

        .pd-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          background: transparent; border: 1px solid #ccc4b4;
          color: #6b5f52; padding: 6px 13px; cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .pd-btn:hover { border-color: #b8955a; color: #b8955a; }
        .pd-btn.dark { background: #1c1812; color: #fdfaf5; border-color: #1c1812; }
        .pd-btn.dark:hover { background: #b8955a; border-color: #b8955a; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(18,14,9,0.6)',
          backdropFilter: 'blur(5px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.32s ease',
        }}
      />

      {/* Slide-in panel */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          zIndex: 201,
          width: '100%', maxWidth: 660,
          background: '#fdfaf5',
          boxShadow: '-32px 0 100px rgba(18,14,9,0.22)',
          display: 'flex', flexDirection: 'column',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(.22,1,.36,1)',
          overflow: 'hidden',
        }}
      >
        <ReadingBar containerRef={scrollRef} />

        {/* Top bar */}
        <div style={{
          flexShrink: 0,
          padding: '0 32px',
          height: 58,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #ede5d8',
          background: '#fdfaf5',
        }}>
          <button className="pd-btn" onClick={handleClose}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="pd-btn" onClick={handleCopy}>
              {copied ? '✓ Copied' : 'Copy link'}
            </button>
            <button className="pd-btn">Share</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div
          ref={scrollRef}
          className="pd-scroll"
          style={{ flex: 1, overflowY: 'auto', padding: '44px 48px 88px' }}
        >
          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <Tag label={post.tag} />
            <span style={{ fontSize: 11, color: 'rgba(28,24,18,0.38)', letterSpacing: '0.03em' }}>
              {post.date}
            </span>
            <span style={{ color: 'rgba(28,24,18,0.18)', fontSize: 11 }}>·</span>
            <span style={{ fontSize: 11, color: 'rgba(28,24,18,0.38)' }}>
              {post.read_time}
            </span>
          </div>

          {/* Gold accent */}
          <div style={{ width: 36, height: 2, background: '#b8955a', marginBottom: 22 }} />

          {/* Title */}
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.65rem, 4vw, 2.35rem)',
            fontWeight: 700, lineHeight: 1.15,
            letterSpacing: '-0.02em', color: '#1c1812',
            marginBottom: 30,
          }}>
            {post.title}
          </h1>

          {/* Author */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            paddingBottom: 28, borderBottom: '1px solid #ede5d8', marginBottom: 36,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #b8955a, #d4b87a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 13, fontStyle: 'italic', color: '#1c1812', fontWeight: 700,
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1c1812', fontFamily: "'Instrument Sans', sans-serif" }}>
                {authorName}
              </p>
              <p style={{ margin: 0, fontSize: 10, color: 'rgba(28,24,18,0.38)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Instrument Sans', sans-serif" }}>
                Personal Blog
              </p>
            </div>
          </div>

          {/* Article body - display excerpt as lead */}
          <div className="pd-prose" style={{
            fontFamily: "'Instrument Sans', sans-serif",
            color: 'rgba(28,24,18,0.72)',
          }}>
            {/* Lead paragraph */}
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.05rem, 2.2vw, 1.18rem)',
              fontStyle: 'italic', color: '#1c1812',
              lineHeight: 1.78, marginBottom: '1.65em',
            }}>
              {post.excerpt}
            </p>

            {/* Content from JSON if available */}
            {post.content && typeof post.content === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : post.content && Array.isArray(post.content) ? (
              post.content.map((block, i) => {
                if (block.type === 'lead') return (
                  <p key={i} style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(1.05rem, 2.2vw, 1.18rem)',
                    fontStyle: 'italic', color: '#1c1812',
                    lineHeight: 1.78, marginBottom: '1.65em',
                  }}>
                    {block.text}
                  </p>
                )
                if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>
                if (block.type === 'blockquote') return (
                  <blockquote key={i} style={{
                    margin: '2.2em 0', padding: '22px 26px',
                    borderLeft: '2px solid #b8955a',
                    background: '#f7f2e8',
                  }}>
                    <p style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                      fontStyle: 'italic', color: '#1c1812',
                      lineHeight: 1.72, margin: '0 0 10px',
                    }}>
                      "{block.text}"
                    </p>
                    <cite style={{
                      fontSize: 10, fontStyle: 'normal', fontWeight: 600,
                      letterSpacing: '0.16em', textTransform: 'uppercase', color: '#b8955a',
                      fontFamily: "'Instrument Sans', sans-serif",
                    }}>
                      — {block.author}
                    </cite>
                  </blockquote>
                )
                return <p key={i}>{block.text}</p>
              })
            ) : null}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 52, paddingTop: 28,
            borderTop: '1px solid #ede5d8',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}>
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 12, fontStyle: 'italic',
              color: 'rgba(28,24,18,0.28)', margin: 0,
            }}>
              Writing since 2023 · {authorName}
            </p>
            <button className="pd-btn dark" onClick={handleClose}>
              ← All posts
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PostDetail
