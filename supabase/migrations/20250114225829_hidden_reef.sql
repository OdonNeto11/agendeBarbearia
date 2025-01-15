/*
  # Correção da política RLS para perfis

  1. Alterações
    - Adiciona política para permitir inserção de perfis por usuários autenticados
    
  2. Segurança
    - Permite que usuários autenticados criem seus próprios perfis
    - Mantém a restrição de que usuários só podem criar perfis vinculados ao seu próprio ID
*/

CREATE POLICY "Usuários podem criar seus próprios perfis"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);