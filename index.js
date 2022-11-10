const express = require('express')
const app = express()
const PORT = 3000;
const html = require('html');
const ejs = require('ejs')
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
app.use(express.static(__dirname + '/public'));
const MongoDBURI = 'mongodb+srv://vidul:v1i1d1u4l@movie-database.c5jv16g.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(MongoDBURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {});

app.listen(`${PORT}`, () => {
  console.log("\x1b[32m%s\x1b[0m" , "[Website] Website Is Online")
}) 

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/quiz/:qid/get', function(req, res) {
  if(req.query.score){
    res.render('score.ejs', {
    score: req.query.score,
      quiz_name: req.query.name,
      amount: req.query.amount
  });
  } else{
  const quiz = require("./models/quiz");
  const qid = req.params.qid
  quiz.findOne({ id: qid }, async(err, data) => {
    quiz.find({}, async(err, data2) => {
  res.render('index.ejs', {
    qid: qid,
    qdata: quiz,
    db: db,
    mongoose: mongoose,
    req: req,
    data: data,
    sdata: data2
  });
      });
  });
  }
});


app.get('/addquiz/:yes?', function(req, res) {
  const quiz = require("./models/quiz");
  const yes = req.params.yes
  res.render('addquiz.ejs', {
    qdata: quiz,
    yes: yes
  });
});

app.get('/thedata', function(req, res) {
  const data = require(`./thedata/${req.query.file}.json`);
  res.json(data)
});

app.post('/addquizz', function(req, res, next){
    const quiz = require("./models/quiz");
const info = req.body
  for(var i=0; i<info.question.length; i++) {
       if(info.ac === info.a1[i] || info.a2[i] || info.a3[i] || info.a4[i]){
       }else{
         return res.redirect('/addquiz/acerror')
       }

     }
  quiz.findOne({ id: info.id }, async(err, data) => {
  if(data){
   res.redirect('/addquiz/iderror')
  } else{
    quiz.findOne({ name: info.name }, async(err, data) => {
  if(data){
   return res.redirect('/addquiz/nameerror')
  } else {
    let questions = []
    
     for(var i=0; i<info.question.length; i++) {
       data3 = { question: info.question[i], answer1: info.a1[i], answer2: info.a2[i], answer3: info.a3[i], answer4: info.a4[i], canswer: info.ac[i],}

       questions.push(data3)

     }
    let alll = {
      id: `${info.id}`,
    dname: `${info.name}`,
      questions: questions
    }

let newData = new quiz({
      id: `${info.id}`,
    dname: `${info.name}`,
    questions: questions,
    })
    newData.save((error, data) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect(`/quiz/${info.id}/get`)
    const fs = require('fs');
      const all = JSON.stringify(alll)
fs.writeFile(`./thedata/${info.id}.json`, all, (err) => {
  if (err)
    console.log(err);
  else {
    console.log("Successfully added quiz and wrote json file for it");
  }
});

      }
    })
  }
  })
  }
  })

})