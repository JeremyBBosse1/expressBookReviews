const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
const isbn = req.params.isbn;
res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
let booksbyauthor = [];
let isbns = Object.keys(books);
isbns.forEach((isbn)=>{
    if (books[isbn]["author"] === req.params.author){
        booksbyauthor.push({"isbn": isbn,
        "title":books[isbn]["title"],
    "reviews": books[isbn]["reviews"]});
    }
});
res.send(JSON.stringify({booksbyauthor}, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn)=>{
        if (books[isbn]["title"] === req.params.title){
            booksbytitle.push({"isbn": isbn,
            "author":books[isbn]["author"],
        "reviews": books[isbn]["reviews"]});
        }
    });
    res.send(JSON.stringify({booksbytitle}, null, 4)); 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
res.send(books[isbn]["reviews"]);
});


// Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});
// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
// Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
    let booksbyauthor = [];
    let isbns = Object.keys(books);

    for (let isbn of isbns) {
        if (books[isbn]["author"] === req.params.author) {
            booksbyauthor.push({
                "isbn": isbn,
                "title": books[isbn]["title"],
                "reviews": books[isbn]["reviews"]
            });
        }
    }

    res.send(JSON.stringify({ booksbyauthor }, null, 4));
});
// Get all books based on title using async-await
public_users.get('/title/:title', async function (req, res) {
    let booksbytitle = [];
    let isbns = Object.keys(books);

    for (let isbn of isbns) {
        if (books[isbn]["title"] === req.params.title) {
            booksbytitle.push({
                "isbn": isbn,
                "author": books[isbn]["author"],
                "reviews": books[isbn]["reviews"]
            });
        }
    }

    res.send(JSON.stringify({ booksbytitle }, null, 4));
});
module.exports.general = public_users;
