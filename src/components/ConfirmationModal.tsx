import React from 'react';
import { X, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  barberName: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  barberName,
  serviceName,
  date,
  time,
  price,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const formattedDate = format(new Date(date), 'dd/MM/yyyy');

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

            <h2 className="text-2xl font-bold mb-6">Confirmar Agendamento</h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-sm text-gray-400">Profissional</p>
                  <p className="font-medium">{barberName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-sm text-gray-400">Data</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-sm text-gray-400">Horário</p>
                  <p className="font-medium">{time}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400">Serviço</span>
                  <span className="font-medium">{serviceName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Valor</span>
                  <span className="text-xl font-bold text-amber-500">
                    R$ {price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={onConfirm}
                className="w-full bg-amber-500 text-black font-semibold py-3 rounded-md hover:bg-amber-600 transition-colors"
              >
                Confirmar Agendamento
              </button>
              <button
                onClick={onClose}
                className="w-full bg-zinc-800 text-white font-semibold py-3 rounded-md hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;