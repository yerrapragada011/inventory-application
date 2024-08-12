const pool = require('./pool')

async function getAllGames() {
  const { rows } = await pool.query('SELECT * FROM games')
  return rows
}

async function addGame(title, genres, developers) {
  await pool.query(
    'INSERT INTO games (title, genres, developers) VALUES ($1, $2, $3)',
    [title, genres, developers]
  )
}

async function addGenre(name) {
  await pool.query('INSERT INTO genres (name) VALUES ($1)', [name])
}

async function addDeveloper(fullname) {
  await pool.query('INSERT INTO developers (fullname) VALUES $(1)', [fullname])
}

async function getGameDetail(id) {
  const { rows } = await pool.query('SELECT * FROM games WHERE id = $1', [id])
  return rows[0]
}

async function updateGame(id, title, genre, developer) {
  await pool.query(
    'UPDATE games SET title = $1, genre = $2, developer = $3 WHERE id = $4',
    [title, genre, developer, id]
  )
}

async function updateGenre(id, name) {
  await pool.query('UPDATE genres SET name = $1 WHERE id = $2', [name, id])
}

async function updateDeveloper(id, fullname) {
  await pool.query('UPDATE developers SET fullname = $1 WHERE id = $2', [
    fullname,
    id
  ])
}

async function deleteGame(id) {
  await pool.query('DELETE FROM games WHERE id = $1', [id])
}

async function deleteGenre(id) {
  await pool.query('DELETE FROM genres WHERE id = $1', [id])
}

async function deleteDeveloper(id) {
  await pool.query('DELETE FROM developers WHERE id = $1', [id])
}

module.exports = {
  getAllGames,
  addGame,
  addGenre,
  addDeveloper,
  getGameDetail,
  updateGame,
  updateGenre,
  updateDeveloper,
  deleteGame,
  deleteGenre,
  deleteDeveloper
}
