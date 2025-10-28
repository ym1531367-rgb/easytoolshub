
import React, { useState } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import AdSlot from './AdSlot';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavLink: React.FC<{ to: string, children: React.ReactNode, onClick?: () => void }> = ({ to, children, onClick }) => {
    const isHashLink = to.includes('/#');
    if (isHashLink) {
        return <a href={to.replace('/', '')} onClick={onClick} className="block md:inline-block py-2 md:py-0 text-gray-700 hover:text-primary transition-colors duration-300">{children}</a>
    }
    return (
        <RouterNavLink to={to} onClick={onClick} className={({ isActive }) => 
            `block md:inline-block py-2 md:py-0 transition-colors duration-300 ${isActive ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'}`
        }>
            {children}
        </RouterNavLink>
    );
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            EasyToolsHub
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.name} to={link.path}>{link.name}</NavLink>
            ))}
          </nav>
          <div className="hidden md:block">
             <AdSlot width="w-48" height="h-12" />
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-primary focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col items-center space-y-2 px-4 py-4">
            {NAV_LINKS.map((link) => (
               <NavLink key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)}>{link.name}</NavLink>
            ))}
            <div className="pt-4">
              <AdSlot width="w-full" height="h-16" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
