import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit2, X } from 'lucide-react';
import EditAppointmentModal from './EditAppointmentModal';
import CancelAppointmentModal from './CancelAppointmentModal';

interface Appointment {
  id: string;
  services: {
    name: string;
    price: number;
  };
  barber: {
    profiles: {
      full_name: string;
    };
  };
  appointment_date: string;
  start_time: string;
}

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          start_time,
          services!inner (
            name,
            price
          ),
          barber:barbers!inner (
            profiles (
              full_name
            )
          )
        `)
        .eq('client_id', user.id)
        .in('status', ['pending', 'confirmed'])
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;
      setShowCancelModal(false);
      setSelectedAppointment(null);
      await fetchAppointments();
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando agendamentos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Meus Agendamentos</h1>

        {appointments.length === 0 ? (
          <div className="text-center text-gray-400">
            Você não possui agendamentos ativos.
          </div>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-zinc-900 p-6 rounded-lg border border-zinc-800"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {appointment.services.name}
                    </h3>
                    <p className="text-gray-400 mb-1">
                      Com: {appointment.barber.profiles.full_name}
                    </p>
                    <p className="text-gray-400 mb-1">
                      Data: {formatDate(appointment.appointment_date)}
                    </p>
                    <p className="text-gray-400 mb-4">
                      Horário: {appointment.start_time}
                    </p>
                    <p className="text-xl font-bold text-amber-500">
                      R$ {appointment.services.price.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-amber-500 hover:bg-zinc-800 rounded-md"
                      title="Editar agendamento"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowCancelModal(true);
                      }}
                      className="p-2 text-red-500 hover:bg-zinc-800 rounded-md"
                      title="Cancelar agendamento"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedAppointment && (
          <>
            <EditAppointmentModal
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setSelectedAppointment(null);
              }}
              appointment={{
                id: selectedAppointment.id,
                service: {
                  name: selectedAppointment.services.name,
                  price: selectedAppointment.services.price
                },
                barber: {
                  full_name: selectedAppointment.barber.profiles.full_name
                },
                appointment_date: selectedAppointment.appointment_date,
                start_time: selectedAppointment.start_time
              }}
              onSuccess={() => {
                setShowEditModal(false);
                setSelectedAppointment(null);
                fetchAppointments();
              }}
            />

            <CancelAppointmentModal
              isOpen={showCancelModal}
              onClose={() => {
                setShowCancelModal(false);
                setSelectedAppointment(null);
              }}
              onConfirm={() => handleCancelAppointment(selectedAppointment.id)}
              serviceName={selectedAppointment.services.name}
              date={formatDate(selectedAppointment.appointment_date)}
              time={selectedAppointment.start_time}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;