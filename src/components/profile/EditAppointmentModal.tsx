import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X } from 'lucide-react';
import { addDays, format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface Appointment {
  id: string;
  service: {
    name: string;
    price: number;
  };
  barber: {
    full_name: string;
  };
  appointment_date: string;
  start_time: string;
}

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onSuccess: () => void;
}

const EditAppointmentModal = ({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: EditAppointmentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    service: '',
    barber: '',
    date: '',
    time: '',
  });

  useEffect(() => {
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

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (appointment) {
      setFormData({
        service: '',
        barber: '',
        date: appointment.appointment_date,
        time: appointment.start_time,
      });
    }
  }, [appointment]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!formData.barber || !formData.date) return;

      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('start_time, end_time, appointment_date')
          .eq('barber_id', formData.barber)
          .eq('appointment_date', formData.date)
          .eq('status', 'confirmed') // Alterado para 'confirmed' para manter consistência com o Booking
          .neq('id', appointment.id);

        if (error) throw error;
        setAppointments(data || []);
        console.log('Agendamentos encontrados:', data); // Depuração
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
    };

    fetchAppointments();
  }, [formData.barber, formData.date, appointment.id]);

  // Função isTimeSlotAvailable copiada do Booking
  const isTimeSlotAvailable = (time: string): boolean => {
    if (!appointment.service) return false;

    const [hours, minutes] = time.split(':').map(Number);
    const slotStart = hours * 60 + minutes; // Horário de início em minutos
    const slotEnd = slotStart + appointment.service.duration; // Horário de término em minutos

    // Verifica se o horário conflita com os agendamentos existentes
    return !appointments.some((appointment) => {
      const [appStartHours, appStartMinutes] = appointment.start_time.split(':').map(Number);
      const [appEndHours, appEndMinutes] = appointment.end_time.split(':').map(Number);

      const appointmentStart = appStartHours * 60 + appStartMinutes; // Início do agendamento em minutos
      const appointmentEnd = appEndHours * 60 + appEndMinutes; // Término do agendamento em minutos

      // Verifica se há sobreposição de horários
      return (
        (slotStart >= appointmentStart && slotStart < appointmentEnd) || // Início do slot dentro do agendamento
        (slotEnd > appointmentStart && slotEnd <= appointmentEnd) || // Término do slot dentro do agendamento
        (slotStart <= appointmentStart && slotEnd >= appointmentEnd) // Slot cobre todo o agendamento
      );
    });
  };

  const isDateAvailable = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time) {
      setError('Por favor, selecione uma nova data e horário.');
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          appointment_date: formData.date,
          start_time: formData.time,
        })
        .eq('id', appointment.id);

      if (updateError) throw updateError;

      onSuccess();
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      setError('Erro ao atualizar agendamento. Por favor, tente novamente.');
    }
  };

  const getAllTimeSlots = () => {
    const timeSlots: string[] = [];
    
    for (let hour = 8; hour <= 19; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 19) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    
    return timeSlots;
  };

  const getAvailableDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 15; i++) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 z-[101] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-zinc-900 p-6 rounded-lg w-full max-w-2xl mx-auto shadow-xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Alterar Agendamento</h2>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Serviço</label>
                <p className="text-lg text-amber-500">{appointment.service.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Profissional</label>
                <p className="text-lg text-amber-500">{appointment.barber.full_name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nova Data *</label>
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
                            : 'bg-zinc-900 text-zinc-600 cursor-not-allowed opacity-50'
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

              {formData.date && (
  <div>
    <label className="block text-sm font-medium mb-2">Novo Horário *</label>
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {getAllTimeSlots().map((time) => {
        const isAvailable = isTimeSlotAvailable(time);
        console.log(`Horário: ${time}, Disponível: ${isAvailable}`); // Depuração

        // Renderiza o botão apenas se o horário estiver disponível
        return isAvailable ? (
          <button
            key={time}
            type="button"
            className={
              formData.time === time
                ? 'bg-amber-500 text-black font-medium' // Estilo para horário selecionado
                : 'bg-zinc-800 hover:bg-zinc-700' // Estilo para horário disponível
            }
            onClick={() => setFormData({ ...formData, time: time })}
          >
            {time}
          </button>
        ) : (
          <div
            key={time}
            className="bg-zinc-900 text-zinc-600 opacity-50 p-2 rounded-md text-center cursor-not-allowed"
          >
            {time}
          </div>
        );
      })}
    </div>
  </div>
)}

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-black font-semibold rounded-md hover:bg-amber-600 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAppointmentModal;