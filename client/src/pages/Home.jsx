import React, { useEffect, useRef, useState } from 'react'
import PostDetail from './PostDetail'

// ── Sample data ──────────────────────────────────────────────────────────────
const featuredPost = {
  tag: 'Essay',
  title: 'On the quiet art of paying attention to ordinary things',
  excerpt:
    'We rush past a hundred moments every day that deserve a second look. Here is why slowing down might be the most radical thing you can do.',
  date: 'March 18, 2026',
  readTime: '7 min read',
}

const recentPosts = [
  {
    id: 1,
    tag: 'Craft',
    title: 'How I outline anything — essays, code, decisions',
    excerpt: "A simple three-step method I've used for years that works across every domain.",
    date: 'Mar 10, 2026',
    readTime: '5 min',
  },
  {
    id: 2,
    tag: 'Life',
    title: 'Six months without social media: an honest report',
    excerpt: 'What I gained, what I missed, and why I\'m not fully going back.',
    date: 'Feb 28, 2026',
    readTime: '9 min',
  },
  {
    id: 3,
    tag: 'Tech',
    title: 'The tools I actually use to write and think',
    excerpt:
      'No sponsored mentions — just the software and rituals that stuck after years of experimenting.',
    date: 'Feb 14, 2026',
    readTime: '6 min',
  },
  {
    id: 4,
    tag: 'Essay',
    title: 'Rereading books: why the second visit changes everything',
    excerpt: "A different person reads the same pages a second time. Here's what that taught me.",
    date: 'Jan 30, 2026',
    readTime: '4 min',
  },
]
const topics = ['All', 'Essay', 'Craft', 'Tech', 'Life', 'Books', 'Notes']

const tagColors = {
  Essay: { bg: '#f5efe4', text: '#8b6914', border: '#d4b87a' },
  Craft: { bg: '#edf4f0', text: '#2d6a4f', border: '#74c69d' },
  Tech: { bg: '#eef2fa', text: '#2c4fa3', border: '#7fa6e0' },
  Life: { bg: '#faeef4', text: '#8b2252', border: '#d88fb8' },
  Books: { bg: '#f0eefc', text: '#4a3594', border: '#a899e8' },
  Notes: { bg: '#f4f0ec', text: '#6b5a47', border: '#c4a882' },
}

// ── Reveal hook ───────────────────────────────────────────────────────────────
function useReveal() {
  const refs = useRef([])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            observer.unobserve(e.target)
          }
        }),
      { threshold: 0.1 }
    )
    refs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])
  const addRef = (el) => {
    if (el && !refs.current.includes(el)) refs.current.push(el)
  }
  return addRef
}

// ── Tag pill ──────────────────────────────────────────────────────────────────
const Tag = ({ label }) => {
  const c = tagColors[label] || tagColors['Notes']
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        padding: '3px 10px',
        borderRadius: 99,
        display: 'inline-block',
      }}
    >
      {label}
    </span>
  )
}

// ── Reading-progress bar ──────────────────────────────────────────────────────
const ProgressBar = () => {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 2,
        width: `${pct}%`,
        background: 'linear-gradient(to right, #b8955a, #d4b87a)',
        zIndex: 9999,
        transition: 'width 0.1s linear',
      }}
    />
  )
}

// ── Main component ────────────────────────────────────────────────────────────
const Home = () => {
  const reveal = useReveal()
  const [activeTag, setActiveTag] = useState('All')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  const filtered =
    activeTag === 'All' ? recentPosts : recentPosts.filter((p) => p.tag === activeTag)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'Instrument Sans', sans-serif;
          background: #fdfaf5;
          color: #1c1812;
          -webkit-font-smoothing: antialiased;
        }

        /* Noise texture overlay */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 1000;
        }

        .serif { font-family: 'Playfair Display', Georgia, serif; }

        /* Scroll reveal */
        .fade-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
        }
        .fade-up.is-visible { opacity: 1; transform: none; }
        .d1 { transition-delay: 0.08s; }
        .d2 { transition-delay: 0.16s; }
        .d3 { transition-delay: 0.24s; }
        .d4 { transition-delay: 0.32s; }
        .d5 { transition-delay: 0.40s; }

        /* Horizontal marquee */
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          white-space: nowrap;
          animation: marquee 30s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }

        /* Post hover */
        .post-row {
          border-top: 1px solid #ede5d8;
          cursor: pointer;
          transition: background 0.2s;
          padding: 28px 0;
        }
        .post-row:last-child { border-bottom: 1px solid #ede5d8; }
        .post-row:hover { background: #f7f2ea; padding-left: 12px; transition: background 0.2s, padding-left 0.25s; }
        
        .post-row:hover .post-arrow { opacity: 1; transform: translateX(0); }
        .post-arrow {
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.2s, transform 0.2s;
          color: #b8955a;
        }

        /* Topic pill */
        .topic-pill {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          padding: 6px 18px;
          border-radius: 99px;
          border: 1px solid #ddd5c5;
          background: transparent;
          color: #6b5f52;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .topic-pill:hover { border-color: #b8955a; color: #b8955a; }
        .topic-pill.active {
          background: #1c1812;
          border-color: #1c1812;
          color: #fdfaf5;
        }

        /* Input */
        .email-input {
          flex: 1;
          padding: 13px 18px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          color: #1c1812;
          background: transparent;
          border: 1px solid #ccc4b4;
          border-right: none;
          outline: none;
          transition: border-color 0.2s;
        }
        .email-input:focus { border-color: #b8955a; }
        .email-input::placeholder { color: #b0a494; }

        .sub-btn {
          padding: 13px 28px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: #1c1812;
          color: #fdfaf5;
          border: 1px solid #1c1812;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .sub-btn:hover { background: #b8955a; border-color: #b8955a; }

        /* Underline link */
        .underline-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #1c1812;
          text-decoration: none;
          padding-bottom: 2px;
          border-bottom: 1.5px solid #cfc5b2;
          transition: border-color 0.2s, color 0.2s;
        }
        .underline-link:hover { border-color: #b8955a; color: #b8955a; }

        /* Social links */
        .social-link {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
          color: rgba(253,250,245,0.35);
          text-decoration: none;
          transition: color 0.2s;
        }
        .social-link:hover { color: #d4b87a; }
      `}</style>

      <ProgressBar />

      <main>

        {/* ══ HERO ═══════════════════════════════════════════════════════════ */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '120px 32px 80px' }}>

          {/* Eyebrow */}
          <div
            className="fade-up"
            ref={reveal}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}
          >
            <span style={{ display: 'block', width: 32, height: 1.5, background: '#b8955a' }} />
            <span
              style={{
                fontSize: 10,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#b8955a',
                fontWeight: 600,
              }}
            >
              Personal · Blog
            </span>
          </div>

          {/* Headline */}
          <h1
            className="serif fade-up d1"
            ref={reveal}
            style={{
              fontSize: 'clamp(2.6rem, 7vw, 4.4rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#1c1812',
              marginBottom: 28,
            }}
          >
            Writing about craft,
            <br />
            <em style={{ color: '#b8955a' }}>curiosity</em>,
            <br />
            and the examined life.
          </h1>

          {/* Bio */}
          <p
            className="fade-up d2"
            ref={reveal}
            style={{
              fontSize: 17,
              fontWeight: 300,
              lineHeight: 1.75,
              color: 'rgba(28,24,18,0.55)',
              maxWidth: 480,
              marginBottom: 40,
            }}
          >
            I'm{' '}
            <strong style={{ fontWeight: 600, color: '#1c1812' }}>Alex Rivera</strong> — a writer,
            developer, and chronic note-taker. Here I think out loud about ideas that won't leave me
            alone.
          </p>

          {/* CTAs */}
          <div
            className="fade-up d3"
            ref={reveal}
            style={{ display: 'flex', alignItems: 'center', gap: 28 }}
          >
            <a href="#posts" className="underline-link">
              Read the blog
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a
              href="#about"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'rgba(28,24,18,0.4)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#1c1812')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(28,24,18,0.4)')}
            >
              About me
            </a>
          </div>
        </section>

        {/* ══ MARQUEE STRIP ══════════════════════════════════════════════════ */}
        <div
          style={{
            overflow: 'hidden',
            borderTop: '1px solid #e8e0d0',
            borderBottom: '1px solid #e8e0d0',
            padding: '13px 0',
            background: '#f5efe3',
          }}
        >
          <div className="marquee-track">
            {[...Array(2)].map((_, ai) => (
              <span key={ai} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {['Essay', 'Craft', 'Technology', 'Life', 'Books', 'Notes', 'Ideas', 'Reflection'].map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'rgba(28,24,18,0.45)',
                      fontWeight: 500,
                      padding: '0 28px',
                    }}
                  >
                    {t}
                    <span style={{ marginLeft: 28, color: '#b8955a', fontSize: 8 }}>◆</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ══ FEATURED POST ══════════════════════════════════════════════════ */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '80px 32px' }}>
          <div
            className="fade-up"
            ref={reveal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 32,
            }}
          >
            <span
              style={{
                fontSize: 10,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#b8955a',
                fontWeight: 600,
              }}
            >
              Featured Essay
            </span>
            <span style={{ flex: 1, height: 1, background: '#ede5d8' }} />
          </div>

          {/* Card */}
          <article
            className="fade-up d1"
            ref={reveal}
            onClick={() => setSelectedPost(featuredPost)}
            style={{
              position: 'relative',
              background: '#1c1812',
              padding: 'clamp(36px, 6vw, 64px)',
              cursor: 'pointer',
              overflow: 'hidden',
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
            {/* Decorative serif glyph */}
            <span
              className="serif"
              style={{
                position: 'absolute',
                top: -20,
                right: 32,
                fontSize: 200,
                lineHeight: 1,
                color: 'rgba(184,149,90,0.06)',
                fontStyle: 'italic',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              "
            </span>

            {/* Gold accent line */}
            <div style={{ width: 40, height: 2, background: '#b8955a', marginBottom: 28 }} />

            <Tag label={featuredPost.tag} />

            <h2
              className="serif"
              style={{
                fontSize: 'clamp(1.6rem, 3.8vw, 2.5rem)',
                fontWeight: 600,
                lineHeight: 1.2,
                color: '#fdfaf5',
                marginTop: 20,
                marginBottom: 18,
                maxWidth: 540,
              }}
            >
              {featuredPost.title}
            </h2>

            <p
              style={{
                fontSize: 15,
                lineHeight: 1.8,
                color: 'rgba(253,250,245,0.55)',
                maxWidth: 480,
                marginBottom: 40,
              }}
            >
              {featuredPost.excerpt}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 12, color: 'rgba(253,250,245,0.4)', letterSpacing: '0.04em' }}>
                  {featuredPost.date}
                </span>
                <span style={{ color: 'rgba(253,250,245,0.2)', fontSize: 12 }}>·</span>
                <span style={{ fontSize: 12, color: 'rgba(253,250,245,0.4)' }}>
                  {featuredPost.readTime}
                </span>
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: '#b8955a',
                }}
              >
                Read Essay
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </article>
        </section>

        {/* ══ TOPIC FILTER + POSTS ════════════════════════════════════════════ */}
        <section id="posts" style={{ maxWidth: 760, margin: '0 auto', padding: '0 32px 80px' }}>

          {/* Section header */}
          <div
            className="fade-up"
            ref={reveal}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 28,
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <span
              style={{
                fontSize: 10,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(28,24,18,0.35)',
                fontWeight: 600,
              }}
            >
              Recent Writing
            </span>

            {/* Topic pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {topics.map((t) => (
                <button
                  key={t}
                  className={`topic-pill ${activeTag === t ? 'active' : ''}`}
                  onClick={() => setActiveTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Post list */}
          <div>
            {filtered.map((post, i) => (
              <article
                key={post.id}
                ref={reveal}
                onClick={() => setSelectedPost(post)}
                className={`fade-up d${(i % 4) + 1} post-row`}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                  {/* Post number */}
                  <span
                    className="serif"
                    style={{
                      fontSize: 11,
                      color: 'rgba(28,24,18,0.2)',
                      fontStyle: 'italic',
                      paddingTop: 3,
                      minWidth: 20,
                      textAlign: 'right',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}
                    >
                      <Tag label={post.tag} />
                      <span style={{ fontSize: 11, color: 'rgba(28,24,18,0.35)', letterSpacing: '0.03em' }}>
                        {post.date}
                      </span>
                      <span style={{ color: 'rgba(28,24,18,0.2)' }}>·</span>
                      <span style={{ fontSize: 11, color: 'rgba(28,24,18,0.35)' }}>
                        {post.readTime}
                      </span>
                    </div>

                    <h3
                      className="serif"
                      style={{
                        fontSize: 'clamp(1.05rem, 2.6vw, 1.3rem)',
                        fontWeight: 600,
                        lineHeight: 1.35,
                        color: '#1c1812',
                        marginBottom: 8,
                        transition: 'color 0.2s',
                      }}
                    >
                      {post.title}
                    </h3>

                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: 'rgba(28,24,18,0.5)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="post-arrow" style={{ paddingTop: 4, flexShrink: 0 }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* All posts CTA */}
          <div
            className="fade-up"
            ref={reveal}
            style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}
          >
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: '#1c1812',
                textDecoration: 'none',
                padding: '13px 36px',
                border: '1px solid #ccc4b4',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1c1812'
                e.currentTarget.style.color = '#fdfaf5'
                e.currentTarget.style.borderColor = '#1c1812'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#1c1812'
                e.currentTarget.style.borderColor = '#ccc4b4'
              }}
            >
              View all posts
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>

        {/* ══ ABOUT ══════════════════════════════════════════════════════════ */}
        <section
          id="about"
          style={{
            background: '#1c1812',
            padding: '80px 32px',
          }}
        >
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* Avatar */}
            <div style={{ flexShrink: 0 }}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #b8955a, #d4b87a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 32,
                  fontStyle: 'italic',
                  color: '#1c1812',
                  fontWeight: 700,
                }}
              >
                A
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 240 }}>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(184,149,90,0.6)',
                  fontWeight: 600,
                  marginBottom: 14,
                }}
              >
                About the writer
              </p>

              <p
                className="serif"
                style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                  fontWeight: 400,
                  lineHeight: 1.75,
                  color: 'rgba(253,250,245,0.85)',
                  marginBottom: 8,
                }}
              >
                I'm a writer and developer living in{' '}
                <em style={{ color: '#d4b87a' }}>Brooklyn, NY.</em>
              </p>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: 'rgba(253,250,245,0.45)',
                  maxWidth: 440,
                  marginBottom: 28,
                }}
              >
                I've been keeping this blog since 2020 as a public notebook — equal parts half-formed ideas and things I finally figured out. I write about craft, technology, books, and the texture of everyday life.
              </p>

              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: '#b8955a',
                  textDecoration: 'none',
                  paddingBottom: 2,
                  borderBottom: '1px solid rgba(184,149,90,0.3)',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#d4b87a'
                  e.currentTarget.style.borderColor = 'rgba(212,184,122,0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#b8955a'
                  e.currentTarget.style.borderColor = 'rgba(184,149,90,0.3)'
                }}
              >
                More about me
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ══ NEWSLETTER ═════════════════════════════════════════════════════ */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '100px 32px' }}>
          <div
            className="fade-up"
            ref={reveal}
            style={{ textAlign: 'center', marginBottom: 44 }}
          >
            {/* Ornament */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                marginBottom: 28,
              }}
            >
              <span style={{ flex: 1, maxWidth: 60, height: 1, background: '#e0d6c8' }} />
              <span style={{ color: '#b8955a', fontSize: 12 }}>◆</span>
              <span style={{ flex: 1, maxWidth: 60, height: 1, background: '#e0d6c8' }} />
            </div>

            <h2
              className="serif fade-up d1"
              ref={reveal}
              style={{
                fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
                fontWeight: 600,
                color: '#1c1812',
                marginBottom: 12,
                lineHeight: 1.2,
              }}
            >
              Words, delivered.
            </h2>

            <p
              className="fade-up d2"
              ref={reveal}
              style={{
                fontSize: 15,
                color: 'rgba(28,24,18,0.5)',
                lineHeight: 1.7,
                maxWidth: 360,
                margin: '0 auto',
              }}
            >
              One email when something new goes up — no noise, no newsletters about newsletters.
              Roughly twice a month.
            </p>
          </div>

          {subscribed ? (
            <div
              className="fade-up is-visible"
              style={{ textAlign: 'center', padding: '24px 0' }}
            >
              <span
                className="serif"
                style={{ fontSize: 18, color: '#b8955a', fontStyle: 'italic' }}
              >
                You're in. See you in your inbox. ✦
              </span>
            </div>
          ) : (
            <div
              className="fade-up d3"
              ref={reveal}
              style={{
                display: 'flex',
                maxWidth: 440,
                margin: '0 auto',
              }}
            >
              <input
                className="email-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && email && setSubscribed(true)}
              />
              <button className="sub-btn" onClick={() => email && setSubscribed(true)}>
                Subscribe
              </button>
            </div>
          )}

          <p
            className="fade-up d4"
            ref={reveal}
            style={{
              textAlign: 'center',
              fontSize: 11,
              color: 'rgba(28,24,18,0.28)',
              marginTop: 14,
              letterSpacing: '0.04em',
            }}
          >
            No spam. Unsubscribe anytime.
          </p>
        </section>

        {/* ══ FOOTER ═════════════════════════════════════════════════════════ */}
        <footer
          style={{
            borderTop: '1px solid #e8e0d0',
            padding: '36px 32px',
          }}
        >
          <div
            style={{
              maxWidth: 760,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <p
              className="serif"
              style={{ fontSize: 13, fontStyle: 'italic', color: 'rgba(28,24,18,0.3)' }}
            >
              Writing since 2020 · Alex Rivera
            </p>

            <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              {['Twitter', 'RSS', 'GitHub'].map((s) => (
                <a key={s} href="#" className="social-link" style={{ color: 'rgba(28,24,18,0.32)' }}
                  onMouseEnter={(e) => (e.target.style.color = '#b8955a')}
                  onMouseLeave={(e) => (e.target.style.color = 'rgba(28,24,18,0.32)')}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </main>

      {selectedPost && (
        <PostDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  )
}

export default Home
