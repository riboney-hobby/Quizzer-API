const MissingValue = require('../shared/errors/MissingValue.error')
const Validation = require('../shared/errors/Validation.error')

module.exports = class Question {
    #text
    #answer

    constructor(text, answer){
        // if(!text && !answer) throw new MissingValue('text and answer')
        this.text = text
        this.answer = answer
    }

    get text(){
        return this.#text
    }

    set text(text){
        if(!text || text.length === 0)
        throw new MissingValue('text')

        const sanitizedText = text.trim()

        // https://stackoverflow.com/a/21722204
        const anyWordOnlyOneSpace = /^(\S+\s)*\S+$/

        if(sanitizedText.length === 0 || !sanitizedText.match(anyWordOnlyOneSpace))
        throw new Validation('text')

        this.#text = sanitizedText
    }

    get answer(){
        return this.#answer
    }

    set answer(answer){
        if(answer === undefined || answer === null)
        throw new MissingValue('answer')

        if(typeof answer != 'boolean')
        throw new Validation('answer')

        this.#answer = answer
    }

    toString(){
        return `Q: ${this.text}\nA: ${this.answer}`
    }

    toJSON(){
        return {
            text: this.text,
            answer: this.answer
        }
    }
}