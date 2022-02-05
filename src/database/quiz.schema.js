const mongoose = require('mongoose')
// const QuizModel = require('../models/Quiz.model')
// const quizSchema = new mongoose.Schema({
//     name: String,
//     question: [{
//         text: String,
//         answer: Boolean
//       }],
//   })
// const quizSchema = new mongoose.Schema().loadClass(QuizModel)
// quizSchema.loadClass(QuizModel)


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


quizSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.id = obj._id.toString()
        obj.questions.forEach( q => {
            q.id = q._id.toString()
            delete q._id
            delete q.__v
        })
        delete obj._id
        delete obj.__v
    }
})

const Quiz = mongoose.model('Quiz', quizSchema)

module.exports = Quiz