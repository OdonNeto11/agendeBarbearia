import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black pt-20 pb-6">
      <div id="contact" className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <MapPin className="w-5 h-5 text-amber-500 mr-2" />
                <span className="text-gray-300">Rua Example, 123 - Centro</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-amber-500 mr-2" />
                <span className="text-gray-300">(11) 99999-9999</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-amber-500 mr-2" />
                <span className="text-gray-300">contato@barbearia.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Horário de Funcionamento</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Segunda a Sexta: 9h às 20h</li>
              <li>Sábado: 9h às 18h</li>
              <li>Domingo: Fechado</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-amber-500 hover:text-amber-600">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-amber-500 hover:text-amber-600">
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Receba novidades e promoções exclusivas.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-2 bg-zinc-900 rounded-l-md focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 text-black rounded-r-md hover:bg-amber-600 transition-colors"
              >
                Assinar
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6 text-center text-gray-400">
          <p>© 2024 Barbearia Elegance. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;