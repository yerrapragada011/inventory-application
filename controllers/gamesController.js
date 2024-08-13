const db = require('../db/queries')

exports.gamesList = async (req, res) => {
  const games = await db.getAllGames()
  res.render('index', {
    title: 'Games',
    games: games
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
