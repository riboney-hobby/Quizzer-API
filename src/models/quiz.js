const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
  name: {
      type:String,
      required: true
  },
  question: [{
      text: {
          type: String,
          required: true
        },
        answer: {
            type: Boolean,
            required: true
        }
    }],
})

quizSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
    }
})

const Quiz = mongoose.model('Quiz', quizSchema)

module.exports = Quiz