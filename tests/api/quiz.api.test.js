const supertest = require('supertest')
const server = require('../../src/api/app')
const Quiz = require('../../src/database/quiz.schema')
const quizService = require('../../src/api/services/quiz.service')
const db = require('../database/localMongoConnection')
const s = require('../database/seederTest')

const API = supertest(server.app)
const quizRoute = '/api/quizzes'

// https://dev.to/paulasantamaria/testing-node-js-mongoose-with-an-in-memory-database-32np
beforeAll(async () => {
    await db.connect()
})

describe('Quiz - POST', () => {
    beforeAll( async() => {
        await Quiz.deleteMany({})
    })

    test('Success: valid POST request', async () => {
        await API
        .post(quizRoute)
        .send(s.sampleQuizzes[0])
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('Success: valid POST request -- quiz properties are defined', async () => {
        const res = await API
        .post(quizRoute)
        .send(s.sampleQuizzes[1])

        expect(res.body.id).toBeTruthy()
        expect(res.body.name).toBeTruthy()
        expect(res.body.questions).toBeTruthy()
    })

    test('Error: invalid POST request -- missing questions', async () => {
        await API
        .post(quizRoute)
        .send({name:'test'})
        .expect(400)
    })

    test('Error: invalid POST request -- missing name', async () => {
        await API
        .post(quizRoute)
        .send({questions: s.sampleQuestionModels})
        .expect(400)
    })
})

describe('Quiz - GET', () => {
    let quizIds = []

    beforeAll( async() => {
        await Quiz.deleteMany({})
        for(let i = 0; i<s.sampleQuizzes.length; i++){
            const quiz = await quizService.create(s.sampleQuizzes[i])
            quizIds.push(quiz.id)
        }
    })

    test('Success: retrieve all quizzes', async() => {
        await API
        .get(quizRoute)
        .expect(200)
    })

    test('Success: retrieve all quizzes - expected number of entities returned', async() => {
        const res = await API.get(quizRoute)

        expect(res.body).toHaveLength(s.sampleQuizzes.length)
    })

    test('Success: retrieve all quizzes - returned quiz entities are valid', async() => {
        const res = await API.get(quizRoute)

        res.body.forEach( q => {
            expect(q.id).toBeTruthy()
            expect(q.name).toBeTruthy()
            expect(q.questions).toBeTruthy()
        })
    })

    test('Success: retrieve quiz by id', async () => {
        await API
        .get(`${quizRoute}/${quizIds[0]}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('Error: retrieve quiz by invalid id', async () => {
        await API
        .get(`${quizRoute}/test`)
        .expect(400)
    })
})

describe('Quiz - DELETE', () => {
    let quizIds = []

    beforeAll(async () => {
        await Quiz.deleteMany({})
        for(let i = 0; i<s.sampleQuizzes.length; i++){
            const quiz = await quizService.create(s.sampleQuizzes[i])
            quizIds.push(quiz.id)
        }
    })

    test('Success: Quiz is removed', async () => {
        await API
        .delete(`${quizRoute}/${quizIds[0]}`)
        .expect(204)
    })

    test('Error: Invalid id', async () => {
        await API
        .delete(`${quizRoute}/${quizIds[0]}`)
        .expect(404)
    })

    test('Error: Invalid id - Object with ID already removed', async () => {
        await API
        .delete(`${quizRoute}/${quizIds[0]}`)
        .expect(404)
    })
})

describe('Quiz - PUT', () => {
    let quizIds = []

    beforeAll(async () => {
        await Quiz.deleteMany({})
        for(let i = 0; i<s.sampleQuizzes.length; i++){
            const quiz = await quizService.create(s.sampleQuizzes[i])
            quizIds.push(quiz.id)
        }
    })

    test('SUCCESS: Valid parameters', async () => {
        const newQuizJSON = {
            name: 'New Quiz Name',
            questions: [
                {
                    text: "new question text",
                    answer: true
                }
            ]
        }

        const res = await API
        .put(`${quizRoute}/${quizIds[0]}`)
        .send(newQuizJSON)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(res.body.id).toBe(quizIds[0])
    })

    test('ERROR: Invalid Parameters', async () => {
        await API
            .put(`${quizRoute}/${quizIds[0]}`)
            .send(null)
            .expect(400)
    })

    test('ERROR: Invalid Parameters  -- missing name', async () => {
        const newQuizJSON = {
            questions: [
                {
                    text: "new question text",
                    answer: true
                }
            ]
        }

        await API
            .put(`${quizRoute}/${quizIds[0]}`)
            .send(newQuizJSON)
            .expect(400)
    })

    test('ERROR: Invalid Parameters  -- missing questions', async () => {
        const newQuizJSON = {
            name: "test name"
        }

        await API
            .put(`${quizRoute}/${quizIds[0]}`)
            .send(newQuizJSON)
            .expect(400)
    })

    test('ERROR: Invalid Parameters  -- missing questions content', async () => {
        const newQuizJSON = {
            name: 'New Quiz Name',
            questions: []
        }

        await API
            .put(`${quizRoute}/${quizIds[0]}`)
            .send(newQuizJSON)
            .expect(400)
    })
})

afterAll(async () => {
    await db.disconnect()
})