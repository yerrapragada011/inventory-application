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
