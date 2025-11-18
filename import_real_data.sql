-- Importar datos reales del proyecto de producción al RAG local
-- Limpiar datos existentes
TRUNCATE TABLE teams CASCADE;

-- Insertar equipos reales
INSERT INTO teams (id, name, country_code, confederation, created_at, updated_at) VALUES
('72696493-41cc-4dc4-b750-894442f55237', 'México', 'MEX', 'CONCACAF', '2025-10-18T22:33:09.253914+00:00', '2025-10-19T07:35:38.889676+00:00'),
('6df0cafa-4fab-4817-8f9c-83305f65ac65', 'Estados Unidos', 'USA', 'CONCACAF', '2025-10-18T22:33:09.253914+00:00', '2025-10-19T07:35:38.889676+00:00'),
('612f00dc-bba1-44dc-bd05-92840b6566e5', 'Canadá', 'CAN', 'CONCACAF', '2025-10-18T22:33:09.253914+00:00', '2025-10-19T07:35:38.889676+00:00'),
('bf667a59-a185-4dea-998e-4853f2a7d379', 'Argentina', 'ARG', 'CONMEBOL', '2025-10-18T22:33:09.253914+00:00', '2025-10-19T07:35:38.889676+00:00'),
('4b65348c-d68e-4069-ba4d-7c2c40410af5', 'Brasil', 'BRA', 'CONMEBOL', '2025-10-18T22:33:09.253914+00:00', '2025-10-19T07:35:38.889676+00:00'),
('0767adc5-5171-4d7f-bbb0-90f7038ac09a', 'Alemania', 'GER', 'UEFA', '2025-10-18T22:33:09.253914+00:00', '2025-10-19T07:35:38.889676+00:00'),
('c0b7779c-85e7-4e91-a95a-b35d61559c7f', 'España', 'ESP', 'UEFA', '2025-10-18T22:33:09.253914+00:00', '2025-10-19T07:35:38.889676+00:00'),
('7a2261dc-9797-4246-bfc0-d0aa4ab4e8d5', 'Francia', 'FRA', 'UEFA', '2025-10-18T22:33:09.253914+00:00', '2025-10-19T07:35:38.889676+00:00'),
('9e76078e-69c6-4090-9179-e481a6418400', 'Inglaterra', 'ENG', 'UEFA', '2025-10-18T22:33:09.253914+00:00', '2025-10-19T07:35:38.889676+00:00'),
('bc1d8cf4-571c-4f07-a45b-20fa536dd8e9', 'Colombia', 'COL', 'CONMEBOL', '2025-10-19T07:35:38.889676+00:00', '2025-10-19T07:35:38.889676+00:00');

-- Verificar importación
SELECT name, country_code, confederation FROM teams ORDER BY name;
