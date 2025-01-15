/*
  # Adicionar política para cancelamento de agendamentos

  1. Alterações
    - Adiciona política que permite clientes cancelarem seus próprios agendamentos
  
  2. Segurança
    - Permite que apenas o cliente dono do agendamento possa cancelá-lo
    - Restringe a atualização apenas para mudar o status para 'cancelled'
*/

CREATE POLICY "Clientes podem cancelar seus próprios agendamentos"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = client_id 
    AND status = 'pending'
  )
  WITH CHECK (
    auth.uid() = client_id 
    AND status = 'cancelled'
  );