\c fragancia;

-- MARCAS
INSERT INTO marca (nome, pais, descricao) VALUES
('Tom Ford', 'Estados Unidos', 'Marca de luxo conhecida por fragrâncias ousadas'),
('Maison Francis Kurkdjian', 'França', 'Casa de perfumaria de nicho francesa'),
('Nishane', 'Turquia', 'Primeira marca de perfumaria de nicho turca');

-- PERFUMES
INSERT INTO perfume (nome, descricao, genero, ano_lancamento, imagem_url, preco_min, preco_max, longevidade, sillage, estacao, ocasiao, id_marca) VALUES
('Tobacco Vanille', 'Um Oriental Especiado quente e opulento', 'Unissex', 2007, '/images/perfumes/tom-ford-tobacco-vanille.png', 1200.00, 1500.00, '8-12 horas', 'Forte', 'Outono/Inverno', 'Noite/Especial', 1),
('Baccarat Rouge 540', 'Um Âmbar Floral radiante e sofisticado', 'Unissex', 2014, '/images/perfumes/baccarat-rouge-540.png', 1800.00, 2200.00, '10-14 horas', 'Muito Forte', 'Todas as Estações', 'Versátil/Exclusivo', 2),
('Ani', 'Um Oriental Floral vibrante e misterioso', 'Unissex', 2019, '/images/perfumes/nishane-ani.png', 1400.00, 1700.00, '8-10 horas', 'Moderado a Forte', 'Primavera/Outono', 'Dia/Noite', 3);

-- NOTAS OLFATIVAS
INSERT INTO nota_olfativa (nome, tipo) VALUES
('Folha de Tabaco', 'Topo'),
('Especiarias', 'Topo'),
('Açafrão', 'Topo'),
('Jasmim', 'Coração'),
('Baunilha', 'Coração'),
('Cacau', 'Coração'),
('Madeira de Âmbar', 'Coração'),
('Âmbar Cinzento', 'Fundo'),
('Cedro', 'Fundo'),
('Frutas Secas', 'Fundo');

-- PERFUME_NOTA
INSERT INTO perfume_nota (id_perfume, id_nota, intensidade) VALUES
(1, 1, 'Principal'),
(1, 2, 'Secundária'),
(1, 5, 'Principal'),
(1, 6, 'Secundária'),
(1, 10, 'Principal'),
(2, 3, 'Principal'),
(2, 4, 'Principal'),
(2, 7, 'Principal'),
(2, 8, 'Principal'),
(2, 9, 'Secundária');

-- USUÁRIO DE TESTE (senha: teste123)
INSERT INTO usuario (nome, email, senha_hash) VALUES
('Usuário Teste', 'teste@fragancia.com', '$2a$10$XqjE5A.vR7g3h6zLVdJ3.ukrQKt5bHqWrJ3x4yF0vNnD8pZ8kQY5u');
