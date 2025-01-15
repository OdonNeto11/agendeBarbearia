/*
  # Adicionar políticas para visualização de barbeiros

  1. Políticas
    - Permitir que qualquer pessoa veja os barbeiros ativos
    - Permitir que qualquer pessoa veja os perfis dos barbeiros

  2. Segurança
    - Mantém RLS ativo
    - Adiciona políticas específicas para visualização
*/

-- Política para visualizar barbeiros ativos
CREATE POLICY "Qualquer pessoa pode ver barbeiros ativos"
  ON barbers FOR SELECT
  USING (is_active = true);

-- Política para visualizar perfis de barbeiros
CREATE POLICY "Qualquer pessoa pode ver perfis de barbeiros"
  ON profiles FOR SELECT
  USING (role = 'barber');