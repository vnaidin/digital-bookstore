const db = require("../models");
const Item = db.item;

const Op = db.Sequelize.Op;

exports.getBooks = async (req, res) => {
  // Find all books
  const books = await Item.findAll({ where: { itemType: 'book' } });
  res.status(200).json(books);
};

exports.getBookById = async (req, res) => {
  const itemId = req.params.id;
  const book = await Item.findOne({ where: { id: itemId } });
  res.status(200).json(book);

}

exports.createBook = async (req, res) => {
  const { pageCount, isReducedNow, price, reducedPrice, author, lang, annotation, isbn, title, tags, publisher, year, category } = req.body;
  await Item.create({
    pageCount, isReducedNow, price, reducedPrice, author, lang,
    annotation, isbn, title, tags, publisher, year, category, image: req.file.filename
  })
    .then(book => res.status(200).json({ message: `Book ${title} created` }))

}

exports.updateBook = async (req, res) => {
  const itemId = req.params.id;
  const { pageCount, isReducedNow, price, reducedPrice, author, lang, annotation, isbn, title, tags, publisher, year, category } = req.body;

  await Item.update({
    pageCount, isReducedNow, price, reducedPrice, author, lang,
    annotation, isbn, title, tags, publisher, year, category, image: req.file?.filename
  }, {
    where: {
      id: itemId
    }
  }).then(book => res.status(200).json({ message: `Book ${title} updated` }))
}


exports.deleteBook = async (req, res) => {
  const itemId = req.params.id;

  await Item.destroy({
    where: {
      id: itemId
    }
  });
  res.status(200).send("Deleted book " + itemId)
}

exports.getMerch = async (req, res) => {
  // Find all merch
  const merch = await Item.findAll({ where: { itemType: 'merch' } });
  res.status(200).json(merch);
};

exports.getMerchById = async (req, res) => {
  const itemId = req.params.id;
  const merch = await Item.findOne({ where: { id: itemId } });
  res.status(200).json(merch);

}

exports.createMerch = async (req, res) => {
  const { isReducedNow, price, reducedPrice, author, lang, annotation, title, tags, year, category } = req.body;
  await Item.create({
     isReducedNow, price, reducedPrice, author, lang,
    annotation, title, tags, year, category, image: req.file.filename
  })
    .then(merch => res.status(200).json({ message: `Merch ${title} created` }))

}

exports.updateMerch = async (req, res) => {
  const itemId = req.params.id;
  const {  isReducedNow, price, reducedPrice, author, lang, annotation, title, tags, year, category } = req.body;

  await Item.update({
     isReducedNow, price, reducedPrice, author, lang,
    annotation, title, tags, year, category, image: req.file?.filename
  }, {
    where: {
      id: itemId
    }
  }).then(merch => res.status(200).json({ message: `Merch ${title} updated` }))
}


exports.deleteMerch = async (req, res) => {
  const itemId = req.params.id;

  await Item.destroy({
    where: {
      id: itemId
    }
  });
  res.status(200).send("Deleted merch " + itemId)
}