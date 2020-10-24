var express = require('express'); 
var upload = require('express-fileupload');
var upload1 = require('connect-busboy');
var ejs=require("ejs");
var session=require('express-session');
var cookieParser=require('cookie-parser');
var emailid;
var multer = require('multer')
var nodemailer = require('nodemailer');
var client = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'michawrel@gmail.com', 
      pass: 'cliq$321'
  }
});
var upload = multer({dest:__dirname + '/uploads/'}) 
var app = express(); 
var port = process.env.PORT || 8081; 
var morgan = require('morgan'); 
var mongoose = require('mongoose'); 
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router); 
var path = require('path'); 
var passport = require('passport'); 
var social = require('./app/passport/passport')(app, passport);
var formidable=require("formidable");
var axios=require('axios');
var fs=require("fs");
const { execFileSync } = require('child_process');
var request = require('request');
var base64Img=require('base64-img');
var cloudinary = require('cloudinary').v2;
var CLOUDINARY_URL="cloudinary://231246687914558:fa3ebf9DSob0WuI4HRvXeyglavY@de7mtdjd5"
cloudinary.config({ 
    cloud_name: 'de7mtdjd5', 
    api_key: '231246687914558', 
    api_secret: 'fa3ebf9DSob0WuI4HRvXeyglavY'
  });
app.use(morgan('dev')); 
app.use(bodyParser.json()); 
app.use(cookieParser());
app.set('view engine','ejs');
app.use(session({secret:"dinesh"})); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/public')); 
app.use('/api', appRoutes); 

mongoose.connect('mongodb://dinesh:dinesh@cluster0-shard-00-00.jeave.mongodb.net:27017,cluster0-shard-00-01.jeave.mongodb.net:27017,cluster0-shard-00-02.jeave.mongodb.net:27017/test?ssl=true&replicaSet=atlas-wzlo6z-shard-0&authSource=admin&retryWrites=true&w=majority', function(err) {
    if (err) {
        console.log('Not connected to the database: ' + err); 
    } else {
        console.log('Successfully connected to MongoDB'); 
    }
});
let array=[];
var href="";
var score="score";
var name="",mobile="";
var attended="attended";
var qu=[];
var an=[];
app.get("/animalsquiz",function(req,res){
  if(req.session[attended]==10)
  { 
      var a1=req.session[attended];
      var a2=req.session[score];
      req.session[attended]=0;
      req.session[score]=0;
      res.render("score",{a2:a2,a1:a1});
      const requestOptions = {
          "Name":name,
          "Phone_Number":mobile,
          "Total_Score":a2,
    };
      
    axios.post('https://satisfying-splendid-printer.glitch.me/api/details', requestOptions)
    .then((res) => {
        console.log(`Status: ${res.status}`);
        console.log('Body: ', res.data);
    }).catch((err) => {
        console.error(err);
    });
  }
  else{
  req.session[attended]=req.session[attended] || 0;
  req.session[score]=req.session[score] || 0;
  array=[];
  href="animals";
  req.session[attended]++;
  try{
  if(req.session[attended]==1)
  {
      name=req.query.f1;
      mobile=req.query.f2;
      console.log(name,mobile);
  }}
  catch(e){
  }
  request("https://opentdb.com/api.php?amount=1&category=27&difficulty=easy&type=multiple",function(error,response){
  var data=JSON.parse(response.body);
  var random=Math.floor(Math.random()*4)+1;
  data.results.forEach(quest => {
      var incorrect=quest.incorrect_answers;
      array.push(random);
      qu.push(quest.question);
      console.log(req.session[attended]);
      an.push(quest.correct_answer);
      res.render("computers",{dataout : quest,correct:random,incorrect:incorrect,href:href});
  });
})
  }
});
app.get("/animals",function(req,res){
  res.sendFile(path.join(__dirname +"/views/details.html"));
})
app.post("/answers",function(req,res){
  var out=array[0];
  var out1=req.body.opt;
  console.log(out,out1);
  if(out==out1)
  {
  req.session[score]++;
  res.render("correct",{href:href});
  }
  else
  {
  res.render("wrong",{href:href});
}
})
app.get("/results",function(req,res){
  var out="<link href=\"app/views/pages/users/demo.css\" rel=\"stylesheet\"><h2>QUIZ RESULTS</h2><div class=\"table-wrapper\"><table class=\"fl-table\"><thead><tr><th>QUESTION</th><th>ANSWERS</th></tr></thead><tbody>";
  for(var i=0;i<an.length;i++)
  {
    out+="<tr><td>";
    console.log(qu,an);
    var f6=qu[i];
    var q=an[i];
    out+=f6+"</td><td>"+q+"</td></tr>";
    if(i==an.length-1)
        {
        out+="<tbody></table></div><br><form action=\"/\"><button type=\"submit\" value=\"submit\">BACK TO HOME</button></form>";
        an=[];
        q=[];
        res.send(out);
        }
  }
})
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html')); 
});
app.listen(port, function() {
    console.log('Running the server on port ' + port); 
});