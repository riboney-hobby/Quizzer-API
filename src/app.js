const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})

// Promise > callback
const connect = (port, hostname) => {

    const displayInfo = (addressInfo) => {
        console.log(`Server is running on ${hostname}`)
        let connectionInfo
        if(typeof addressInfo === 'object'){
            connectionInfo = `Connection:
            - Address: ${addressInfo.address}
            - Protocol: ${addressInfo.family}
            - Port: ${addressInfo.port}`

            console.log(connectionInfo)
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
        .close(() => console.log('HTTP server closed!'))
        .on('close', () => resolve())
        .on('error', () => reject(new Error("HTTP Server doesn't exist!")))
    )
}

module.exports = {
    app,
    connect,
    disconnect
}