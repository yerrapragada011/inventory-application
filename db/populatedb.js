require('dotenv').config()

const { Client } = require('pg')

const SQL = `
CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS developers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    fullname VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS game_genres (
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, genre_id)
);

CREATE TABLE IF NOT EXISTS game_developers (
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    developer_id INTEGER REFERENCES developers(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, developer_id)
);

-- Sample data
INSERT INTO genres (name)
VALUES
    ('Action'),
    ('Action-Adventure'),
    ('Adventure'),
    ('Puzzle'),
    ('Role-playing'),
    ('Simulation'),
    ('Strategy'),
    ('Sports');

INSERT INTO developers (fullname)
VALUES
    ('Nintendo'),
    ('Ubisoft'),
    ('Electronic Arts'),
    ('2K'),
    ('Microsoft'),
    ('Sony Interactive Entertainment');

INSERT INTO games (title)
VALUES
    ('Super Mario Bros'),
    ('Assassin''s Creed'),
    ('The Sims'),
    ('NBA 2K'),
    ('Halo'),
    ('Uncharted'),
    ('Zelda: Breath of the Wild'),
    ('FIFA'),
    ('Minecraft'),
    ('Tetris');

-- Add genres and developers to games
INSERT INTO game_genres (game_id, genre_id)
SELECT g.id, ge.id
FROM games g
JOIN genres ge ON ge.name IN ('Action', 'Action-Adventure', 'Simulation', 'Sports')
WHERE g.title IN ('Super Mario Bros', 'Assassin''s Creed', 'The Sims', 'NBA 2K', 'Halo', 'Uncharted', 'Zelda: Breath of the Wild', 'FIFA', 'Minecraft', 'Tetris');

INSERT INTO game_developers (game_id, developer_id)
SELECT g.id, d.id
FROM games g
JOIN developers d ON d.fullname IN ('Nintendo', 'Ubisoft', 'Electronic Arts', '2K', 'Microsoft', 'Sony Interactive Entertainment')
WHERE g.title IN ('Super Mario Bros', 'Assassin''s Creed', 'The Sims', 'NBA 2K', 'Halo', 'Uncharted', 'Zelda: Breath of the Wild', 'FIFA', 'Minecraft', 'Tetris');
`

async function main() {
  console.log('seeding...')
  const client = new Client({
    connectionString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
  })
  await client.connect()
  await client.query(SQL)
  await client.end()
  console.log('done')
}

main()
