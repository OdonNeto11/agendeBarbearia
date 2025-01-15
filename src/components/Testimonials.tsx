import React from 'react';
import { MessageSquare } from 'lucide-react';

const testimonials = [
  {
    name: 'Carlos Silva',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    text: 'Excelente atendimento! O corte ficou exatamente como eu queria. Recomendo muito!',
  },
  {
    name: 'Ricardo Santos',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    text: 'Profissionais muito atenciosos e ambiente super agradável. Melhor barbearia da cidade!',
  },
  {
    name: 'André Oliveira',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    text: 'Serviço impecável! O cuidado com os detalhes faz toda a diferença.',
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          O que Nossos <span className="text-amber-500">Clientes Dizem</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-black p-6 rounded-lg border border-amber-500/20">
              <MessageSquare className="w-8 h-8 text-amber-500 mb-4" />
              <p className="text-gray-300 mb-6">{testimonial.text}</p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <span className="font-medium">{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;