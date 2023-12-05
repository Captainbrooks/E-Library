const express = require('express');
const app = express();
require('dotenv').config();
const ejs = require('ejs');
const mongoose = require('mongoose');
const User = require('./model/user');
const cookieParser=require("cookie-parser");
const authRoute=require("./routes/authRoute");
const {requireAuth}=require("./utils/utils");
const bodyparser = require('body-parser');


// middlewares
app.use(express.json());
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authRoute);

app.use(bodyparser.json());


// Setting the view engine
app.set('view engine', 'ejs');


// Database connection

const connectionString = process.env.MONGODB_CONNECTION_STRING;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((e) => {
    console.log(e);
  });