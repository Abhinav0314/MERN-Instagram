"use client";
import React, { useState, useEffect } from 'react';

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from "../../utils/apiClient";
import { Home, PlusSquare, User as UserIcon, ChevronLeft, Moon, Sun } from "lucide-react";

const PremiumHomeIcon = ({ active, color, size = 26 }) => (
  <svg 
    aria-label="Home" 
    height={size} 
    width={size} 
    viewBox="0 0 24 24"
  >
    {active ? (
      <path 
        d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z" 
        fill={color} 
        stroke="none"
      />
    ) : (
      <path 
        d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" 
        fill="none" 
        stroke={color} 
        strokeWidth={2} 
        strokeLinejoin="round" 
        strokeLinecap="round" 
      />
    )}
  </svg>
);

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isProfilePage = pathname === '/profile';
  const queryClient = useQueryClient();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Read the current theme from document on mount
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await api.get('/user/me');
      return data.user;
    },
    retry: false
  });

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
      localStorage.removeItem('token');
      queryClient.clear();
    } catch (error) {
      console.error("Logout failed", error);
    }
    router.push('/login');
  };

  return (
    <>
      <nav 
        className={`navbar sticky-top bg-white border-bottom top-navbar py-2 ${isProfilePage ? 'd-none d-md-flex' : ''}`}
        style={{ zIndex: 1050 }}
      >
        <div className="container d-flex align-items-center" style={{ maxWidth: '975px' }}>
          <div className="d-flex align-items-center me-4">
             {/* Mobile Back Button */}
             <span className="d-md-none me-2 d-flex align-items-center cursor-pointer">
               {(pathname === '/edit-profile' || pathname === '/create-post') && (
                 <ChevronLeft 
                   size={28} 
                   onClick={() => router.back()} 
                 />
               )}
             </span>
             <Link className="navbar-brand fs-4 text-dark fw-bold m-0" href="/">
                {/* Desktop: Always show Instagram */}
                <span className="d-none d-md-inline">Instagram</span>
                
                 {/* Mobile: Show contextual title */}
                 <span className="d-inline d-md-none">
                   {pathname === '/edit-profile' ? 'Edit Profile' 
                    : pathname === '/create-post' ? 'New Post' 
                    : pathname === '/feed' ? 'Your Feed'
                    : pathname === '/profile' && user ? user.username 
                    : 'Instagram'}
                 </span>
              </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="d-none d-md-flex align-items-center flex-grow-1">
            {userLoading ? (
              <div style={{ width: '200px' }}></div>
            ) : user ? (
              <>
                <ul className="navbar-nav flex-row gap-4 me-auto">
                  <li className="nav-item">
                    <Link className={`nav-link fw-bold fs-6 nav-text-link ${pathname === '/feed' ? 'text-dark active' : 'text-secondary'}`} href="/feed" title="Feed">
                      Feed
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link fw-bold fs-6 nav-text-link ${pathname === '/create-post' ? 'text-dark active' : 'text-secondary'}`} href="/create-post" title="Create">
                      Create
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link fw-bold fs-6 nav-text-link ${pathname === '/profile' ? 'text-dark active' : 'text-secondary'}`} href="/profile" title="Profile">
                      Profile
                    </Link>
                  </li>
                </ul>
                <div className="d-flex align-items-center gap-3">
                  <button onClick={toggleTheme} className="btn btn-link text-dark p-0 border-0 shadow-none d-flex align-items-center justify-content-center" title="Toggle Theme">
                    {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                  </button>
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-bold shadow-sm">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <ul className="navbar-nav flex-row align-items-center gap-3 ms-auto">
                <li className="nav-item">
                  <button onClick={toggleTheme} className="btn btn-link text-dark p-0 border-0 shadow-none d-flex align-items-center justify-content-center me-2" title="Toggle Theme">
                    {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                  </button>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary rounded-pill px-4 btn-sm fw-bold shadow-sm" href="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-bold" href="/register">Sign Up</Link>
                </li>
              </ul>
            )}
          </div>

          <div className="d-flex d-md-none align-items-center ms-auto gap-3">
            <button onClick={toggleTheme} className="btn btn-link text-dark p-0 border-0 shadow-none d-flex align-items-center justify-content-center" title="Toggle Theme">
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            
            {/* Mobile non-logged in state */}
            {userLoading ? null : !user && (
              <Link className="btn btn-primary rounded-pill px-3 btn-sm fw-bold shadow-sm" href="/login">Login</Link>
            )}

            {/* Mobile Logged in state (Share button) */}
            {user && pathname === '/create-post' && (
              <button 
                type="button" 
                className="btn btn-link text-primary fw-bold text-decoration-none p-0 fs-6"
                onClick={() => {
                  const btn = document.getElementById('hidden-share-btn');
                  if (btn) btn.click();
                }}
              >
                Share
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      {user && (
        <nav className="bottom-nav d-flex d-md-none">
          <Link href="/feed" className="bottom-nav-link d-flex flex-column align-items-center">
            <PremiumHomeIcon 
              active={pathname === '/feed'} 
              size={26} 
              color={pathname === '/feed' ? 'var(--text-main)' : 'var(--text-muted)'} 
            />
          </Link>
          <Link href="/create-post" className="bottom-nav-link d-flex flex-column align-items-center">
            <PlusSquare size={26} strokeWidth={2} color={pathname === '/create-post' ? 'var(--text-main)' : 'var(--text-muted)'} />
          </Link>
          <Link href="/profile" className="bottom-nav-link d-flex flex-column align-items-center">
            <UserIcon size={26} strokeWidth={2} color={pathname === '/profile' ? 'var(--text-main)' : 'var(--text-muted)'} />
          </Link>
        </nav>
      )}
    </>
  );
}

export default Navbar;

