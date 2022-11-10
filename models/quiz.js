const mongoose = require("mongoose");
const Schema = mongoose.Schema;

(quizSchema = new Schema({
    id: String,
    dname: String,
    questions: [{ question: String, answer1: String, answer2: String, answer3: String, answer4: String, canswer: String,}],
})),
  (Quiz = mongoose.model("quiz", quizSchema));

module.exports = Quiz;
