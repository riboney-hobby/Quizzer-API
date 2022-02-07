const Quiz = require('../../database/quiz.schema')
const QuizModel = require('../../models/Quiz.model')
const logger = require('../../shared/logger')

// const retrieveAll = async () => {
//     try{
//         const quizzes = await Quiz.find({})
//         // default returns empty array, 
//         // so we explicitly return null if thats the case
//         return quizzes.length === 0 ? null : quizzes
//     } catch(err){
//         // console.error(err)
//         throw new Error('Error in quiz.service.retrieveAll:', err.message)
//     }
// }

const retrieveAll = async () => {
    try{
        const quizzes = await Quiz.find({})
        // default returns empty array, 
        // so we explicitly return null if thats the case
        if(quizzes.length === 0) return null

        return quizzes.map(q => q.toJSON())
    } catch(err){
        logger.error(`${err}`)
        throw err
    }
}

const retrieveByID = async (id) => {
    try {
        const res = await Quiz.findById(id)
        return res ? res.toJSON():null
    } catch(err){
        logger.error(`${err}`)
        throw err
    }
}

const create = async (raw) => {
    try{
        const validatedQuiz = new QuizModel(raw.name, raw.questions)

        const quiz = new Quiz(validatedQuiz.toJSON())
        
        const savedQuiz = await quiz.save()
        logger.debug(`${JSON.stringify(savedQuiz.toJSON())}`)
        return savedQuiz.toJSON()
    } catch (err){
        logger.error(`${err}`)
        throw err
    }
}

const remove = async (id) => {
    try{
       return await Quiz.findByIdAndRemove(id)
    } catch (err) {
        logger.error(`${err}`)
        throw err
    }
}

const update = async (id, raw) => {
    try{
        // let updatedQuestions = raw.questions.map(q => new QuestionModel(q.text, q.answer))

        const validatedQuiz = new QuizModel(raw.name, raw.questions)

        return (await Quiz.findByIdAndUpdate(id, validatedQuiz.toJSON(), {new: true})).toJSON()
    } catch(err){
        logger.error(`${err}`)
        throw err
    }
}

module.exports = {
    retrieveAll,
    retrieveByID,
    create,
    remove,
    update
}