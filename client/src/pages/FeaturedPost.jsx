import React from 'react'

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

const FeaturedPost = ({ post, onSelect }) => {
  return (
    <article
      onClick={onSelect}
      style={{
        position: 'relative', background: '#1c1812', padding: 'clamp(36px, 6vw, 64px)',
        cursor: 'pointer', overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 24px 60px rgba(28,24,18,0.18)'
        e.currentTarget.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <span
        style={{
          position: 'absolute', top: -20, right: 32,
          fontSize: 200, lineHeight: 1, color: 'rgba(184,149,90,0.06)',
          fontStyle: 'italic', pointerEvents: 'none', userSelect: 'none',
          fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700,
        }}
      >
        "
      </span>

      <div style={{ width: 40, height: 2, background: '#b8955a', marginBottom: 28 }} />
      <Tag label={post.tag} />

      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(1.6rem, 3.8vw, 2.5rem)', fontWeight: 600,
          lineHeight: 1.2, color: '#fdfaf5', marginTop: 20, marginBottom: 18, maxWidth: 540,
        }}
      >
        {post.title}
      </h2>

      <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(253,250,245,0.55)', maxWidth: 480, marginBottom: 40 }}>
        {post.excerpt}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 12, color: 'rgba(253,250,245,0.4)', letterSpacing: '0.04em' }}>
            {post.date}
          </span>
          <span style={{ color: 'rgba(253,250,245,0.2)' }}>·</span>
          <span style={{ fontSize: 12, color: 'rgba(253,250,245,0.4)' }}>
            {post.read_time}
          </span>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: '#b8955a' }}>
          Read Essay
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </article>
  )
}

export default FeaturedPost
