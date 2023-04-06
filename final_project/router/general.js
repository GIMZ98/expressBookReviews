const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let authenticatedUser = require("./auth_users.js").authenticatedUser;
let users = require("./auth_users.js").users;
const public_users = express.Router();


/* public_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username||password){
	if (isValid(username)){
	  if (authenticatedUser(username,password)){
	    return res.status(300).json({message: "Logged in succesfully."})		  
	  }
	  else{
	    return res.status(400).json({message: "Wrong password"});		  
	  }
	}
    else{
	  return res.status(300).json({message: "Invalid username"});
	}	
  }
  else{
    return res.status(300).json({message: "Error loggin in."});	  
  }
}); */


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!isValid(username)){
    users.push({"username":username, "password":password});
    return res.status(300).json(`user ${username} succesfully registered, now you can login.`);	  
  }
  else{
    return res.status(400).json(`user ${username} already exists.`);		 
  }
  

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  for (book in books){
    if (book === isbn){
      return res.status(300).json(books[book]);
    }
  }
  return res.status(300).json({message: "Invalid ISBN"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  authorBooks = []
  for (bookNum in books){
	  chBook = books[bookNum];
	  if (chBook.author === author){
		  authorBooks.push(chBook);
	  }
  }
  if (authorBooks.length > 0){
    return res.status(300).json(authorBooks);
  }
  else{
      return res.status(300).json(`The author ${author} doesn't have any books.`);
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  titleBooks = []
  for (bookNum in books){
	  chBook = books[bookNum];
	  if (chBook.title === title){
		  titleBooks.push(chBook);
	  }
  }
  if (titleBooks.length > 0){
    return res.status(300).json(titleBooks);
  }
  else{
      return res.status(300).json(`Any doesn't have the title ${title}.`);
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  book = books[isbn];
  
  if (book){
    return res.status(300).json(book.reviews);
  }
  else{
    return res.status(300).json(`The entered isbn ${title} doesn't exists.`);
  }
});

module.exports.general = public_users;
