const express = require('express')
const router = express.Router()
const gamesController = require('../controllers/gamesController')

router.get('/', gamesController.gamesList)

router.get('/gameDetail/:id', gamesController.gameDetailGet)

router.get('/newGame', gamesController.addNewGameGet)

router.post('/newGame', gamesController.addNewGamePost)

module.exports = router
