var express               = require('express'),
    mongoose              = require('mongoose'),
    expressSanitizer      = require('express-sanitizer'),
    bodyParser            = require('body-parser'),
    app                   = express();

mongoose.connect('mongodb://localhost/book_app');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());

var bookSchema = new mongoose.Schema({
  title:      String,
  author:     String,
  image:      String,
  body:       String,
  published:  {type: Date},
  rating:     String
});

var Book = mongoose.model('Book', bookSchema);

//ROOT ROUTE
app.get('/', function (req, res) {
  res.redirect('/books');
});

//INDEX ROUTE TO BOOKS
app.get('/books', function (req, res) {
  Book.find({}, function (err, foundBooks) {
    if(err){
      console.log(err);
    }else{
      res.render('index', {books: foundBooks})
    }
  });
});

//NEW ROUTE
app.get('/books/new', function (req, res) {
  res.render('new');
});

//CREATE ROUTE
app.post('/books', function (req, res) {
  req.body.book.body = req.sanitize(req.body.book.body)
  Book.create(req.body.book, function (err, newBook) {
    if(err){
      console.log(err);
      res.render('new');
    } else {
      res.redirect('/books');
    }
  });
});

app.listen(3000, function () {
  console.log('Server for learnig app with Express and MongoDB running');
});
