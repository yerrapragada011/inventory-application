const express = require('express')
const router = express.Router()
const gamesController = require('../controllers/gamesController')

router.get('/', gamesController.gamesList)

router.get('/genresList', gamesController.genresList)

router.get('/developersList', gamesController.developersList)

router.get('/gameDetail/:id', gamesController.gameDetailGet)

router.get('/newGame', gamesController.addNewGameGet)

router.post('/newGame', gamesController.addNewGamePost)

router.get('/updateGame/:id', gamesController.updateGameGet)

router.post('/updateGame/:id', gamesController.updateGamePost)

router.get('/newGenre', gamesController.addNewGenreGet)

router.post('/newGenre', gamesController.addNewGenrePost)

router.get('/newDeveloper', gamesController.addNewDeveloperGet)

router.post('/newDeveloper', gamesController.addNewDeveloperPost)

module.exports = router
