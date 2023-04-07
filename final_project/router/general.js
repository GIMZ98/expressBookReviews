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

// Promise function for get all books.
function getBooks(){
  return new Promise((resolve,reject)=>{
	let bookList = Object.values(books) 
    if (bookList.length>0){
	  resolve(bookList);
	}
	else{
	  reject(new Error("No books!"))
	}
  })
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getBooks()
  .then(data => {
    return res.status(300).json(data);  
  })
  .catch(error => {
    return res.status(404).json({message:error.message}) 
  });

});

// Promise function for return a book based on isbn.
function getBook(isbn){
  return new Promise((resolve,reject)=>{
	let Book;
	for (let isbN in Object.keys(books)){
      if (isbN === isbn){
		Book = books[isbn];
      }
    }
	if (Book){
	  resolve(Book);		
	}
	else{
	  reject(new Error(`No book found for that isbn ${isbn}.`));
	}
  })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBook(isbn)
  .then(data => {
    return res.status(300).json(data);  
  })
  .catch(error => {
    return res.status(404).json({message:error.message}) 
  });
});
  
 
 
  
// Promise function for return books based on author.
function getAuthorBooks(author){
  return new Promise((resolve,reject)=>{
	let bookList = Object.values(books); 
	let authorBooks = [];
	for (isbN in bookList){
	  book = bookList[isbN];
      if (book["author"] === author){
		authorBooks.push(book);
      }
    }
	if (authorBooks.length>0){
	  resolve(authorBooks);		
	}
	else{
	  reject(new Error(`The author ${author} doesn't have any books.`));
	}
  })
}  
 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getAuthorBooks(author)
  .then(data => {
    return res.status(300).json(data);
  })
  .catch(error => {
    return res.status(404).json({message:error.message});
  });
});


// Promise function for return books based on title.
function getTitleBooks(title){
  return new Promise((resolve,reject)=>{
	let bookList = Object.values(books); 
	let titleBooks = [];
	for (isbN in bookList){
	  book = bookList[isbN];
      if (book["title"] === title){
		titleBooks.push(book);
      }
    }
	if (titleBooks.length>0){
	  resolve(titleBooks);		
	}
	else{
	  reject(new Error(`No book has the title ${title}.`));
	}
  })
} 

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getTitleBooks(title)
  .then(data => {
    return res.status(300).json(data);
  })
  .catch(error => {
    return res.status(404).json({message:error.message});
  });
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
