/*
  # Reverter políticas de acesso aos serviços e barbeiros

  1. Alterações
    - Remove as políticas de acesso anônimo
    - Restaura as políticas originais que requerem autenticação

  2. Segurança
    - Restringe acesso apenas a usuários autenticados
*/

-- Reverter política de serviços para requerer autenticação
DROP POLICY IF EXISTS "Qualquer pessoa pode ver serviços" ON services;
CREATE POLICY "Qualquer pessoa pode ver serviços"
  ON services FOR SELECT
  TO authenticated
  USING (true);

-- Reverter política de barbeiros para requerer autenticação
DROP POLICY IF EXISTS "Qualquer pessoa pode ver barbeiros ativos" ON barbers;
CREATE POLICY "Qualquer pessoa pode ver barbeiros ativos"
  ON barbers FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Qualquer pessoa pode ver perfis de barbeiros" ON profiles;
CREATE POLICY "Qualquer pessoa pode ver perfis de barbeiros"
  ON profiles FOR SELECT
  TO authenticated
  USING (role = 'barber');