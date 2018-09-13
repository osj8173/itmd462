let mongoose = require("mongoose");
let Book = require('../models/book');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let http = require('http');

let server = http.createServer(app);
let should = chai.should();

chai.use(chaiHttp);

describe('Books', () => {
  before(done => {
    // Start the server
    server.listen(0);
    done();
  });

  beforeEach(done => { 
    // Before each test we empty the database
    Book.remove({}, (err) => { 
      done();         
    });     
  });

  after(done => {
  // After all tests we close the server and disconnect from the database
  server.close();
  mongoose.disconnect();
  done();
  });

  describe('GET /api/books', () => {
    it('it should GET all the books', (done) => {
      let expectedBook = new Book({
        title: "The Great Gatsby",
        author: "F Scott fitzerald",
        numPages: 100
      });

      expectedBook.save(function (err, book) {
          if (err) return console.error(err);
          chai.request(server)
              .get('/api/books')
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(1);
                done();
              });
      });
    });
  });

  describe('POST /api/books', () => {
    it('it should add a new producs', (done) => {
      let expectedBook = new Book({
        title: "The Great Gatsby",
        author: "F Scott fitzerald",
        numPages: 100
      });

      chai.request(server)
          .post('/api/books')
          .send(expectedBook)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property("id");
            res.body.should.have.property("title").eql(expectedBook.title);
            res.body.should.have.property("author").eql(expectedBook.author);
            res.body.should.have.property("numPages").eql(expectedBook.numPages);
            done();
          });
    });
  }); 


  describe('GET /api/books/:id', () => {
    it('it should get an existing book', (done) => {
      let existingBook = new Book({
        title: "The Great Gatsby",
        author: "F Scott fitzerald",
        numPages: 100
      });

      existingBook.save(function (err, book) {
        if (err) return console.error(err);
        chai.request(server)
          .get('/api/books/' + book.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property("id");
            res.body.should.have.property("title").eql(existingBook.title);
            res.body.should.have.property("author").eql(existingBook.author);
            res.body.should.have.property("numPages").eql(existingBook.numPages);
            done();
          });
      });
    });
  });

  describe('PUT /api/books/:id', () => {
    it('it should update an existing book', (done) => {
      let existingBook = new Book({
        title: "The Great Gatsby",
        author: "F Scott fitzerald",
        numPages: 100
      });
      let expectedBook = new Book({
        title: existingBook.title,
        author: "F. Scott Fitzerald",
        numPages: existingBook.numPages
      });

      existingBook.save(function (err, book) {
        if (err) return console.error(err);
        chai.request(server)
          .put('/api/books/' + book.id)
          .send(expectedBook)
          .end((err, res) => {
            res.should.have.status(204);
            res.body.should.be.empty;

            Book.findOne({_id: existingBook.id}, function(err, foundBook) {
              if (err) return console.error(err);
              foundBook.should.have.property("title").eql(expectedBook.title);
              foundBook.should.have.property("author").eql(expectedBook.author);
              foundBook.should.have.property("numPages").eql(expectedBook.numPages);
              done();
            })
          });
      });
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('it should delete an existing book', (done) => {
      let existingBook = new Book({
        title: "The Great Gatsby",
        author: "F Scott fitzerald",
        numPages: 100
      });

      existingBook.save(function (err, book) {
        if (err) return console.error(err);
        chai.request(server)
          .delete('/api/books/' + book.id)
          .end((err, res) => {
            res.should.have.status(204);
            res.body.should.be.empty;

            Book.findOne({_id: existingBook.id}, function(err, book) {
              if (err) return console.error(err);
              should.not.exist(book);
              done();
            })
          });
      });
    });
  });

});