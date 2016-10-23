var express               = require('express'),
    mongoose              = require('mongoose'),
    bodyParser            = require('body-parser'),
    expressSanitizer      = require('express-sanitizer'),
    methodOverride        = require('method-override'),
    app                   = express();

mongoose.connect('mongodb://localhost/book_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

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

//SHOW ROUTE
app.get('/books/:id', function (req, res) {
  Book.findById(req.params.id, function (err, foundBook) {
    if(err){
      console.log('we have an error');
    } else {
      res.render('show', {book: foundBook})
    }
  });
});

//EDIT ROUTE
app.get('/books/:id/edit', function (req, res) {
  Book.findById(req.params.id, function (err, foundBook) {
    if(err){
      console.log('error in the edit route');
    } else {
      res.render('edit', {book: foundBook})
    }
  });
});

//UPDATE ROUTE
app.put('/books/:id', function (req, res) {
  req.body.book.body = req.sanitize(req.body.book.body)
  Book.findByIdAndUpdate(req.params.id, req.body.book, function (err, foundBook) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/books/' + req.params.id)
    }
  });
});

//DELETE ROUTE
app.delete('/books/:id', function (req, res) {
  Book.findByIdAndRemove(req.params.id, function (err) {
    if(err){
      console.log('zapato')
    } else {
      res.redirect('/books');
    }
  })
})

app.listen(3000, function () {
  console.log('Server for learnig app with Express and MongoDB running');
});
