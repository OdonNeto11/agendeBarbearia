/*
  # Fix appointment cancellation policy

  1. Changes
    - Drop existing cancellation policy
    - Create new policy that allows clients to cancel their own appointments
    - Policy checks client_id matches auth.uid()
    - Allows status update to 'cancelled'
*/

-- Remove existing cancellation policy
DROP POLICY IF EXISTS "Clientes podem cancelar seus próprios agendamentos" ON appointments;

-- Create new cancellation policy
CREATE POLICY "Clientes podem cancelar seus próprios agendamentos"
  ON appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);