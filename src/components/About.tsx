import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Conheça Nossa <span className="text-amber-500">História</span>
            </h2>
            <p className="text-gray-300 mb-6">
              Desde 2010, a Barbearia Elegance tem sido sinônimo de excelência em cortes de cabelo e cuidados com a barba. Nossa missão é proporcionar uma experiência única de cuidado pessoal, combinando técnicas tradicionais com tendências modernas.
            </p>
            <p className="text-gray-300 mb-6">
              Nossa equipe é formada por profissionais altamente qualificados e apaixonados pela arte da barbearia. Cada corte é tratado como uma obra de arte única, respeitando as características e desejos individuais de cada cliente.
            </p>
            <p className="text-gray-300">
              Mais do que uma barbearia, somos um espaço de transformação e bem-estar, onde cada cliente é recebido com atenção personalizada e sai com a autoestima renovada.
            </p>
          </div>
          
          <div className="relative aspect-video lg:aspect-square rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1532710093739-9470acff878f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Barbearia Interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;