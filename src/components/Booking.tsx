import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AuthModal from './auth/AuthModal';
import ConfirmationModal from './ConfirmationModal';
import SuccessModal from './SuccessModal';

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
}

interface Barber {
  id: string;
  full_name: string;
}

interface BookingProps {
  onBookingSuccess?: () => void;
}

const Booking = ({ onBookingSuccess }: BookingProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    service: '',
    barber: '',
    date: '',
    time: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.barber && formData.date) {
      fetchAppointments();
    }
  }, [formData.barber, formData.date]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*');

      if (servicesError) throw servicesError;
      setServices(servicesData || []);

      const { data: barbersData, error: barbersError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          barbers!inner (
            id,
            is_active
          )
        `)
        .eq('role', 'barber')
        .eq('barbers.is_active', true);

      if (barbersError) throw barbersError;
      setBarbers(barbersData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('barber_id', formData.barber)
        .eq('appointment_date', formData.date)
        .eq('status', 'confirmed');

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

  
  const isTimeSlotAvailable = (time: string): boolean => { // Verifica se um horário específico está disponível para agendamento.
    if (!selectedService) return false;

    const [hours, minutes] = time.split(':').map(Number);
    const slotStart = hours * 60 + minutes;
    const slotEnd = slotStart + selectedService.duration;

    return !appointments.some(appointment => {
      const [appStartHours, appStartMinutes] = appointment.start_time.split(':').map(Number);
      const [appEndHours, appEndMinutes] = appointment.end_time.split(':').map(Number);
      
      const appointmentStart = appStartHours * 60 + appStartMinutes;
      const appointmentEnd = appEndHours * 60 + appEndMinutes;

      return (
        (slotStart >= appointmentStart && slotStart < appointmentEnd) ||
        (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
        (slotStart <= appointmentStart && slotEnd >= appointmentEnd)
      );
    });
  };


  // Gera os horários disponíveis para agendamento com base no horário de funcionamento da barbearia.
  const getTimeSlots = () => {
    if (!selectedService || !formData.date) return []; // Verifica se há uma data selecionada
  
    const timeSlots: string[] = [];
  
    // Extrai o ano, mês e dia da string formData.date (formato yyyy-MM-dd)
    const [year, month, day] = formData.date.split('-').map(Number);
  
    // Cria a data no horário local
    const selectedDate = new Date(year, month - 1, day); // month - 1 porque os meses são indexados a partir de 0
  
    // Verifica se a data é válida
    if (isNaN(selectedDate.getTime())) {
      console.error("Data inválida:", formData.date);
      return [];
    }
  
    const isSaturday = selectedDate.getDay() === 6; // Verifica se é sábado usando o horário local
  
    console.log("Data selecionada:", selectedDate.toLocaleDateString()); // Exibe a data selecionada no formato local
    console.log("É sábado?", isSaturday); // Exibe se é sábado
  
    // Define o horário de término com base no dia da semana
    const endHour = isSaturday ? 16 : 22; // Sábado até 16h, outros dias até 22h
    console.log("Horário de término:", endHour); // Exibe o horário de término
  
    // Gera os horários disponíveis
    for (let hour = 8; hour <= endHour; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`); // Horário cheio (ex: 08:00)
      if (hour < endHour - 1) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:30`); // Meia hora (ex: 08:30)
      }
    }
  
    console.log("Horários disponíveis:", timeSlots); // Exibe os horários gerados
    return timeSlots;
  };


  
  const isDateAvailable = (date: Date): boolean => { // Verifica se uma data está disponível para agendamento.
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 6;
  };

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    setSelectedService(service || null);
    setFormData({ ...formData, service: serviceId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!formData.service || !formData.barber || !formData.date || !formData.time) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setShowConfirmationModal(true);
  };

  const handleConfirmBooking = async () => {
    try {
      const service = services.find(s => s.id === formData.service);
      if (!service) throw new Error('Serviço não encontrado');

      const [hours, minutes] = formData.time.split(':').map(Number);
      const endTimeMinutes = hours * 60 + minutes + service.duration;
      const endTime = `${Math.floor(endTimeMinutes / 60).toString().padStart(2, '0')}:${(endTimeMinutes % 60).toString().padStart(2, '0')}`;

      const { error: bookingError } = await supabase
        .from('appointments')
        .insert([
          {
            client_id: user?.id,
            barber_id: formData.barber,
            service_id: formData.service,
            appointment_date: formData.date,
            start_time: formData.time,
            end_time: endTime,
            status: 'confirmed'
          }
        ]);

      if (bookingError) throw bookingError;

      setShowConfirmationModal(false);
      setShowSuccessModal(true);
      setFormData({
        service: '',
        barber: '',
        date: '',
        time: '',
      });
      setSelectedService(null);
      
      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      setError('Erro ao criar agendamento. Por favor, tente novamente.');
    }
  };

  const getAvailableDates = () => { // Retorna as datas disponíveis para agendamento (próximos 15 dias, excluindo domingos).
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      if (isDateAvailable(date)) {
        dates.push(date);
      }
    }
    
    return dates;
  };

  const formatDateButton = (date: Date) => {
    const dayOfWeek = format(date, 'EEEE', { locale: ptBR });
    return {
      dayMonth: format(date, 'dd/MM'),
      dayName: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
      fullDate: format(date, 'yyyy-MM-dd')
    };
  };

  const timeSlots = getTimeSlots();

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <section id="booking" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Faça seu <span className="text-amber-500">Agendamento</span>
        </h2>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Serviço *</label>
            <select
              value={formData.service}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="w-full bg-zinc-900 rounded-md px-4 py-2 focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Selecione um serviço</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - R$ {service.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {selectedService && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Profissional *</label>
                <select
                  value={formData.barber}
                  onChange={(e) => setFormData({ ...formData, barber: e.target.value })}
                  className="w-full bg-zinc-900 rounded-md px-4 py-2 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Selecione um profissional</option>
                  {barbers.map((barber) => (
                    <option key={barber.id} value={barber.id}>
                      {barber.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.barber && (
                <div>
                  <label className="block text-sm font-medium mb-2">Data *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {getAvailableDates().map((date) => {
                      const { dayMonth, dayName, fullDate } = formatDateButton(date);
                      const isAvailable = isDateAvailable(date);
                      return (
                        <button
                          key={fullDate}
                          type="button"
                          disabled={!isAvailable}
                          className={`p-3 rounded-md text-center transition-colors ${
                            formData.date === fullDate
                              ? 'bg-amber-500 text-black font-medium'
                              : isAvailable
                              ? 'bg-zinc-800 hover:bg-zinc-700'
                              : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                          }`}
                          onClick={() => isAvailable && setFormData({ ...formData, date: fullDate })}
                        >
                          <div className="font-medium">{dayMonth}</div>
                          <div className="text-sm opacity-75">{dayName}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

{formData.date && (
  <div>
    <label className="block text-sm font-medium mb-2">Horário *</label>
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
    {timeSlots.map((time) => {
  const isAvailable = isTimeSlotAvailable(time);
  console.log(`Horário: ${time}, Disponível: ${isAvailable}, Classes: ${formData.time === time
    ? 'bg-amber-500 text-black font-medium'
    : isAvailable
    ? 'bg-zinc-800 hover:bg-zinc-700'
    : 'bg-zinc-900 text-zinc-600 cursor-not-allowed opacity-50'
  }`); // Log das classes CSS
  return (
    <button
      key={time}
      type="button"
      disabled={!isAvailable}
      className={`p-2 rounded-md text-center transition-colors ${
        formData.time === time
          ? 'bg-amber-500 text-black font-medium'
          : isAvailable
          ? 'bg-zinc-800 hover:bg-zinc-700'
          : 'bg-zinc-900 text-zinc-600 cursor-not-allowed opacity-50'
      }`}
      onClick={() => isAvailable && setFormData({ ...formData, time })}
    >
      {time}
    </button>
  );
})}
    </div>
    {timeSlots.length === 0 && (
      <p className="text-red-500 mt-2">
        Não há horários disponíveis para esta data.
      </p>
    )}
  </div>
)}

              <button
                type="submit"
                className="w-full bg-amber-500 text-black font-semibold py-3 rounded-md hover:bg-amber-600 transition-colors mt-8"
              >
                {user ? 'Confirmar Agendamento' : 'Fazer Login para Agendar'}
              </button>
            </>
          )}
        </form>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
        />

        <ConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={handleConfirmBooking}
          barberName={barbers.find(b => b.id === formData.barber)?.full_name || ''}
          serviceName={services.find(s => s.id === formData.service)?.name || ''}
          date={formData.date}
          time={formData.time}
          price={selectedService?.price || 0}
        />

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
      </div>
    </section>
  );
};

export default Booking;