const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
let Book = require('./models/book');
mongoose.connect('mongodb://mlabmongo:dbpassword1@ds157522.mlab.com:57522/heroku_4klvh6g6');

var books = require('./routes/books');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.send("Hello world"));
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
