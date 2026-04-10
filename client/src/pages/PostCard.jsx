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

const PostCard = ({ post, index, onSelect }) => {
  return (
    <article
      onClick={onSelect}
      style={{
        borderTop: '1px solid #ede5d8',
        cursor: 'pointer',
        transition: 'background 0.2s',
        padding: '28px 0',
        borderBottom: index === undefined ? '1px solid #ede5d8' : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#f7f2ea'
        e.currentTarget.style.paddingLeft = '12px'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.paddingLeft = '0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 11, color: 'rgba(28,24,18,0.2)', fontStyle: 'italic',
            paddingTop: 3, minWidth: 20, textAlign: 'right',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Tag label={post.tag} />
            <span style={{ fontSize: 11, color: 'rgba(28,24,18,0.35)', letterSpacing: '0.03em' }}>
              {post.date}
            </span>
            <span style={{ color: 'rgba(28,24,18,0.2)' }}>·</span>
            <span style={{ fontSize: 11, color: 'rgba(28,24,18,0.35)' }}>
              {post.read_time}
            </span>
          </div>

          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.05rem, 2.6vw, 1.3rem)', fontWeight: 600,
              lineHeight: 1.35, color: '#1c1812', marginBottom: 8,
            }}
          >
            {post.title}
          </h3>

          <p
            style={{
              fontSize: 13, lineHeight: 1.7, color: 'rgba(28,24,18,0.5)',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </p>
        </div>

        <div
          style={{
            paddingTop: 4, flexShrink: 0, opacity: 0, transform: 'translateX(-6px)',
            transition: 'opacity 0.2s, transform 0.2s', color: '#b8955a',
          }}
          className="post-arrow"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </article>
  )
}

export default PostCard
