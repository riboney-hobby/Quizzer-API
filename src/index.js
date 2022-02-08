const { MongoMemoryServer } = require('mongodb-memory-server')

const server = require('./api/server')
const database = require('./database/mongoConnection')
const configs = require('./shared/configs')
const logger = require('./shared/logger')


// const server = http.createServer(app)

// server.listen(configs.PORT, () => {
//     console.log(`Server running on port ${configs.PORT}`)
// })

let httpServer
let mongod

const startApp = async (env) => {
    try {
        let URI

        if(env === 'LOCAL'){
            mongod = await MongoMemoryServer.create()
            URI = mongod.getUri()
        } else 
            URI = configs.MONGO_URI

        const connections = await Promise.all([
            server.connect(configs.PORT, configs.HOSTNAME),
            database.connect(URI)
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

const shutdownApp = async (httpServer, env) => {

    try{
        logger.log("Shutting down application!")
        const stopInMemoryMongo = env === 'LOCAL' ? mongod.stop(): undefined

        await Promise.all([
            server.disconnect(httpServer),
            database.disconnect(),
            stopInMemoryMongo()
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

startApp(configs.ENV)
database.connectionStatus()
process.on('SIGINT', async () => await shutdownApp(httpServer, configs.ENV))