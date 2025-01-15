-- Adicionar política para permitir que usuários não autenticados vejam horários ocupados
CREATE POLICY "Qualquer pessoa pode ver horários ocupados"
  ON appointments FOR SELECT
  USING (true);