//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

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

const secret = "iAmAGod.";

userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

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
    
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().then(()=>{
        res.render("secrets");
    })
    .catch(error=>{
        console.error(error);
    });
});

app.post("/login", (req, res)=>{

    User.findOne({email: req.body.username}).then((result)=>{
        if(result){
            if(result.password === req.body.password){
                res.render("secrets");
            } else {
                res.redirect("/login")
            }
        } else {
            res.redirect("/login")
        }
    })
})


app.listen(3000, ()=>{
    console.log("Server 3000 running...");
});

