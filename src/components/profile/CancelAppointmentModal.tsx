import React from 'react';
import { X } from 'lucide-react';

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
  date: string;
  time: string;
}

const CancelAppointmentModal = ({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  date,
  time,
}: CancelAppointmentModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 z-[101] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-zinc-900 p-6 rounded-lg w-full max-w-md mx-auto shadow-xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Cancelar Agendamento</h2>
            
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja cancelar o agendamento de {serviceName} marcado para {date} às {time}?
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors"
              >
                Não, manter
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
              >
                Sim, cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;