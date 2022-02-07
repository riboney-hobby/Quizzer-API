const mongoose = require('mongoose')

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



// Archive:
// TO-DO: configure schema to load class properly
// Tried to use .loadClass to hook up Quiz class to the schema, but had errors with path conflicts for the fields
//
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