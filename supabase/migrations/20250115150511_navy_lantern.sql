/*
  # Restaurar acesso anônimo aos serviços e barbeiros

  1. Alterações
    - Remove as políticas que requerem autenticação
    - Restaura as políticas de acesso anônimo

  2. Segurança
    - Permite acesso anônimo para visualização de serviços e barbeiros
*/

-- Atualizar política de serviços para permitir acesso anônimo
DROP POLICY IF EXISTS "Qualquer pessoa pode ver serviços" ON services;
CREATE POLICY "Qualquer pessoa pode ver serviços"
  ON services FOR SELECT
  USING (true);

-- Atualizar política de barbeiros para permitir acesso anônimo
DROP POLICY IF EXISTS "Qualquer pessoa pode ver barbeiros ativos" ON barbers;
CREATE POLICY "Qualquer pessoa pode ver barbeiros ativos"
  ON barbers FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Qualquer pessoa pode ver perfis de barbeiros" ON profiles;
CREATE POLICY "Qualquer pessoa pode ver perfis de barbeiros"
  ON profiles FOR SELECT
  USING (role = 'barber');