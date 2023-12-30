//jshint esversion:6

require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
}); 



const User = new mongoose.model("User", userSchema);

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req, res)=>{
    

    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
        const newUser = new User ({
            email: req.body.username,
            password: hash
        });
        // Store hash in your password DB.
        newUser.save().then(()=>{
            res.render("secrets");
        })
        .catch(error=>{
            console.error(error);
            res.redirect("/login");
        });
    });
  
});

app.post("/login", (req, res)=>{

    User.findOne({email: req.body.username}).then((result)=>{
        if(result){
            bcrypt.compare(req.body.password, result.password).then(function(result) {
                // result == true
                if(result){
                    res.render("secrets");
                } else {
                    res.redirect("/login")
                }
            });
        } else {
            res.redirect("/login")
        }
    })
})


app.listen(3000, ()=>{
    console.log("Server 3000 running...");
});

