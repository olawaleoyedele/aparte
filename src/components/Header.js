'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Oswald } from 'next/font/google';
import { UserIcon } from 'lucide-react';
import { destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['700'],
});

const Header = ({ onLoginClick, user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const handleLogout = () => {
  destroyCookie(null, 'auth_token'); // replace 'auth_token' with your actual cookie key
  router.push('/');
  router.refresh(); // Refresh Next.js router (optional but useful)
};


  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`${oswald.className} w-full relative bg-white`}>
      <div className="flex justify-between items-center px-6 py-3 relative max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img src="/aparte-logo.png" alt="Logo" className="h-12 w-25 ml-[-15px]" />
        </div>

        {/* Nav Center */}
        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-6 text-lg font-semibold text-gray-800">
          {['Renters', 'Home Owners', 'Help Me Find', 'Locations'].map((item) => (
            <button key={item} className="group relative">
              <span className="transition duration-300 group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent">
                {item}
              </span>
            </button>
          ))}
        </nav>

        {/* Right Side */}
        <div className="text-base text-gray-700 relative" ref={dropdownRef}>
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
              Login / Register
            </button>
          )}
        </div>
      </div>

      {/* Gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-pink-500"></div>
    </header>
  );
};

export default Header;
