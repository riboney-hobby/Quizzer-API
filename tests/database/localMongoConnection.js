const mongoose = require('mongoose')


const connect = async () => {
    const URI = process.env.TEST_URI
    console.log('Here is mongo URI:', URI)
    await mongoose.connect(URI, {dbName: "test-db"})
    console.log('connection name: ', mongoose.connection.name)
}

const disconnect = async () => {
    await mongoose.connection.close()
}

module.exports = {
    connect,
    disconnect
}
