const mongoose = require('mongoose')
// const QuizModel = require('../models/Quiz.model')

const quizSchema = new mongoose.Schema({
  name: {
      type:String,
      required: true
  },
  questions: [{
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

// const quizSchema = new mongoose.Schema({
//     name: String,
//     question: [{
//         text: String,
//         answer: Boolean
//       }],
//   })
// const quizSchema = new mongoose.Schema().loadClass(QuizModel)
// quizSchema.loadClass(QuizModel)


quizSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.id = obj._id.toString()
        obj.questions.forEach( q => {delete q._id})
        delete obj._id
        delete obj.__v
    }
})

const Quiz = mongoose.model('Quiz', quizSchema)

module.exports = Quiz