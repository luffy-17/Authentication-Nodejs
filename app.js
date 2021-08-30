//jshint esversion:6
const express = require('express');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser : true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "ThisIsOurBigSecret";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });
const User = mongoose.model('User', userSchema);

app.get('/', function(req, res){
  res.render('home');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/register', function(req, res){
  res.render('register');
});

app.post('/register', function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render('secrets');
    }
  });
});

app.post('/login',function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username},function(err, founduser){
    if(err){
      console.log(err);
    }else{
      if (founduser){
        if (founduser.password === password){
          res.render('secrets');
        }
      }
    }
  });
});

app.listen(3000, function(){
  console.log("app listening on port 3000.");
});
