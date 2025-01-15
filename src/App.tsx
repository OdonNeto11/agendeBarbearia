import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Booking from './components/Booking';
import Gallery from './components/Gallery';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import MyAppointments from './components/profile/MyAppointments';
import Profile from './components/profile/Profile';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'appointments' | 'profile'>('home');

  const handleBookingSuccess = () => {
    setCurrentPage('appointments');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'appointments':
        return <MyAppointments />;
      case 'profile':
        return <Profile />;
      default:
        return (
          <main>
            <Hero />
            <Services />
            <section id="booking" className="scroll-mt-24">
              <Booking onBookingSuccess={handleBookingSuccess} />
            </section>
            <Gallery />
            <About />
            <Testimonials />
          </main>
        );
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black text-white">
        <Header onPageChange={setCurrentPage} />
        {renderContent()}
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;