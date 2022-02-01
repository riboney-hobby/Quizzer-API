const app = require('./app')
const http = require('http')
const configs = require('./configs')

const server = http.createServer(app)

server.listen(configs.PORT, () => {
    console.log(`Server running on port ${configs.PORT}`)
})