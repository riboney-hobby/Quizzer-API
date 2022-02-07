const MissingValue = require('../shared/errors/MissingValue.error')
const Validation = require('../shared/errors/Validation.error')
const Question = require('./Question.model')

module.exports = class Quiz {
    #name
    #questions

    constructor(name, questions){
        this.name = name
        this.questions = questions
    }

    get name(){
        return this.#name
    }

    set name(name){

        if(!name || name.length === 0)
        throw new MissingValue('name')

        const sanitizedName = name.trim()

        // https://stackoverflow.com/a/21722204
        const alphaNumNoNewLineNoTab = /^(\w+\s)*\w+$/
        
        if(sanitizedName.length === 0 || !sanitizedName.match(alphaNumNoNewLineNoTab))
        throw new Validation('name')

        this.#name = sanitizedName
    }

    get questions(){
        return this.#questions
    }

    set questions(questions){
        if(!questions)
        throw new MissingValue('questions')

        if(!Array.isArray(questions))
        throw new Validation('questions')

        if(questions.length === 0)
        throw new MissingValue('questions')

        const processedQuestions = questions.map(q => q instanceof Question ? q : new Question(q.text, q.answer))
        // const processedQuestions = questions.map(q => {
        //     if(q instanceof Question){
        //         console.log('processedQuestion - quiz.model.js, q: ', q.toString())
        //         return q
        //     }
            
        //     console.log('Not a Question, q:', q)
        //     return new Question(q.text, q.answer)
        // })


        this.#questions = processedQuestions
    }

    toString(){
        let value = `${this.name} Quiz\n`
        
        this.questions.forEach(q => value.concat(`${q.toString()}\n`))
        
        return value
    }

    toJSON(){
        const questionsJSON = this.questions.map(q => q.toJSON())
        return {
            name: this.name,
            questions: questionsJSON
        }
    }
}