const Question = require('../../src/models/Question.model')
const MissingValue = require('../../src/shared/errors/MissingValue.error')
const Validation = require('../../src/shared/errors/Validation.error')

test('Question is created with valid parameters', () => {
    const text = 'There are 50 states in USA'
    const answer = true
    const question = new Question(text, answer)

    expect(question.toString()).toBe(`Q: ${text}\nA: ${answer}`)
})

test('Missing text throws error', () => {
    const invalidText = () => new Question(false)

    expect(invalidText).toThrow(new MissingValue('text'))
})

test('Empty text throws error', () => {
    const invalidText = () => new Question('', false)

    expect(invalidText).toThrow(new MissingValue('text'))
})

test('Text with more than one space between words throws error', () => {
    const invalidText = () => new Question('Sample  Text', false)

    expect(invalidText).toThrow(new Validation('text'))
})

test('Text with extra space around it is trimmed', () => {
    const unTrimmedText = ' Sample Text '
    const answer = false
    const question = new Question(unTrimmedText, answer)

    expect(question.text).toBe(unTrimmedText.trim())
})

test('Missing answer throws error', () => {
    const invalidAnswer = () => new Question('Sample Text')
    
    expect(invalidAnswer).toThrow(new MissingValue('answer'))
    
})

test('Invalid answer throws error', () => {
    const invalidAnswer = () => new Question('Sample Text', 'false')
    
    expect(invalidAnswer).toThrow(new Validation('answer'))  
})