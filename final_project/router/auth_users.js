const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let sameUsers = users.filter((user) => {
	  return user.username === username;
	});
	if (sameUsers.length>0){
	  return true;
	}
	else{
	  return false;
	}
}



const authenticatedUser = (username,password)=>{
  let authentiUsers = users.filter((user) => {
 	return (user.username===username && user.password===password);   
  })
  
  if (authentiUsers.length>0){
    return true;
  }
  else{
    return false;
  }
}




//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username||password){
	if (isValid(username)){
	  if (authenticatedUser(username,password)){
		  
	    let accessToken = jwt.sign({
	      data: password
	    }, 'access', { expiresIn: 60*60});

		req.session.authorization = {
			accessToken,username
		}
		
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
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.query.review;
  
  let chBook = books[isbn];
  reviewRecord = chBook["reviews"];
  if(review){
    reviewRecord[username] = review;
    return res.status(300).json({message: "Review succesfully added."});	
  }
  return res.status(300).json({message: "No review"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  
  let chBook = books[isbn];
  reviewRecord = chBook["reviews"];
  if(reviewRecord[username]){
    delete reviewRecord[username];
    return res.status(300).json({message: "Review succesfully deleted."});	
  }
  return res.status(300).json({message: "Don't have a review on this book."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;