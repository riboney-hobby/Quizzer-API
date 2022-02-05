const Quiz = require('../../database/quiz.schema')
const QuizModel = require('../../models/Quiz.model')
const QuestionModel = require('../../models/Question.model')
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
        logger.error(err)
        throw new Error('Error in quiz.service.retrieveAll:', err.message)
    }
}

const retrieveByID = async (id) => {
    try {
        return (await Quiz.findById(id)).toJSON()
    } catch(err){
        logger.error(err)
        throw new Error('Error in quiz.service.retrieveById:', err.message)
    }
}

const create = async (raw) => {
    try{
        const validatedQuiz = new QuizModel(raw.name, raw.questions)

        const quiz = new Quiz(validatedQuiz.toJSON())
        
        const savedQuiz = await quiz.save()

        return savedQuiz.toJSON()
    } catch (err){
        logger.error(err)
        throw new Error('Error in quiz.service.create:', err.message)
    }
}

const remove = async (id) => {
    try{
        return (await Quiz.findByIdAndRemove(id)).toJSON()
    } catch (err) {
        logger.error(err)
        throw new Error('Error in quiz.service.remove:', err.message)
    }
}

const update = async (id, raw) => {
    try{
        let updatedQuestions = raw.questions.map(q => new QuestionModel(q.text, q.answer))

        const validatedQuiz = new QuizModel(raw.name, updatedQuestions)

        return await Quiz.findByIdAndUpdate(id, validatedQuiz.toJSON(), {new: true})
    } catch(err){
        logger.error(err)
        throw new Error('Error in quiz.service.update:', err.message)
    }
}

module.exports = {
    retrieveAll,
    retrieveByID,
    create,
    remove,
    update
}