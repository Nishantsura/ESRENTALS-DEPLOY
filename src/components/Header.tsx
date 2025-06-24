"use client"

import { Home, Car, SprayCan, HelpCircle, Menu, X, Phone, Award, PanelRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { NavBar } from '@/components/ui/tubelight-navbar';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: 'Home', url: '/', icon: Home, color: 'text-blue-500' },
    { name: 'Browse Cars', url: '/cars', icon: Car, color: 'text-green-500' },
    { name: 'Brands', url: '/brands', icon: SprayCan, color: 'text-purple-500' },
    { name: 'FAQ', url: '/faq', icon: HelpCircle, color: 'text-amber-500' }
  ];

  // Show hamburger menu for mobile and tablet
  const showHamburger = isMobile || isTablet;

  return (
    <>
      <header className="py-2 sm:py-2 px-4 sm:px-8 border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50 left-0 right-0 theme-transition shadow-sm">
        <div className='flex flex-row items-center justify-between w-full max-w-[1800px] mx-auto'>
          {/* Logo */}
          <a 
            href="/" 
            className="flex items-center"
            aria-label="Go to homepage"
          >
            <img 
              src="/images/download.png" 
              alt="AutoLuxe Logo" 
              className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto object-contain transition-all duration-300" 
            />
          </a>

          {/* Desktop Navigation - Only show on desktop (lg and above) */}
          {!showHamburger && (
            <div className="flex-1 flex items-center justify-center">
              <NavBar items={navItems} className="static sm:transform-none mx-auto" />
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Quick Book Button - Hidden on mobile, shown on tablet and desktop */}
            <a 
              href="https://wa.me/971553553626" 
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary text-black rounded-full hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4 text-black" />
              <span className="text-sm font-semibold">Quick Book</span>
            </a>
            
            {/* Hamburger Menu Button - Only show on mobile and tablet */}
            {showHamburger && (
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 hover:bg-primary/20 rounded-full transition-all duration-300"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-primary hover:scale-110 transition-transform duration-300" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile/Tablet Slide-out Menu */}
      {showHamburger && (
        <div 
          className={`fixed top-0 right-0 h-full w-80 bg-card/95 backdrop-blur-md shadow-xl transform transition-all duration-300 ease-in-out z-[100] ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-foreground">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>
            
            {/* Navigation Items */}
            <nav className="flex flex-col gap-4 flex-1">
              {navItems.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  className={`text-lg font-medium transition-colors hover:text-primary p-3 rounded-lg hover:bg-primary/10 ${
                    pathname === item.url ? 'text-primary bg-primary/20' : 'text-gray-200'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Divider */}
              <div className="h-px bg-gray-800 my-4" />
              
              {/* Additional Links */}
              <a 
                href="/terms" 
                className="text-lg font-medium text-gray-200 hover:text-primary transition-colors p-3 rounded-lg hover:bg-primary/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Terms & Conditions
              </a>
              <a 
                href="/privacy-policy" 
                className="text-lg font-medium text-gray-200 hover:text-primary transition-colors p-3 rounded-lg hover:bg-primary/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Privacy Policy
              </a>
            </nav>
            
            {/* Quick Book Button in Mobile Menu */}
            <div className="mt-auto pt-4">
              <a 
                href="https://wa.me/971553553626" 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-black rounded-full hover:opacity-90 transition-opacity font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone className="w-4 h-4 text-black" />
                <span>Quick Book</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Overlay - Only show when hamburger menu is open */}
      {showHamburger && (
        <div 
          className={`fixed inset-0 backdrop-blur-[2px] bg-black/30 transition-all duration-300 z-[90] ${
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Header;
