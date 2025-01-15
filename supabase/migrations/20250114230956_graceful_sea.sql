/*
  # Inserir serviços básicos

  1. Novos Dados
    - Serviço de Corte de Cabelo (duração: 30 min)
    - Serviço de Barba (duração: 30 min)
    - Serviço de Barba e Cabelo (duração: 60 min)

  2. Preços
    - Cabelo: R$ 60,00
    - Barba: R$ 40,00
    - Barba e Cabelo: R$ 90,00
*/

INSERT INTO services (name, description, duration, price)
VALUES
  ('Corte de Cabelo', 'Corte masculino profissional com acabamento perfeito', 30, 60.00),
  ('Barba', 'Modelagem e acabamento profissional da barba', 30, 40.00),
  ('Barba e Cabelo', 'Pacote completo de corte masculino e barba', 60, 90.00);