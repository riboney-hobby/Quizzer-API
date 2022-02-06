const quizService = require('../services/quiz.service')
const logger = require('../../shared/logger')


const getAll = async (req, res, next) => {
    try{
        res.json(await quizService.retrieveAll())
    } catch (err){
        logger.error(`Error in quiz.controller getAll: ${err.message}`)
        next(err)
    }
}

const getById = async (req, res, next) => {
  try{
      res.json(await quizService.retrieveByID(req.params.id))
  } catch(err){
      logger.error(`Error in quiz.controller.getById: ${err.message}`)
      next(err)
  }
}

const post = async (req, res, next) => {
    try{
        logger.debug(`incoming data: \n ${JSON.stringify(req.body)}`)
        res.json(await quizService.create(req.body))
    } catch(err){
        logger.error(`Error in quiz.controller.post: ${err.message}`)
        next(err)
    }
}


const remove = async (req, res, next) => {
    try{
        res.json(await quizService.remove(req.params.id))
    } catch(err){
        logger.error(`Error in quiz.controller.remove:', ${err.message}`)
        next(err)
    }
}

const put = async (req, res, next) => {
    try{
        res.json(await quizService.update(req.params.id, req.body))
    } catch(err){
        logger.error(`Error in quiz.controller.put:', ${err.message}`)
        next(err)
    }
}

module.exports = {
    getAll,
    getById,
    post,
    remove,
    put
}