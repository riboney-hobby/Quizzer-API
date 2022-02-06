const logger = require('../../shared/logger')

//https://scoutapm.com/blog/express-error-handling

const errorLogger = (error, req, res, next) => {
    logger.error(error)
    next(error)
}

const errorHandler = (error, req, res, next) => {
    if(error.type == "redirect") res.redirect('/')
    else if(error.type == "not-found") res.redirect('/404')
    else if(error.timeout) {
        logger.error(error)
        return res.redirect('/timeout')
    }
    else next(error)
}

// eslint-disable-next-line no-unused-vars
const unknownErrorHandler = (error, req, res, next) => {
    logger.error(error)
    res.redirect('/error')
}

module.exports = {
    errorLogger,
    errorHandler,
    unknownErrorHandler
}


/*
src: https://scoutapm.com/blog/express-error-handling
How to perform redirects, ex:

app.get('/two', (req, res, next) => {
  fsPromises.readFile('./two.txt')
    .then(data => res.send(data))
    .catch(err => {
        // this will trigger the errorResponder to redirect to the /error page
        err.type = 'redirect' // custom prop to specify handling behaviour
        next(err)
    })
})

How to handle time outs
app.use((error, req, res, next) => {
  console.log("Error Handling Middleware called")
  console.log('Path: ', req.path)
  console.error('Error: ', error)
 
  if (error.type == 'redirect')
      res.redirect('/error')

   else if (error.type == 'time-out') // arbitrary condition check
      res.status(408).send(error)
  else
      res.status(500).send(error)
})
*/