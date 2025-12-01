const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    res.send(JSON.stringify(books,null,11));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let bookByAuthor = [];

  let bookKeys = Object.keys(books);

  bookKeys.forEach((key) => {
    if(books[key].author === author) {
        bookByAuthor.push(books[key]);
    }
  });

    if (bookByAuthor.length === 0) {
    return res.status(404).json({ message: "No books found for this author" });
  }

  return res.status(200).json(bookByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let bookByTitle = [];

  let bookKeys = Object.keys(books);

  bookKeys.forEach((key) => {
    if(books[key].title === title) {
        bookByTitle.push(books[key]);
    }
  });

    if (bookByTitle.length === 0) {
    return res.status(404).json({ message: "No books found for this title" });
  }

  return res.status(200).json(bookByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Get reviews for this book
  const reviews = books[isbn].reviews;

  return res.status(200).json(reviews);
});

module.exports.general = public_users;
