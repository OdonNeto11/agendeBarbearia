/*
  # Cadastro dos barbeiros iniciais usando funções do Supabase Auth

  1. Novos Dados
    - Criação dos usuários no auth.users
    - Criação dos perfis associados
    - Configuração dos horários de trabalho
*/

-- Função para criar usuários e seus perfis
CREATE OR REPLACE FUNCTION create_barber_with_auth(
  email TEXT,
  full_name TEXT,
  phone TEXT,
  bio TEXT,
  years_experience INTEGER,
  specialties TEXT[]
) RETURNS uuid AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Criar usuário no auth.users
  new_user_id := extensions.uuid_generate_v4();
  
  INSERT INTO auth.users (
    id,
    email,
    raw_user_meta_data,
    created_at,
    updated_at,
    instance_id
  ) VALUES (
    new_user_id,
    email,
    jsonb_build_object('full_name', full_name),
    now(),
    now(),
    '00000000-0000-0000-0000-000000000000'
  );

  -- Criar perfil
  INSERT INTO profiles (id, role, full_name, phone)
  VALUES (new_user_id, 'barber', full_name, phone);

  -- Criar registro de barbeiro
  INSERT INTO barbers (id, bio, years_of_experience, specialties, is_active)
  VALUES (new_user_id, bio, years_experience, specialties, true);

  -- Criar horários padrão
  INSERT INTO schedules (barber_id, day_of_week, start_time, end_time, is_available)
  SELECT 
    new_user_id,
    day,
    '09:00'::time,
    '18:00'::time,
    true
  FROM generate_series(1, 6) as day;

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql;

-- Criar os barbeiros
SELECT create_barber_with_auth(
  'matheus.araujo@barbearia.com',
  'Matheus Araújo',
  '11999887766',
  'Especialista em cortes modernos e design de barba, com foco em tendências atuais.',
  5,
  ARRAY['cortes modernos', 'barba']
);

SELECT create_barber_with_auth(
  'nicolas.pontes@barbearia.com',
  'Nícolas Pontes',
  '11999887755',
  'Mestre em cortes clássicos e tratamentos capilares, com vasta experiência em barbearia tradicional.',
  7,
  ARRAY['cortes clássicos', 'barba', 'tratamentos']
);

-- Limpar a função após o uso
DROP FUNCTION create_barber_with_auth;