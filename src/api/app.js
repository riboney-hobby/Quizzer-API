const express = require('express')
const timeout = require('connect-timeout')
require('express-async-errors')

const routes = require('./routers/app.router')
const e = require('./middlewares/error.middleware')
const m = require('./middlewares/misc.middleware')

const logger = require('../shared/logger')


const app = express()

app.use(timeout(3000))
app.use(express.json())
app.use(m.httpTimeout)

app.use(routes)

app.use(e.errorLogger)            // logs error message
app.use(e.errorHandler)           // looks for known errors and handles accordingly 
app.use(e.unknownErrorHandler)    // catch-all error handler


// Promise > callback
const connect = (port, hostname) => {

    const displayInfo = (addressInfo) => {
        logger.info(`Server is running on ${hostname}`)
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