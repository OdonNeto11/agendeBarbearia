/*
  # Atualizar status dos agendamentos

  1. Alterações
    - Atualiza todos os agendamentos com status 'pending' para 'confirmed'
*/

UPDATE appointments 
SET status = 'confirmed' 
WHERE status = 'pending';