const path = require('path')
const winston = require('winston')

const configs = require('./configs')

const { format } = winston


// src: https://levelup.gitconnected.com/better-logs-for-expressjs-using-winston-and-morgan-with-typescript-1c31c1ab9342
// src: https://logtail.com/tutorials/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/

const filepathToLogs = path.join(__dirname, '..', 'logs')

const filter = level => format(info => info.level !== level ? false: info)()

const levels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    http: 5
};

const devEnvTransports = [
    new winston.transports.Console({
        level: 'error',
        format: format.combine(
            filter('error'),
            format.colorize(),
            format.printf((item) => `${item.level} - ${item.message}`)
        )
    }),
    new winston.transports.Console({
        level: 'info',
        format: format.combine(
            filter('info'),
            format.colorize(),
            format.printf((item) => `${item.level} - ${item.message}`)
        )
    }),
    new winston.transports.Console({
        level: 'http',
        format: format.combine(
            filter('http'),
            format.colorize(),
            format.printf((item) => `${item.level} - ${item.message}`)
        )
    }),
    new winston.transports.Console({
        level: 'debug',
        format: format.combine(
            filter('debug'),
            format.colorize({ colors: { http: 'yellow' } }),
            format.printf((item) => `${item.level} - ${item.message}`)
        )
    })
];

const prodEnvTransports = [
    new winston.transports.File({
        dirname: path.join(filepathToLogs, 'errors'),
        filename: 'err.log',
        level: 'error',
        format: format.combine(format.json(), format.timestamp()),
        maxsize: 1024,
        maxFiles: 3
    }),
];

const testEnvTransports = [
    new winston.transports.File({
        dirname: path.join(filepathToLogs, 'test'),
        filename: 'err.log',
        level: 'error',
        format: format.combine(format.json(), format.timestamp()),
        maxsize: 1024,
        maxFiles: 1
    }),
    new winston.transports.File({
        dirname: path.join(filepathToLogs, 'test'),
        filename: 'info.log',
        level: 'info',
        format: format.combine(filter('info'), format.simple()),
        maxsize: 1024,
        maxFiles: 1
    }),
    new winston.transports.File({
        dirname: path.join(filepathToLogs, 'test'),
        filename: 'debug.log',
        level: 'debug',
        format: format.combine(filter('debug'), format.simple()),
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