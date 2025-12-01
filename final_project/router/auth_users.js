const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username exists in users[]
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

// Authenticate login credentials
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// LOGIN route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user exists
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  // Create JWT token
  const accessToken = jwt.sign(
    { username },
    "secret_key",       // Use env variable in real apps
    { expiresIn: "1h" } // Expiry time
  );

  // Store session token
  req.session.authorization = { accessToken, username };

  return res.status(200).json({
    message: "Login successful",
    token: accessToken
  });
});

// ADD or UPDATE review route
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  // Check if user is logged in
  if (!req.session.authorization || !req.session.authorization.username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  const username = req.session.authorization.username;

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check review validity
  if (!review) {
    return res.status(400).json({ message: "Review cannot be empty" });
  }

  // Add or update review
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
