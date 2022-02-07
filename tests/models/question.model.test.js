const Question = require('../../src/models/Question.model')
const MissingValue = require('../../src/shared/errors/MissingValue.error')
const Validation = require('../../src/shared/errors/Validation.error')

test('Success: valid text and answer', () => {
    const text = 'There are 50 states in USA'
    const answer = true
    const question = new Question(text, answer)

    expect(question.toString()).toBe(`Q: ${text}\nA: ${answer}`)
})

test('Error: missing text and answer', () => {
    const invalidQuestion = () => new Question()
    
    expect(invalidQuestion).toThrow(new MissingValue('text'))
})

test('Error: missing text', () => {
    const invalidText = () => new Question(false)

    expect(invalidText).toThrow(new MissingValue('text'))
})

test('Error: empty text', () => {
    const invalidText = () => new Question('', false)

    expect(invalidText).toThrow(new MissingValue('text'))
})

test('Error: text with invalid # of spaces', () => {
    const invalidText = () => new Question('Sample  Text', false)

    expect(invalidText).toThrow(new Validation('text'))
})

test('Success: text is trimmed', () => {
    const unTrimmedText = ' Sample Text '
    const answer = false
    const question = new Question(unTrimmedText, answer)

    expect(question.text).toBe(unTrimmedText.trim())
})

test('Error: missing answer', () => {
    const invalidAnswer = () => new Question('Sample Text')
    
    expect(invalidAnswer).toThrow(new MissingValue('answer'))
    
})

test('Error: invalid answer', () => {
    const invalidAnswer = () => new Question('Sample Text', 'false')
    
    expect(invalidAnswer).toThrow(new Validation('answer'))  
})

test('Success: toJSON()', () => {
    const text = 'There are 50 states in USA'
    const answer = true
    
    const question = new Question(text, answer)

    const expectedJSON = {
        text: 'There are 50 states in USA',
        answer: true
    }

    expect(question.toJSON()).toEqual(expectedJSON)
})