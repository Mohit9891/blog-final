import React, { useState } from 'react'

const Navbar = () => {
  const [open, setOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '#', active: true },
    { label: 'Blog', href: '#' },
    { label: 'About', href: '#' },
    
  ]

  return (
    <>
      <style>{`
        .nav-link::after {
          content: '';
          display: block;
          height: 1px;
          width: 0;
          background: #b8955a;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }
        .nav-link.active::after { width: 100%; }
      `}</style>

      <nav className="fixed top-0 inset-x-0 z-50 bg-[#faf8f4]/90 backdrop-blur-md border-b border-[#e2d9c8]">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <a href="#" className="text-xl font-bold tracking-tight text-[#1a1814] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b8955a] inline-block" />
            Mohit
          </a>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-8 list-none">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`nav-link text-sm font-medium tracking-widest uppercase transition-colors ${
                    link.active
                      ? 'active text-[#1a1814]'
                      : 'text-[#1a1814]/50 hover:text-[#1a1814]'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase bg-[#1a1814] text-[#faf8f4] px-5 py-2.5 hover:bg-[#b8955a] transition-colors duration-300"
          >
            Contact
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-1"
          >
            <span className={`block w-6 h-px bg-[#1a1814] ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-px bg-[#1a1814] ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-[#1a1814] ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-[#f2ede3] border-t border-[#e2d9c8] px-6 py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium tracking-widest uppercase ${
                  link.active ? 'text-[#1a1814]' : 'text-[#1a1814]/50'
                }`}
              >
                {link.label}
              </a>
            ))}

            <a
              href="#"
              className="mt-2 inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase bg-[#1a1814] text-[#faf8f4] px-5 py-3 w-fit hover:bg-[#b8955a]"
            >
              Contact
            </a>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar