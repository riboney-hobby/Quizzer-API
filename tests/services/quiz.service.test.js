const db = require('../database/localMongoConnection')
const Quiz = require('../../src/database/quiz.schema')
const quizService = require('../../src/api/services/quiz.service')
const QuestionModel = require('../../src/models/Question.model')
const s = require('../database/seederTest')


// https://dev.to/paulasantamaria/testing-node-js-mongoose-with-an-in-memory-database-32np
beforeAll(async () => {
    await db.connect()
})

describe('quiz.service.create', () => {

    beforeAll(async() => {
        await Quiz.deleteMany({})
    })

    test('Success: inserts valid Quiz object', async () => {
        const name = 'SampleQuizName'
        const questions = [
            new QuestionModel('Sample Text #1', false),
            {text:'Sample Text #2', answer:false},
            new QuestionModel('Sample Text #3', false),
        ]
    
        const createdQuiz = await quizService.create({name, questions})
    
        expect(createdQuiz.name).toBe(name)
        for(let i =0; i<3; i++){
            if(questions[i] instanceof QuestionModel){
                // not using toEqual because of id
                expect(createdQuiz.questions[i].text).toBe(questions[i].toJSON().text)
                expect(createdQuiz.questions[i].answer).toBe(questions[i].toJSON().answer)
            }
                
            else {
                expect(createdQuiz.questions[i].text).toBe(questions[i].text)
                expect(createdQuiz.questions[i].answer).toBe(questions[i].answer)
            }
            
        }
    })

    test('Success: many inserts of valid Quiz and Quiz JSON objects', async () => {
        for(let i = 0; i<s.sampleQuizzes.length; i++){
            const quiz = await quizService.create(s.sampleQuizzes[i])
            expect(quiz.name).toBe(s.sampleQuizzes[i].name)
            for(let j=0; j<s.sampleQuizzes[i].questions.length; j++){
                expect(quiz.questions[j].text).toBe(s.sampleQuizzes[i].questions[j].text)
                expect(quiz.questions[j].answer).toBe(s.sampleQuizzes[i].questions[j].answer)
            }
        }
    })
    
    test('Error: inserting questions missing text and answer', async () => {
        const name = `SampleQuizName`
        const questions = [
            new QuestionModel('Sample Text #1', false).toJSON(),
            234,
            'test'
        ]
    
        const invalidQuiz = async () => {await quizService.create({name, questions})}
    
        // src: https://stackoverflow.com/questions/47144187/can-you-write-async-tests-that-expect-tothrow
        await expect(invalidQuiz).rejects.toThrow('Error in quiz.service.create:')
    })

    test('Error: inserting questions with missing text', async () => {
        const name = `SampleQuizName`
        const questions = [
            new QuestionModel('Sample Text #1', false).toJSON(),
            {answer:false},
        ]
    
        const invalidQuiz = async () => {await quizService.create({name, questions})}
    
        // src: https://stackoverflow.com/questions/47144187/can-you-write-async-tests-that-expect-tothrow
        await expect(invalidQuiz).rejects.toThrow('Error in quiz.service.create:')
    })

    test('Error: inserting questions with missing answer', async () => {
        const name = `SampleQuizName`
        const questions = [
            new QuestionModel('Sample Text #1', false).toJSON(),
            {text:'Sample Text #2'},
        ]
    
        const invalidQuiz = async () => {await quizService.create({name, questions})}
    
        // src: https://stackoverflow.com/questions/47144187/can-you-write-async-tests-that-expect-tothrow
        await expect(invalidQuiz).rejects.toThrow('Error in quiz.service.create:')
    })

    test('Error: inserting quiz with missing name', async () => {
        const questions = [
            new QuestionModel('Sample Text #1', false).toJSON(),
        ]
    
        const invalidQuiz = async () => {await quizService.create({questions})}
    
        // src: https://stackoverflow.com/questions/47144187/can-you-write-async-tests-that-expect-tothrow
        await expect(invalidQuiz).rejects.toThrow('Error in quiz.service.create:')
    })
})

describe('quiz.service.retrieve*', () => {
    beforeAll(async () => {
        await Quiz.deleteMany({})
        for(let i = 0; i<s.sampleQuizzes.length; i++){
            await quizService.create(s.sampleQuizzes[i])
        }
    })

    test('Success: retrieve correct number of quizzes', async () => {
        const q = await quizService.retrieveAll()
        expect(q).toHaveLength(s.sampleQuizzes.length)
    })

    test('Success: retrieve quiz by id', async () => {
        const q = await quizService.retrieveAll()
        const id = q[0].id
        const qById =  await quizService.retrieveByID(id)

        expect(qById).toEqual(q[0])
    })

    test('Error: retrieve quiz by invalid id', async () => {
        const invalidId = async () => await quizService.retrieveByID('0')
        await expect(invalidId()).rejects.toThrow('Error in quiz.service.retrieveById')
    })

    test('Success: retrieve null when database is empty', async () => {
        await Quiz.deleteMany({})
        const q = await quizService.retrieveAll()
        
        expect(q).toBe(null)
    })
})

describe('quiz.service.remove', () => {
    let quizIds = []

    beforeAll(async () => {
        await Quiz.deleteMany({})
        for(let i = 0; i<s.sampleQuizzes.length; i++){
            const quiz = await quizService.create(s.sampleQuizzes[i])
            quizIds.push(quiz.id)
        }
    })

    test('Success: Total number of quizzes reduced by one', async () => {
        await quizService.remove(quizIds[0])
        const numOfQuizzes = (await quizService.retrieveAll()).length

        expect(numOfQuizzes).toBe(s.sampleQuizzes.length - 1)
    })

    test('Error: remove quiz by invalid id', async () => {
        const invalidId = async () => await quizService.remove('0')

        await expect(invalidId()).rejects.toThrow('Error in quiz.service.remove')
    })
})

describe('quiz.service.update', () => {

    let quizId
    beforeEach(async () => {
        await Quiz.deleteMany({})
        quizId = (await quizService.create(s.sampleQuizModel)).id
        //const quizId = (await quizService.create({name: s.sampleQuizModel.name, questions:s.sampleQuizModel.questions})).id
    })

    test('Success: modify quiz name and question', async () => {
        
        const newQuizJSON = {
            name: 'New Quiz Name',
            questions: [
                {
                    text: "new question text",
                    answer: true
                }
            ]
        }

        const newQuiz = await quizService.update(quizId, newQuizJSON)

        expect(newQuiz.name).not.toBe(s.sampleQuizModel.name)
        expect(newQuiz.questions[0].text).not.toBe(s.sampleQuizModel.questions[0].text)
        expect(newQuiz.questions[0].answer).not.toBe(s.sampleQuizModel.questions[0].answer)
        expect(newQuiz.id).toBe(quizId)
    })

    test('Error: missing name', async () => {
        const newQuizJSON = {
            questions: [
                {
                    text: "new question text",
                    answer: true
                }
            ]
        }

        const invalidName = async () => await quizService.update(quizId, newQuizJSON)

        await expect(invalidName()).rejects.toThrow('Error in quiz.service.update')
    })

    test('Error: missing questions', async () => {
        const newQuizJSON = {
            name: 'New Quiz name'
        }

        const invalidQuestions = async () => await quizService.update(quizId, newQuizJSON)

        await expect(invalidQuestions()).rejects.toThrow('Error in quiz.service.update')
    })
})

afterAll(async () => {
    await db.disconnect()
})