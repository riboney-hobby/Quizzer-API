const db = require('../database/localMongoConnection')
const Quiz = require('../../src/database/quiz.schema')
const quizService = require('../../src/services/quiz.service')


// https://dev.to/paulasantamaria/testing-node-js-mongoose-with-an-in-memory-database-32np
beforeAll(async () => {
    await db.connect()
    await Quiz.deleteMany({})
})

test('quiz.service.create inserts valid Quiz object into database', async () => {
    const name = 'SampleQuizName'
    const questions = [
        {text:'Sample Text #1', answer:false},
        {text:'Sample Text #2', answer:true},
        {text:'Sample Text #3', answer:false},
    ]

    const createdQuiz = await quizService.create({name, questions})

    expect(createdQuiz.name).toBe(name)
    expect(createdQuiz.questions).toEqual(questions)
})

afterAll(async () => {
    await db.disconnect()
})