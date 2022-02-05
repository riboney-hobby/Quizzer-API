const path = require('path')
const winston = require('winston')

const configs = require('./shared/configs')

const { format } = winston


// src: https://levelup.gitconnected.com/better-logs-for-expressjs-using-winston-and-morgan-with-typescript-1c31c1ab9342
// src: https://logtail.com/tutorials/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
// more info: https://github.com/winstonjs/logform#understanding-formats

const filepathToLogs = path.join(__dirname, '..', 'logs')

// https://github.com/winstonjs/winston#filtering-info-objects
const filter = level => format(info => info.level !== level ? false: info)()

// https://github.com/winstonjs/winston#using-custom-logging-levels
const levels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    http: 5
};

const timeFormat = {format: 'YYYY-MM-DD HH:mm:ss'}

const cliFormat = (level) => format.combine(
    filter(level),
    format.colorize(),
    format.printf((item) => `${item.level} - ${item.message}`)
)

const fileFormat = (level) => format.combine(
    filter(level),
    format.timestamp(timeFormat),
    format.printf((item) => `[${item.timestamp}] (${item.level.toUpperCase()}): ${item.message}`)
)

const devEnvTransports = [
    new winston.transports.Console({
        level: 'error',
        format: cliFormat('error')
    }),
    new winston.transports.Console({
        level: 'info',
        format: cliFormat('info')
    }),
    new winston.transports.Console({
        level: 'http',
        format: cliFormat('http')
    }),
    new winston.transports.Console({
        level: 'debug',
        // format: format.combine(
        //     format.colorize({ colors: { http: 'yellow' } }),
        //     format.printf((item) => `${item.level} - ${item.message}`)
        // )
        format: cliFormat('debug')
    })
];

const prodEnvTransports = [
    new winston.transports.File({
        dirname: path.join(filepathToLogs, 'errors'),
        filename: 'err.log',
        level: 'error',
        // format: format.combine(format.json(), format.timestamp()),
        format: fileFormat('error'),
        maxsize: 1024,
        maxFiles: 3
    }),
];

const testEnvTransports = [
    new winston.transports.File({
        dirname: path.join(filepathToLogs, 'test'),
        filename: 'err.log',
        level: 'error',
        format: fileFormat('error'),
        maxsize: 1024,
        maxFiles: 1
    }),
    new winston.transports.File({
        dirname: path.join(filepathToLogs, 'test'),
        filename: 'info.log',
        level: 'info',
        format: fileFormat('info'),
        maxsize: 1024,
        maxFiles: 1
    }),
    new winston.transports.File({
        dirname: path.join(filepathToLogs, 'test'),
        filename: 'debug.log',
        level: 'debug',
        format: fileFormat('debug'),
        maxsize: 1024,
        maxFiles: 1
    })
]

const transports = (() => {
    switch(configs.ENV){
        case 'DEV':
            return devEnvTransports
        
        case 'PROD':
            return prodEnvTransports

        case 'TEST':
            return testEnvTransports
        
        default:
            throw new Error('Development Environment value missing!')
    }
})()

module.exports = winston.createLogger({levels, transports})