const Quiz = require('../database/quiz.schema')

const retrieveAll = async () => {
    try{
        const quizzes = await Quiz.find({})
        // default returns empty array, 
        // so we explicitly return null if thats the case
        return quizzes.length === 0 ? null : quizzes
    } catch(err){
        console.error('Error in quiz.service.retrieveAll\n', err)
        return null
    }
}

const retrieveByID = async (id) => {
    try {
        return await Quiz.findById(id)
    } catch(err){
        console.error('Error in quiz.service.retrieveById\n', err)
        return null
    }
}

const create = async (raw) => {
    try{
        const quiz = new Quiz({name:raw.name, questions:raw.questions})
        // return await quiz.save()
        const jsonQuiz = await quiz.save()
        return jsonQuiz.toJSON()
    } catch (err){
        console.error('Error in quiz.service.create\n', err)
        return null
    }
}

const remove = async (id) => {
    try{
        return await Quiz.findByIdAndRemove(id)
    } catch (err) {
        console.error('Error in quiz.service.remove\n', err)
        return null
    }
}

const update = async (id, newQuiz) => {
    try{
        return await Quiz.findByIdAndUpdate(id, newQuiz, {new: true})
    } catch(err){
        console.error('Error in quiz.service.update\n', err)
        return null
    }
}

module.exports = {
    retrieveAll,
    retrieveByID,
    create,
    remove,
    update
}