import React, { useState, useRef, useEffect } from 'react';
import { Scissors, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';

interface HeaderProps {
  onPageChange: (page: 'home' | 'appointments' | 'profile') => void;
}

const Header = ({ onPageChange }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const scrollToSection = (sectionId: string) => {
    onPageChange('home');
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        const headerOffset = 96;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <header className="fixed w-full bg-black/90 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => scrollToSection('home')}
        >
          <Scissors className="h-8 w-8 text-amber-500" />
          <span className="text-2xl font-bold">Barbearia Elegance</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('home')}
            className="hover:text-amber-500 transition-colors"
          >
            Início
          </button>
          <button 
            onClick={() => scrollToSection('services')}
            className="hover:text-amber-500 transition-colors"
          >
            Serviços
          </button>
          <button 
            onClick={() => scrollToSection('booking')}
            className="hover:text-amber-500 transition-colors"
          >
            Agendamento
          </button>
          <button 
            onClick={() => scrollToSection('gallery')}
            className="hover:text-amber-500 transition-colors"
          >
            Galeria
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="hover:text-amber-500 transition-colors"
          >
            Sobre
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="hover:text-amber-500 transition-colors"
          >
            Contato
          </button>
        </nav>

        <div className="relative">
          {user ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-amber-500 hover:text-amber-400"
              >
                <UserCircle className="w-6 h-6" />
                <span>Minha Conta</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 rounded-md shadow-lg py-1">
                  <button
                    onClick={() => {
                      onPageChange('appointments');
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-zinc-800"
                  >
                    Meus Agendamentos
                  </button>
                  <button
                    onClick={() => {
                      onPageChange('profile');
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-zinc-800"
                  >
                    Perfil
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setShowUserMenu(false);
                      onPageChange('home');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-800"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black transition-colors rounded-md"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}

export default Header;