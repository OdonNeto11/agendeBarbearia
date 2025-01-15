/*
  # Atualizar status do agendamento específico e configuração padrão

  1. Alterações
    - Atualiza o status do agendamento específico para 'confirmed'
    - Atualiza todos os agendamentos pendentes para 'confirmed'
*/

-- Atualizar o agendamento específico
UPDATE appointments 
SET status = 'confirmed' 
WHERE id = '39c742c0-723e-47f8-8b97-acb8d57f6f3d';

-- Atualizar todos os agendamentos pendentes para confirmed
UPDATE appointments 
SET status = 'confirmed' 
WHERE status = 'pending';