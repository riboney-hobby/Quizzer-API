const express = require('express')
const router = express.Router()

const quizRouter = require('./quiz.router')

router.get('/', (req, res) => res.status(200).send('Hello World!'))
router.get('/404', (req, res) => res.send('Requested resource not found!'))
router.get('/error', (req, res) => res.status(503).send('Server unavailable').end())
router.get('/timeout', (req, res) => res.status(503).send('Server timeout').end())

router.use('/api/quizzes', quizRouter)

module.exports = router