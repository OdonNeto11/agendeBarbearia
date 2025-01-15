/*
  # Adicionar política para confirmação de agendamentos

  1. Alterações
    - Adiciona política que permite barbeiros confirmarem agendamentos
  
  2. Segurança
    - Permite que apenas o barbeiro designado possa confirmar seus agendamentos
    - Restringe a atualização apenas para mudar o status para 'confirmed'
*/

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