/*
  # Confirmação automática de agendamentos

  1. Alterações
    - Cria uma trigger function para atualizar o status para 'confirmed'
    - Adiciona a trigger na tabela appointments
    - Remove a política de confirmação dos barbeiros que não será mais necessária

  2. Segurança
    - Remove a política de confirmação dos barbeiros pois não será mais necessária
*/

-- Criar a função que será chamada pela trigger
CREATE OR REPLACE FUNCTION auto_confirm_appointment()
RETURNS TRIGGER AS $$
BEGIN
  NEW.status = 'confirmed';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar a trigger que será executada antes de inserir um novo agendamento
CREATE TRIGGER confirm_appointment_on_insert
  BEFORE INSERT ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_appointment();

-- Remover a política de confirmação que não será mais necessária
DROP POLICY IF EXISTS "Barbeiros podem confirmar seus agendamentos" ON appointments;