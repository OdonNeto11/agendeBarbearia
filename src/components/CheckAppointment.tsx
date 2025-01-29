/*import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format, addDays } from 'date-fns';

const CheckAppointment = () => {
  const [hasAppointment, setHasAppointment] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTomorrowAppointment = async () => {
      try {
        const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
        
        // Primeiro, buscar o ID do Nícolas
        const { data: barberData, error: barberError } = await supabase
          .from('profiles')
          .select('id')
          .eq('full_name', 'Nícolas Pontes')
          .single();

        if (barberError) throw barberError;
        if (!barberData) {
          console.log('Barbeiro não encontrado');
          return;
        }

        // Agora verificar se há agendamento
        const { data: appointmentData, error: appointmentError } = await supabase
          .from('appointments')
          .select('*')
          .eq('barber_id', barberData.id)
          .eq('appointment_date', tomorrow)
          .eq('start_time', '09:00')
          .eq('status', 'pending');

        if (appointmentError) throw appointmentError;
        
        setHasAppointment(appointmentData && appointmentData.length > 0);
      } catch (error) {
        console.error('Erro ao verificar agendamento:', error);
      } finally {
        setLoading(false);
      }
    };

    checkTomorrowAppointment();
  }, []);

  if (loading) {
    return <div>Verificando agendamento...</div>;
  }

  return (
    <div>
      {hasAppointment 
        ? "Sim, há um horário agendado com Nícolas Pontes amanhã às 09:00."
        : "Não, o horário das 09:00 de amanhã com Nícolas Pontes está disponível."}
    </div>
  );
};

export default CheckAppointment;
*/