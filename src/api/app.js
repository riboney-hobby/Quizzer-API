const express = require('express')

const quizRouter = require('./routers/quiz.router')
const logger = require('../shared/logger')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})

app.use('/api/quizzes', quizRouter)

// Promise > callback
const connect = (port, hostname) => {

    const displayInfo = (addressInfo) => {
        logger.error(`Server is running on ${hostname}`)
        let connectionInfo
        if(typeof addressInfo === 'object'){
            connectionInfo = `Connection:
            - Address: ${addressInfo.address}
            - Protocol: ${addressInfo.family}
            - Port: ${addressInfo.port}`

            logger.info(connectionInfo)
        }
    }

    const serverCallback = (resolve, reject) => {
        const http = app.listen(port, () => displayInfo(http.address()))
        .on('listening', () => resolve(http))
        .on('error', err => reject(err))
    }

    return new Promise((resolve, reject) => serverCallback(resolve, reject))
}

const disconnect = (server) => {
    return new Promise((resolve, reject) => server
        .close(() => logger.info('HTTP server closed!'))
        .on('close', () => resolve())
        .on('error', () => reject(new Error("HTTP Server doesn't exist!")))
    )
}

module.exports = {
    app,
    connect,
    disconnect
}