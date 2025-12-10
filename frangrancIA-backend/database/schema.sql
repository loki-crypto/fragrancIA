-- Conectar ao banco
\c fragancia;

-- Remover tabelas existentes
DROP TABLE IF EXISTS favorito CASCADE;
DROP TABLE IF EXISTS avaliacao CASCADE;
DROP TABLE IF EXISTS perfume_nota CASCADE;
DROP TABLE IF EXISTS nota_olfativa CASCADE;
DROP TABLE IF EXISTS perfume CASCADE;
DROP TABLE IF EXISTS marca CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS quiz_resposta CASCADE;

-- 1. TABELA USUARIO
CREATE TABLE usuario (
  id_usuario        SERIAL PRIMARY KEY,
  nome              VARCHAR(150)         NOT NULL,
  email             VARCHAR(255)         NOT NULL UNIQUE,
  senha_hash        VARCHAR(255)         NOT NULL,
  data_cadastro     TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  ativo             BOOLEAN              NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_usuario_email ON usuario(email);

-- 2. TABELA MARCA
CREATE TABLE marca (
  id_marca          SERIAL PRIMARY KEY,
  nome              VARCHAR(150)         NOT NULL UNIQUE,
  pais              VARCHAR(100),
  descricao         TEXT
);

CREATE INDEX idx_marca_nome ON marca(nome);

-- 3. TABELA PERFUME
CREATE TABLE perfume (
  id_perfume        SERIAL PRIMARY KEY,
  nome              VARCHAR(200)         NOT NULL,
  descricao         TEXT,
  genero            VARCHAR(50),
  ano_lancamento    INTEGER,
  imagem_url        VARCHAR(1024),
  preco_min         DECIMAL(10,2),
  preco_max         DECIMAL(10,2),
  longevidade       VARCHAR(50),
  sillage           VARCHAR(50),
  estacao           VARCHAR(100),
  ocasiao           VARCHAR(100),
  id_marca          INTEGER              NOT NULL,
  ativo             BOOLEAN              NOT NULL DEFAULT TRUE,
  data_criacao      TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_perfume_marca FOREIGN KEY (id_marca) 
    REFERENCES marca(id_marca) ON DELETE RESTRICT
);

CREATE INDEX idx_perfume_nome ON perfume(nome);
CREATE INDEX idx_perfume_marca ON perfume(id_marca);
CREATE INDEX idx_perfume_genero ON perfume(genero);

-- 4. TABELA NOTA_OLFATIVA
CREATE TABLE nota_olfativa (
  id_nota           SERIAL PRIMARY KEY,
  nome              VARCHAR(150)         NOT NULL UNIQUE,
  tipo              VARCHAR(50)          NOT NULL
);

CREATE INDEX idx_nota_tipo ON nota_olfativa(tipo);

-- 5. TABELA PERFUME_NOTA
CREATE TABLE perfume_nota (
  id_perfume        INTEGER              NOT NULL,
  id_nota           INTEGER              NOT NULL,
  intensidade       VARCHAR(50),
  
  PRIMARY KEY (id_perfume, id_nota),
  
  CONSTRAINT fk_pn_perfume FOREIGN KEY (id_perfume) 
    REFERENCES perfume(id_perfume) ON DELETE CASCADE,
  CONSTRAINT fk_pn_nota FOREIGN KEY (id_nota) 
    REFERENCES nota_olfativa(id_nota) ON DELETE CASCADE
);

CREATE INDEX idx_pn_perfume ON perfume_nota(id_perfume);
CREATE INDEX idx_pn_nota ON perfume_nota(id_nota);

-- 6. TABELA AVALIACAO
CREATE TABLE avaliacao (
  id_avaliacao      SERIAL PRIMARY KEY,
  id_usuario        INTEGER              NOT NULL,
  id_perfume        INTEGER              NOT NULL,
  rating            SMALLINT             NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comentario        TEXT,
  data_avaliacao    TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_avaliacao_usuario FOREIGN KEY (id_usuario) 
    REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_avaliacao_perfume FOREIGN KEY (id_perfume) 
    REFERENCES perfume(id_perfume) ON DELETE CASCADE,
  CONSTRAINT uq_usuario_perfume_avaliacao UNIQUE (id_usuario, id_perfume)
);

CREATE INDEX idx_avaliacao_perfume ON avaliacao(id_perfume);
CREATE INDEX idx_avaliacao_usuario ON avaliacao(id_usuario);

-- 7. TABELA FAVORITO
CREATE TABLE favorito (
  id_usuario        INTEGER              NOT NULL,
  id_perfume        INTEGER              NOT NULL,
  data_adicionado   TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  
  PRIMARY KEY (id_usuario, id_perfume),
  
  CONSTRAINT fk_fav_usuario FOREIGN KEY (id_usuario) 
    REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_fav_perfume FOREIGN KEY (id_perfume) 
    REFERENCES perfume(id_perfume) ON DELETE CASCADE
);

CREATE INDEX idx_favorito_usuario ON favorito(id_usuario);
CREATE INDEX idx_favorito_perfume ON favorito(id_perfume);

-- 8. TABELA QUIZ_RESPOSTA
CREATE TABLE quiz_resposta (
  id_quiz           SERIAL PRIMARY KEY,
  id_usuario        INTEGER              NOT NULL,
  periodo           VARCHAR(50),
  evento            VARCHAR(100),
  familia           VARCHAR(100),
  intensidade       VARCHAR(50),
  impressao         VARCHAR(100),
  data_quiz         TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_quiz_usuario FOREIGN KEY (id_usuario) 
    REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE INDEX idx_quiz_usuario ON quiz_resposta(id_usuario);
