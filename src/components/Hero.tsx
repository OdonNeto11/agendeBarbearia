import React from 'react';

const Hero = () => {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      const headerOffset = 96; // Altura do header fixo + margem extra
      const elementPosition = bookingSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>
      
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Agende seu corte com
          <span className="text-amber-500"> estilo e precisão</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          Transforme seu visual com os melhores profissionais
        </p>
        <button 
          onClick={scrollToBooking}
          className="px-8 py-4 bg-amber-500 text-black text-lg font-semibold rounded-md hover:bg-amber-600 transition-colors"
        >
          Agendar Agora
        </button>
      </div>
    </section>
  );
}

export default Hero;