/*
  # Reverter configuração de status dos agendamentos

  1. Alterações
    - Altera o valor padrão do status para 'pending'
    - Atualiza todos os agendamentos confirmados para 'pending'
    - Recria a política de confirmação para barbeiros
*/

-- Alterar o valor padrão do status para 'pending'
ALTER TABLE appointments 
ALTER COLUMN status SET DEFAULT 'pending';

-- Atualizar todos os agendamentos confirmados para pending
UPDATE appointments 
SET status = 'pending' 
WHERE status = 'confirmed';

-- Recriar a política de confirmação para barbeiros
CREATE POLICY "Barbeiros podem confirmar seus agendamentos"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = barber_id 
    AND status = 'pending'
  )
  WITH CHECK (
    auth.uid() = barber_id 
    AND status = 'confirmed'
  );