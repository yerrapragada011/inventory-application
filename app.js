const express = require('express')
const app = express()

app.use('/', (req, res) => {
  console.log('Running')
})

const PORT = 3000
app.listen(PORT, () =>
  console.log(`My first Express app - listening on port ${PORT}!`)
)
