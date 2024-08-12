const express = require('express')
const app = express()
const path = require('node:path')

const indexRouter = require('./routes/index')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', indexRouter)

const PORT = 3000
app.listen(PORT, () =>
  console.log(`My first Express app - listening on port ${PORT}!`)
)
