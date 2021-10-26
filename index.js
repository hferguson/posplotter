const express = require('express');
const cors = require("cors");
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/api');

require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;  // API will run on port 5000 or whatever we put in .env

// Connect to the database
// Todo: Understand the connect params a bit better.  Not sure what useNewUrlParser does

const dbugAuthUrl = process.env.DB; 
//const dbugAuthUrl =  'mongodb://localhost:27017/bylawdb';
console.log(`Connecting to db with DB URL ${dbugAuthUrl}`);
console.log(`Auth db ${process.env.dbAuth}`);
console.log(`Auth User ${process.env.dbUser}`);

// small note on strings in .env: remove the quotes.  Bad idea. that's what cost me 2 hrs today
mongoose
  .connect(dbugAuthUrl, {auth:{
    username: process.env.dbUser,
    password: process.env.dbPwd
}})
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

// Since mongoose's Promise is deprecated, we override it with Node's Promise
// Todo: Understand the above sentence better
mongoose.Promise = global.Promise;

/**
 * This app represents the stub of our API.  As such want to set it up to allow cross-origin
 * requests. 
 */
// This is instead of explicitly defining the CORS headers.
app.use(cors());

// We got bodyParser from the original tutorial. NodeJS is reporting this as deprecated.
// TODO: Look for an alternative
app.use(express.json());

// The api.js defines all the responses to our requests
app.use('/api', routes);

// Anything that doesn't fit the above will give an error
// Modified to provide API error. This is the final so we don't
// need to call next
app.use((err, req, res, next) => {
  console.log("This request not valid");
  console.log(req.url);
  //console.log(err);
  const respMsg = err.message;
  if (err.hasOwnProperty('custom_msg'))
    respMsg = err.custom_msg;
  res.status(500).send({error: respMsg});
  //next();
});


/**
 * Begin listening for requests
 */
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
