/*
  # Ajuste de políticas para serviços e barbeiros

  1. Alterações
    - Atualiza a política de serviços para permitir acesso anônimo
    - Atualiza a política de barbeiros para permitir acesso anônimo

  2. Segurança
    - Mantém apenas permissão de leitura para usuários não autenticados
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