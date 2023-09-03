const db = require("../models");
const Book = db.book;

const Op = db.Sequelize.Op;

exports.getBooks = async (req, res) => {
  // Find all books
  const books = await Book.findAll();
  res.status(200).json(books);
  
};

exports.getBookById = async (req, res) => {
  const bookId = req.params.id;
  const book = await Book.findOne({ where: { id: bookId } });
  res.status(200).json(book);

}

exports.createBook = (req, res) => {
  console.log(res)//TODO:
}

exports.updateBook = (req, res) => {
  console.log(res)//TODO:
}


exports.deleteBook = async (req, res) => {
  const bookId = req.params.id;

  await Book.destroy({
    where: {
      id: bookId
    }
  });
  res.status(200).send("Deleted book " + bookId)
}