const Question = require('../../src/models/Question.model')
const Quiz = require('../../src/models/Quiz.model')
const MissingValue = require('../../src/shared/errors/MissingValue.error')
const Validation = require('../../src/shared/errors/Validation.error')
const s = require('../database/seederTest')

test('Success: JSON args', () => {
    const q = new Quiz(s.sampleQuizJSON.name, s.sampleQuizJSON.questions)

    expect(q.name).toBe(s.sampleQuizJSON.name)

    for(let i = 0; i<s.sampleQuizJSON.length; i++){
        expect(q.questions[i]).toEqual(s.sampleQuizJSON[i])
    }
})

test('Success: JSON Questions', () => {
    
    const quizWithJSONQuestions = new Quiz(s.sampleQuizName, s.sampleQuestionsJSON)

    const expectedQuiz = new Quiz(s.sampleQuizName, s.sampleQuestionModels)

    expect(quizWithJSONQuestions).toEqual(expectedQuiz)
})

test("Success: Quiz toString()", () => {
    let expectedToString = `${s.sampleQuizName} Quiz\n`
    s.sampleQuestionModels.forEach(q => expectedToString.concat(`${q.toString()}\n`))

    const quiz = s.sampleQuizModel

    expect(quiz.toString()).toBe(expectedToString)
})

test('Success: Quiz toJSON()', () => {
    const quiz = s.sampleQuizModel
    
    const expectedJSON = {
        name: s.sampleQuizName,
        questions: s.sampleQuestionsJSON
    }

    expect(quiz.toJSON()).toEqual(expectedJSON)
})

test('Error: missing name', () => {
    const omitName = () => {
        new Quiz()
    }

    expect(omitName).toThrow(new MissingValue('name'))
})

test('Error: empty name', () => {
    const omitName = () => {
        new Quiz('')
    }

    expect(omitName).toThrow(new MissingValue('name'))
})

test('Error: non-alphanumeric name', () => {
    const omitName = () => {
        new Quiz('$^#$^$#%')
    }

    expect(omitName).toThrow(new Validation('name'))
})


test('Error: missing questions', () => {
    const invalidQuestions = () => new Quiz('Sample Name')
    
    expect(invalidQuestions).toThrow(new MissingValue('questions'))  
})

test('Error: empty questions', () => {
    const invalidQuestions = () => new Quiz('Sample Name', [])
    
    expect(invalidQuestions).toThrow(new MissingValue('questions'))  
})

test('Error: invalid questions type', () => {
    const invalidQuestions = () => new Quiz('Sample Name', 'questions')
    
    expect(invalidQuestions).toThrow(new Validation('questions'))  
})

test('Error: invalid question objects in questions', () => {
    const questions = [
        new Question('Sample Text #1', false),
        143,
        new Question('Sample Text #3', false),
    ]

    const invalidQuestions = () => new Quiz('Sample Name', questions)
    
    expect(invalidQuestions).toThrow(new MissingValue('text'))  
})