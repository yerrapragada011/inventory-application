const express = require('express')
const router = express.Router()
const gamesController = require('../controllers/gamesController')

router.get('/', gamesController.gamesList)

router.get('/gameDetail/:id', gamesController.gameDetailGet)

module.exports = router
