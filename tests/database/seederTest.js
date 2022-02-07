const QuestionModel = require('../../src/models/Question.model')
const QuizModel = require('../../src/models/Quiz.model')

const sampleQuizName = 'Sample Quiz Name'
const sampleQuestionModels = [
    new QuestionModel('Sample Text #1', false),
    new QuestionModel('Sample Text #2', false),
    new QuestionModel('Sample Text #3', false),
]

const sampleQuestionsJSON = sampleQuestionModels.map(q => q.toJSON())


const sampleQuizModel = new QuizModel(sampleQuizName, sampleQuestionModels)

const sampleQuizJSON = {
    name: 'Test Quiz name',
    questions: [
        {
            text: "Question #1",
            answer: true
        },
        {
            text: "Question #2",
            answer: false
        },
        {
            text: "Question #3",
            answer: false
        },
        {
            text: "Question #4",
            answer: true
        },
    ]
}


const sampleQuizzes = [
    {
        name: "Test Quiz 1",
        questions: [
            {
                text: "Question #1",
                answer: true
            },
            {
                text: "Question #2",
                answer: false
            },
            {
                text: "Question #3",
                answer: false
            },
            {
                text: "Question #4",
                answer: true
            },
        ]
    },
    {
        name: "Test Quiz 2",
        questions: [
            {
                text: "Question #1",
                answer: true
            },
            {
                text: "Question #2",
                answer: false
            },
            {
                text: "Question #3",
                answer: false
            },
            {
                text: "Question #4",
                answer: true
            },
        ]
    },
    {
        name: "Test Quiz 3",
        questions: [
            {
                text: "Question #1",
                answer: true
            },
            {
                text: "Question #2",
                answer: false
            },
            {
                text: "Question #3",
                answer: false
            },
            {
                text: "Question #4",
                answer: true
            },
        ]
    },
]

module.exports = {
    sampleQuizName,
    sampleQuestionModels,
    sampleQuestionsJSON,
    sampleQuizModel,
    sampleQuizJSON,
    sampleQuizzes,
}