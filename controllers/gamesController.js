const db = require('../db/queries')

exports.gamesList = async (req, res) => {
  const games = await db.getAllGames()
  res.render('index', {
    title: 'Games',
    games: games
  })
}

exports.genresList = async (req, res) => {
  const genres = await db.getAllGenres()
  res.render('genresList', {
    title: 'Genres',
    genres: genres
  })
}

exports.developersList = async (req, res) => {
  const developers = await db.getAllDevelopers()
  res.render('developersList', {
    title: 'Developers',
    developers: developers
  })
}

exports.gameDetailGet = async (req, res) => {
  const gameId = parseInt(req.params.id, 10)
  const game = await db.getGameDetail(gameId)

  if (game) {
    res.render('gameDetail', { title: 'Game Detail', game: game })
  } else {
    res.status(404).send('Game not found')
  }
}

exports.addNewGameGet = async (req, res) => {
  const genres = await db.getAllGenres()
  const developers = await db.getAllDevelopers()
  res.render('gameForm', {
    title: 'New Game',
    genres: genres,
    developers: developers
  })
}

exports.addNewGamePost = async (req, res) => {
  const { gameName, genre, developer } = req.body
  const selectedGenres = Array.isArray(genre) ? genre : [genre]
  const selectedDevelopers = Array.isArray(developer) ? developer : [developer]
  await db.addGame(gameName, selectedGenres, selectedDevelopers)
  res.redirect('/')
}

exports.updateGameGet = async (req, res) => {
  const gameId = parseInt(req.params.id, 10)
  const game = await db.getGameDetail(gameId)
  const genres = await db.getAllGenres()
  const developers = await db.getAllDevelopers()
  res.render('updateGame', {
    title: 'Update Game',
    game: game,
    genres: genres,
    developers: developers
  })
}

exports.updateGamePost = async (req, res) => {
  const { gameName, genre, developer } = req.body
  const gameId = parseInt(req.params.id, 10)

  const selectedGenres = Array.isArray(genre) ? genre : genre ? [genre] : []
  const selectedDevelopers = Array.isArray(developer)
    ? developer
    : developer
    ? [developer]
    : []

  try {
    await db.updateGame(gameId, gameName, selectedGenres, selectedDevelopers)
    res.redirect(`/gameDetail/${gameId}`)
  } catch (error) {
    console.error('Error updating game:', error)
    res.status(500).send('Error updating game')
  }
}

exports.addNewGenreGet = async (req, res) => {
  res.render('genreForm', {
    title: 'Add Genre'
  })
}

exports.addNewGenrePost = async (req, res) => {
  const { genreName } = req.body
  await db.addGenre(genreName)
  res.redirect('/genresList')
}

exports.addNewDeveloperGet = async (req, res) => {
  res.render('developerForm', {
    title: 'Add Developer'
  })
}

exports.addNewDeveloperPost = async (req, res) => {
  const { developerName } = req.body
  await db.addDeveloper(developerName)
  res.redirect('/developersList')
}
