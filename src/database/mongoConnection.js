const mongoose = require('mongoose')

const connect = (URI) => {
    console.log('Establishing connection to MongoDB database...')
    return mongoose.connect(URI)
}

const disconnect = () => {
    console.log('Closing connection to MongoDB database...')
    return mongoose.connection.close()
}

const connectionStatus = () => {
  mongoose.connection.once('connected', 
  () => console.log(`Connection to database ${mongoose.connection.name} established!`))

  mongoose.connection.once('error', 
  () => console.log(`Unable to establish connection to database ${mongoose.connection.name}...`))
}

module.exports = {
    connect,
    disconnect,
    connectionStatus
}