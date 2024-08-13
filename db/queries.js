const pool = require('./pool')

// Retrieve all games with associated genres and developers
async function getAllGames() {
  const { rows } = await pool.query(`
    SELECT g.id, g.title, array_agg(DISTINCT ge.name) AS genres, array_agg(DISTINCT d.fullname) AS developers
    FROM games g
    LEFT JOIN game_genres gg ON g.id = gg.game_id
    LEFT JOIN genres ge ON gg.genre_id = ge.id
    LEFT JOIN game_developers gd ON g.id = gd.game_id
    LEFT JOIN developers d ON gd.developer_id = d.id
    GROUP BY g.id
  `)
  return rows
}

// Retrieve all genres
async function getAllGenres() {
  const { rows } = await pool.query('SELECT * FROM genres')
  return rows
}

// Retrieve all developers
async function getAllDevelopers() {
  const { rows } = await pool.query('SELECT * FROM developers')
  return rows
}

// Add a new game
async function addGame(title, genres = [], developers = []) {
  // Ensure genres and developers are arrays
  if (!Array.isArray(genres)) {
    genres = [genres]
  }
  if (!Array.isArray(developers)) {
    developers = [developers]
  }

  // Insert the game
  const { rows } = await pool.query(
    'INSERT INTO games (title) VALUES ($1) RETURNING id',
    [title]
  )
  const gameId = rows[0].id

  // Add genres
  for (let genre of genres) {
    const { rows: genreRows } = await pool.query(
      'SELECT id FROM genres WHERE name = $1',
      [genre]
    )
    if (genreRows.length > 0) {
      const genreId = genreRows[0].id
      await pool.query(
        'INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)',
        [gameId, genreId]
      )
    } else {
      console.log(`Genre not found: ${genre}`)
    }
  }

  // Add developers
  for (let developer of developers) {
    const { rows: developerRows } = await pool.query(
      'SELECT id FROM developers WHERE fullname = $1',
      [developer]
    )
    if (developerRows.length > 0) {
      const developerId = developerRows[0].id
      await pool.query(
        'INSERT INTO game_developers (game_id, developer_id) VALUES ($1, $2)',
        [gameId, developerId]
      )
    } else {
      console.log(`Developer not found: ${developer}`)
    }
  }
}

// Add a new genre
async function addGenre(name) {
  await pool.query('INSERT INTO genres (name) VALUES ($1)', [name])
}

// Add a new developer
async function addDeveloper(fullname) {
  await pool.query('INSERT INTO developers (fullname) VALUES ($1)', [fullname])
}

// Retrieve game details with associated genres and developers
async function getGameDetail(id) {
  const { rows } = await pool.query(
    `
    SELECT g.id, g.title, array_agg(DISTINCT ge.name) AS genres, array_agg(DISTINCT d.fullname) AS developers
    FROM games g
    LEFT JOIN game_genres gg ON g.id = gg.game_id
    LEFT JOIN genres ge ON gg.genre_id = ge.id
    LEFT JOIN game_developers gd ON g.id = gd.game_id
    LEFT JOIN developers d ON gd.developer_id = d.id
    WHERE g.id = $1
    GROUP BY g.id
  `,
    [id]
  )
  return rows[0]
}

// Update a game
async function updateGame(id, title, genres, developers) {
  await pool.query('UPDATE games SET title = $1 WHERE id = $2', [title, id])

  // Remove old associations
  await pool.query('DELETE FROM game_genres WHERE game_id = $1', [id])
  await pool.query('DELETE FROM game_developers WHERE game_id = $1', [id])

  // Add new associations
  for (let genre of genres) {
    const { rows: genreRows } = await pool.query(
      'SELECT id FROM genres WHERE name = $1',
      [genre]
    )
    if (genreRows.length > 0) {
      const genreId = genreRows[0].id
      await pool.query(
        'INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)',
        [id, genreId]
      )
    }
  }

  for (let developer of developers) {
    const { rows: developerRows } = await pool.query(
      'SELECT id FROM developers WHERE fullname = $1',
      [developer]
    )
    if (developerRows.length > 0) {
      const developerId = developerRows[0].id
      await pool.query(
        'INSERT INTO game_developers (game_id, developer_id) VALUES ($1, $2)',
        [id, developerId]
      )
    }
  }
}

// Check if any games are associated with the genre
async function checkGenreAssociations(genreId) {
  const { rows } = await pool.query(
    'SELECT COUNT(*) FROM game_genres WHERE genre_id = $1',
    [genreId]
  )
  return rows[0].count > 0
}

// Check if any games are associated with the developer
async function checkDeveloperAssociations(developerId) {
  const { rows } = await pool.query(
    'SELECT COUNT(*) FROM game_developers WHERE developer_id = $1',
    [developerId]
  )
  return rows[0].count > 0
}

// Delete a game
async function deleteGame(id) {
  await pool.query('DELETE FROM game_genres WHERE game_id = $1', [id])
  await pool.query('DELETE FROM game_developers WHERE game_id = $1', [id])
  await pool.query('DELETE FROM games WHERE id = $1', [id])
}

// Delete a genre
async function deleteGenre(id) {
  // Check if there are associated games
  const { rows } = await pool.query('SELECT COUNT(*) FROM game_genres WHERE genre_id = $1', [id])
  const count = parseInt(rows[0].count, 10)

  if (count > 0) {
    throw new Error('There are games associated with this genre')
  }

  // Proceed with deletion if no associations
  await pool.query('DELETE FROM genres WHERE id = $1', [id])
}


// Delete a developer
async function deleteDeveloper(id) {
  // Check if there are associated games
  const { rows } = await pool.query('SELECT COUNT(*) FROM game_developers WHERE developer_id = $1', [id])
  const count = parseInt(rows[0].count, 10)

  if (count > 0) {
    throw new Error('There are games associated with this developer')
  }

  // Proceed with deletion if no associations
  await pool.query('DELETE FROM developers WHERE id = $1', [id])
}


module.exports = {
  getAllGames,
  getAllGenres,
  getAllDevelopers,
  addGame,
  addGenre,
  addDeveloper,
  getGameDetail,
  updateGame,
  deleteGame,
  deleteGenre,
  deleteDeveloper,
  checkGenreAssociations,
  checkDeveloperAssociations
}
