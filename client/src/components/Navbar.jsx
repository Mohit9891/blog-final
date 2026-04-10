import { useState, useEffect } from "react"

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinks = [
    { label: "Home", href: "#", active: true },
    { label: "Blog", href: "#" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#" },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        .nav-root {
          font-family: 'DM Sans', sans-serif;
        }

        .nav-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: #ffffff;
          transition: box-shadow 0.4s ease, border-color 0.4s ease;
          border-bottom: 1px solid #f0ece4;
        }

        .nav-bar.scrolled {
          box-shadow: 0 1px 24px rgba(0,0,0,0.06);
          border-bottom-color: #e8e2d8;
        }

        .nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #111;
          text-decoration: none;
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-dot {
          width: 7px;
          height: 7px;
          background: #c9a96e;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.18);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          color: #999;
          position: relative;
          transition: color 0.25s ease;
          padding-bottom: 2px;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: #c9a96e;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 2px;
        }

        .nav-link:hover {
          color: #111;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .nav-link.active {
          color: #111;
        }

        .nav-cta {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          color: #111;
          border: 1px solid #ddd;
          padding: 7px 18px;
          border-radius: 999px;
          transition: background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
        }

        .nav-cta:hover {
          background: #111;
          border-color: #111;
          color: #fff;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .hamburger:hover {
          background: #f5f3ef;
        }

        .ham-line {
          display: block;
          width: 22px;
          height: 1.5px;
          background: #111;
          border-radius: 2px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
          transform-origin: center;
        }

        .ham-line.open-1 { transform: translateY(6.5px) rotate(45deg); }
        .ham-line.open-2 { opacity: 0; transform: scaleX(0); }
        .ham-line.open-3 { transform: translateY(-6.5px) rotate(-45deg); }

        .mobile-menu {
          background: #ffffff;
          border-top: 1px solid #f0ece4;
          overflow: hidden;
          animation: slideDown 0.28s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mobile-menu-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 1.5rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .mobile-link {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          color: #999;
          padding: 14px 0;
          border-bottom: 1px solid #f5f2ed;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mobile-link::after {
          content: '↗';
          font-size: 0.8rem;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .mobile-link:hover { color: #111; }
        .mobile-link:hover::after { opacity: 1; }
        .mobile-link.active { color: #111; }
        .mobile-link:last-child { border-bottom: none; }

        @media (max-width: 768px) {
          .nav-links, .nav-cta { display: none !important; }
          .hamburger { display: flex; }
        }
      `}</style>

      <nav className={`nav-root nav-bar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">

          {/* Logo */}
          <a href="#" className="nav-logo">
            <span className="logo-dot" />
            Mohit
          </a>

          {/* Desktop links */}
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`nav-link${link.active ? " active" : ""}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a href="#contact" className="nav-cta" style={{ display: "none" }}>
            Let's talk
          </a>

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className={`ham-line${open ? " open-1" : ""}`} />
            <span className={`ham-line${open ? " open-2" : ""}`} />
            <span className={`ham-line${open ? " open-3" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="mobile-menu">
            <div className="mobile-menu-inner">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`mobile-link${link.active ? " active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar
