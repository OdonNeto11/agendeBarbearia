import React from 'react';
import { Scissors, ScissorsLineDashed, Package, Sparkles } from 'lucide-react';

const Services = () => {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      icon: Scissors,
      title: 'Corte de Cabelo',
      description: 'Cortes modernos e clássicos para todos os estilos',
      price: 'R$ 60',
    },
    {
      icon: ScissorsLineDashed,
      title: 'Barba',
      description: 'Modelagem e acabamento profissional',
      price: 'R$ 40',
    },
    {
      icon: Package,
      title: 'Pacote Completo',
      description: 'Corte + barba com preço especial',
      price: 'R$ 90',
    },
    {
      icon: Sparkles,
      title: 'Tratamentos',
      description: 'Hidratação e cuidados especiais',
      price: 'R$ 70',
    },
  ];

  return (
    <section id="services" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Nossos <span className="text-amber-500">Serviços</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-black p-6 rounded-lg border border-amber-500/20 hover:border-amber-500 transition-colors">
              <service.icon className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-400 mb-4">{service.description}</p>
              <p className="text-2xl font-bold text-amber-500 mb-4">{service.price}</p>
              <button
                onClick={scrollToBooking}
                className="w-full px-4 py-2 bg-amber-500 text-black font-semibold rounded-md hover:bg-amber-600 transition-colors"
              >
                Agendar
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;