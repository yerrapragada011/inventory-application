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
    title VARCHAR(255),
    genre VARCHAR(255) REFERENCES genres(name),
    developer VARCHAR(255) REFERENCES developers(fullname)
);

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
    ('Nintendo'),
    ('Ubisoft'),
    ('Electronic Arts'),
    ('2K'),
    ('Microsoft'),
    ('Sony Interactive Entertainment');

INSERT INTO games (title, genre, developer)
    ('Super Mario Bros', 'Action', 'Nintendo'),
    ('Assassin''s Creed', 'Action-Adventure', 'Ubisoft'),
    ('The Sims', 'Simulation', 'Electronic Arts'),
    ('NBA 2K', 'Sports', '2K'),
    ('Halo', 'Action', 'Microsoft'),
    ('Uncharted', 'Action-Adventure', 'Sony Interactive Entertainment'),
    ('Zelda: Breath of the Wild', 'Action-Adventure', 'Nintendo'),
    ('FIFA', 'Sports', 'Electronic Arts'),
    ('Minecraft', 'Simulation', 'Microsoft'),
    ('Tetris', 'Puzzle', 'Nintendo');
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
