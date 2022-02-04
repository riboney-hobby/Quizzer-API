module.exports = class MissingValue extends Error {
    // https://javascript.info/custom-errors
    constructor(value){
        super(`${value} is required but missing!`)
        this.name = "MissingValueError"
    }
}