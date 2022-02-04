const Question = require('../../src/models/Question.model')
const Quiz = require('../../src/models/Quiz.model')
const MissingValue = require('../../src/shared/errors/MissingValue.error')
const Validation = require('../../src/shared/errors/Validation.error')


test("Valid name and questions don't throw error", () => {
    const name = 'SampleQuizName'
    const questions = [
        new Question('Sample Text #1', false),
        new Question('Sample Text #2', false),
        new Question('Sample Text #3', false),
    ]
    const quiz = new Quiz(name, questions)

    let expectedString = `${name} Quiz\n`
    questions.forEach(q => expectedString.concat(`${q.toString()}\n`))

    expect(quiz.toString()).toBe(expectedString)
})

test('Missing name throws error', () => {
    const omitName = () => {
        new Quiz()
    }

    expect(omitName).toThrow(new MissingValue('name'))
})

test('Name with 0 characters throws error', () => {
    const omitName = () => {
        new Quiz('')
    }

    expect(omitName).toThrow(new MissingValue('name'))
})

test('Non-alphanumeric name throws error', () => {
    const omitName = () => {
        new Quiz('$^#$^$#%')
    }

    expect(omitName).toThrow(new Validation('name'))
})


test('Missing questions throws error', () => {
    const invalidQuestions = () => new Quiz('Sample Name')
    
    expect(invalidQuestions).toThrow(new MissingValue('questions'))  
})

test('Empty questions throws error', () => {
    const invalidQuestions = () => new Quiz('Sample Name', [])
    
    expect(invalidQuestions).toThrow(new MissingValue('questions'))  
})

test('Invalid questions type throws error', () => {
    const invalidQuestions = () => new Quiz('Sample Name', 'questions')
    
    expect(invalidQuestions).toThrow(new Validation('questions'))  
})

test('Invalid objects in questions throws error', () => {
    const questions = [
        new Question('Sample Text #1', false),
        143,
        new Question('Sample Text #3', false),
    ]

    const invalidQuestions = () => new Quiz('Sample Name', questions)
    
    expect(invalidQuestions).toThrow(new Validation('questions'))  
})