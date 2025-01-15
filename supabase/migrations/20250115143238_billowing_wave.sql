/*
  # Configurar confirmação automática de agendamentos

  1. Alterações
    - Modifica o valor padrão do status de agendamentos para 'confirmed'
    - Remove políticas de confirmação desnecessárias
  
  2. Segurança
    - Mantém as políticas de cancelamento existentes
*/

-- Alterar o valor padrão do status para 'confirmed'
ALTER TABLE appointments 
ALTER COLUMN status SET DEFAULT 'confirmed';

-- Remover a política de confirmação que não será mais necessária
DROP POLICY IF EXISTS "Barbeiros podem confirmar seus agendamentos" ON appointments;