'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Oswald } from 'next/font/google';
import { UserIcon, Menu, X } from 'lucide-react';
import { destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['700'],
});

const Header = ({ onLoginClick, user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

const handleLogout = async () => {
  try {
    // Send the logout request, ensuring cookies are sent
    const res = await fetch('/api/logout', {
      method: 'POST',  // Ensure it's a POST request for logout
      credentials: 'include',  // Include cookies for logout
    });

    if (res.ok) {
      // Redirect to the home page (or login page, depending on your flow)
      router.replace('/');
      // Optionally reload the page to reset the state
      window.location.reload(); 
    } else {
      console.error('Logout failed.');
    }
  } catch (err) {
    console.error('Logout error:', err);
  }
};



  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = ['Renters', 'Home Owners', 'Help Me Find', 'Locations'];

  return (
    <header className={`${oswald.className} w-full relative bg-white`}>
      <div className="flex justify-between items-center px-6 py-4 relative max-w-7xl mx-auto">
        {/* Mobile: Hamburger Left */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="text-gray-700 focus:outline-none z-50"
          >
            {mobileNavOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Logo: Centered on Mobile, Left on Desktop */}
        <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2 md:static md:translate-x-0">
          <img src="/aparte-logo.png" alt="Logo" className="h-12 w-25" />
        </div>

        {/* Right Side (Account/Login) */}
        <div className="text-base text-gray-700 relative z-50" ref={dropdownRef}>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <UserIcon size={20} />
                <span>My Account</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-md z-50">
                  <a
                    href={user?.role === 'agent' ? '/dashboard' : '/seeker-dashboard'}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="hover:underline cursor-pointer bg-transparent border-none p-0"
              type="button"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Desktop Center Nav */}
      <nav className="hidden md:flex gap-6 text-lg font-semibold text-gray-800 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {navLinks.map((item) => (
          <button key={item} className="group relative">
            <span className="transition duration-300 group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent">
              {item}
            </span>
          </button>
        ))}
      </nav>

      {/* Mobile Nav Dropdown */}
      {mobileNavOpen && (
        <div className="md:hidden px-6 pb-4">
          <nav className="flex flex-col gap-4 text-lg font-semibold text-gray-800">
            {navLinks.map((item) => (
              <button
                key={item}
                className="text-left hover:text-orange-500"
                onClick={() => setMobileNavOpen(false)}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-pink-500"></div>
    </header>
  );
};

export default Header;
