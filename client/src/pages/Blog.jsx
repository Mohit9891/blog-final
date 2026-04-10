import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import PostCard from './PostCard'
import FeaturedPost from './FeaturedPost'
import PostDetail from './PostDetail'

const TOPICS = ['All', 'Essay', 'Craft', 'Tech', 'Life', 'Books', 'Notes']

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null)
  const [activeTag, setActiveTag] = useState('All')
  const [featuredPost, setFeaturedPost] = useState(null)
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data && data.length > 0) {
          setFeaturedPost(data[0])
          setRecentPosts(data.slice(1))
        }
      } catch (err) {
        setError('Could not load posts. Please try again later.')
        console.error('Supabase fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // ── Filter posts by tag
  const filtered =
    activeTag === 'All'
      ? recentPosts
      : recentPosts.filter((p) => p.tag === activeTag)

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

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
        .topic-pill.active { background: #1c1812; border-color: #1c1812; color: #fdfaf5; }

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

        .skeleton {
          border-radius: 4px;
          background: linear-gradient(90deg, #ede5d8 25%, #f5efe4 50%, #ede5d8 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s ease infinite;
        }
      `}</style>

      {/* ══ FEATURED POST ══════════════════════════════════════════════════ */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#b8955a', fontWeight: 600 }}>
            Featured Essay
          </span>
          <span style={{ flex: 1, height: 1, background: '#ede5d8' }} />
        </div>

        {/* Error state */}
        {error && (
          <div style={{ padding: '32px', background: '#faeef4', border: '1px solid #d88fb8', color: '#8b2252', fontSize: 14, textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div style={{ background: '#1c1812', padding: 'clamp(36px, 6vw, 64px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="skeleton" style={{ width: 40, height: 2, background: '#b8955a', animation: 'none' }} />
            <div className="skeleton" style={{ width: 80, height: 22, background: 'rgba(255,255,255,0.08)', animation: 'none' }} />
            <div className="skeleton" style={{ width: '80%', height: 36, background: 'rgba(255,255,255,0.06)', animation: 'none' }} />
            <div className="skeleton" style={{ width: '60%', height: 36, background: 'rgba(255,255,255,0.06)', animation: 'none' }} />
          </div>
        )}

        {/* Loaded featured post */}
        {!loading && !error && featuredPost && (
          <FeaturedPost post={featuredPost} onSelect={() => setSelectedPost(featuredPost)} />
        )}

        {/* No posts */}
        {!loading && !error && !featuredPost && (
          <div style={{ padding: '48px 32px', textAlign: 'center', border: '1px dashed #ddd5c5' }}>
            <p style={{ fontSize: 14, color: 'rgba(28,24,18,0.4)', fontStyle: 'italic' }}>
              No posts yet. Add your first post in the admin panel.
            </p>
          </div>
        )}
      </section>

      {/* ══ TOPIC FILTER + POSTS ════════════════════════════════════════════ */}
      <section id="posts" style={{ maxWidth: 760, margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(28,24,18,0.35)', fontWeight: 600 }}>
            Recent Writing
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {TOPICS.map((t) => (
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

        {/* Loading skeletons */}
        {loading && !error && (
          <div>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ borderTop: '1px solid #ede5d8', padding: '28px 0', display: 'flex', gap: 20 }}>
                <div className="skeleton" style={{ width: 20, height: 14 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div className="skeleton" style={{ width: 60, height: 20, borderRadius: 99 }} />
                    <div className="skeleton" style={{ width: 80, height: 14 }} />
                  </div>
                  <div className="skeleton" style={{ width: '70%', height: 20 }} />
                  <div className="skeleton" style={{ width: '90%', height: 14 }} />
                  <div className="skeleton" style={{ width: '60%', height: 14 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Post list */}
        {!loading && !error && (
          <div>
            {filtered.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: 'rgba(28,24,18,0.38)', fontStyle: 'italic' }}>
                  {recentPosts.length === 0 ? 'No posts yet.' : `No posts tagged "${activeTag}".`}
                </p>
              </div>
            ) : (
              filtered.map((post, i) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={i}
                  onSelect={() => setSelectedPost(post)}
                />
              ))
            )}
          </div>
        )}

        {/* View all CTA */}
        {!loading && filtered.length > 0 && (
          <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}>
            <a
              href="#"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600,
                color: '#1c1812', textDecoration: 'none', padding: '13px 36px',
                border: '1px solid #ccc4b4', transition: 'all 0.2s',
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
        )}
      </section>

      {/* Post detail modal */}
      {selectedPost && (
        <PostDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  )
}

export default Blog
