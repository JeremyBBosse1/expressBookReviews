const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let validUsers = users.filter((user)=> {
    return user.username === username;
}); 
if (validUsers.length > 0){
    return true;
} else {
    return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
});
if (validUsers.length > 0) {
    return true;
}else{
    return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

    if (!username || !password) {
    return res.status(404).json({message: "Error logging in."});
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
        data: password
    }, 'access', {expiresIn: 60*60});
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in.");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
    let filtered_book = books[isbn];
    if (filtered_book){
        let review = req.params.review;
        let reviewer = req.session.authorization['username'];
        if (review) {
            filtered_book['reviews'][reviewer] = review;
            books[isbn]=filtered_book;
        }
        res.send(`The review for the book with ISBN ${isbn} has been updated.`);
    } else {
        res.send('Unable to find this ISBN!');
    }
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let filtered_review = books[isbn]["reviews"];
    if (filtered_review){
        let reviewer = req.session.authorization['username'];
        if (filtered_review) {
            delete filtered_review[reviewer];
        }
        res.send(`The review for the book with ISBN ${isbn} has been deleted.`);
    } else {
        res.send('Unable to find this ISBN!');
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
