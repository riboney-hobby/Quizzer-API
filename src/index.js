const server = require('./app')
const database = require('./database')
const configs = require('./configs')
const logger = require('./logger')


// const server = http.createServer(app)

// server.listen(configs.PORT, () => {
//     console.log(`Server running on port ${configs.PORT}`)
// })

let httpServer

const startApp = async () => {
    try {
        const connections = await Promise.all([
            server.connect(configs.PORT, configs.HOSTNAME),
            database.connect()
        ])

        httpServer = connections[0]
    } catch (err){
        logger.error(`Error in starting application!`)
        logger.error(err)
        process.exit(1)
    }
}

// mongoose.connection.once('open', () => resolve(`Connection to database ${mongoose.connection.name} established!`))
//mongoose.connection.once('error', () => reject(`Error connecting to database ${mongoose.connection.name}...`))

const shutdownApp = async (httpServer) => {
    try{
        logger.log("Shutting down application!")
        await Promise.all([
            server.disconnect(httpServer),
            database.disconnect()
        ])
        process.exit(0)
    } catch(err){
        if(err){
            logger.error("Error in closing application gracefully!")
            logger.error(err)
            process.exit(1)
        } 
    }
}

startApp()
database.connectionStatus()
process.on('SIGINT', () => shutdownApp(httpServer))