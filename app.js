const express = require('express')
const dotenv = require('dotenv').config({path: './config.env'})

const controller = require('./controller')

const app = express()
app.use(express.json())

app.use('/', controller)

const PORT = process.env.PORT || 7000
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`)
})