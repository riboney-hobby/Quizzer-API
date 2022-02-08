const express = require('express')
const timeout = require('connect-timeout')
require('express-async-errors')

const routes = require('./routers/app.router')
const e = require('./middlewares/error.middleware')
const m = require('./middlewares/misc.middleware')

const app = express()

app.use(timeout(3000))
app.use(express.json())
app.use(m.httpTimeout)

app.use(routes)

app.use(e.errorLogger)
app.use(e.errorHandler)
// https://expressjs.com/en/starter/faq.html
app.use(m.fourOhFour)

module.exports = app