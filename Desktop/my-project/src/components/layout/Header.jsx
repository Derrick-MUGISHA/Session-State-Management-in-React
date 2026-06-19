import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

const navLinks = [
  { label: "Stays", to: "/" },
  { label: "Flights", to: "/flights" },
  { label: "Car rental", to: "/car-rental" },
  { label: "Attractions", to: "/attractions" },
  { label: "Airport taxis", to: "/airport-taxis" },
];

const secondaryLinks = ["Flights", "Car rental", "Attractions", "Airport taxis"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-navy text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span className="text-brand-yellow">Booking</span>
          <span>.Com</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-brand-yellow ${
                  isActive ? "text-brand-yellow" : "text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button type="button" className="text-sm font-medium hover:text-brand-yellow">
            USD
          </button>
          <button type="button" aria-label="Language" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.7 4 6.2 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6.2-4-9s1.5-6.3 4-9z" />
            </svg>
          </button>
          <Link to="/login" className="rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-white/10">
          Sign in
          </Link>
          <Link to="/signup" className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-navy hover:bg-white/90">
          Register
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex items-center justify-center rounded-md p-2 hover:bg-white/10 md:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div className="hidden border-t border-white/10 md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-2 sm:px-6 lg:px-8">
          {secondaryLinks.map((label) => (
            <button
              key={label}
              type="button"
              className="text-sm font-medium text-white/80 transition-colors hover:text-brand-yellow"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-brand-navy md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10">
                {link.label}
              </NavLink>
            ))}
            {secondaryLinks.map((label) => (
              <button key={label} type="button" className="rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-white/10">
                {label}
              </button>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-white/10">
                Sign in
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-brand-navy hover:bg-brand-yellow">
                Register
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}