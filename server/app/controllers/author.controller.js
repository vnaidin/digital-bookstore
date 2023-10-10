const db = require("../models");
const Author = db.author;

const Op = db.Sequelize.Op;

exports.getAuthors = async (req, res) => {
  // Find all authors
  const { page } = req.query
  const paginationQuery = {
    offset: page > 0 ? 12 * page : 0,// page n increments
    limit: page ? 12 : null,// show per page
  };
  const { count, rows } = await Author.findAndCountAll(paginationQuery);
  res.status(200).json({
    authors: rows,
    total: count,
  });

};

exports.getAuthorById = async (req, res) => {
  const itemId = req.params.id;
  const book = await Author.findOne({ where: { id: itemId } });
  res.status(200).json(book);

}

exports.createAuthor = async (req, res) => {
  const { fullName, pseudo, image, birthday, death, bio } = req.body;
  await Author.create({
    fullName, pseudo, birthday, death, bio, image: req.file ? req.file.filename : null,
  })
    .then(book => res.status(200).json({ message: `${fullName} created` }))

}

exports.updateAuthor = async (req, res) => {
  const id = req.params.id;
  const { fullName, pseudo, image, birthday, death, bio } = req.body;

  await Author.update({ ...req.body, image: req.file?.filename }, {
    where: {
      id: id
    }
  }).then(order => res.status(200).json({ message: `Author with id:${id} updated` }))
}


exports.deleteAuthor = async (req, res) => {
  const authorId = req.params.id;

  await Author.destroy({
    where: {
      id: authorId
    }
  });
  res.status(200).json({ message: "Deleted author " + authorId });
}
