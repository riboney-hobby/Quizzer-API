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

        questions.forEach(q => {
            if(!(q instanceof Question))
            throw new Validation('questions')
        })

        this.#questions = questions
    }

    toString(){
        let value = `${this.name} Quiz\n`
        
        this.questions.forEach(q => value.concat(`${q.toString()}\n`))
        
        return value
    }
}