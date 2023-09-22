const db = require("../models");
const News = db.news;

const Op = db.Sequelize.Op;

exports.getNews = async (req, res) => {
  // Find all books
  const { page } = req.query
  const paginationQuery = {
    offset: page > 0 ? 12 * page : 0,// page n increments
    limit: page ? 12 : null,// show per page
  };
  const { count, rows } = await News.findAndCountAll(paginationQuery);
  res.status(200).json({
    news: rows,
    total: count,
  });

};

exports.getNewsById = async (req, res) => {
  const itemId = req.params.id;
  const book = await News.findOne({ where: { id: itemId } });
  res.status(200).json(book);

}

exports.createNews = async (req, res) => {
  const { author, text, title, publisher, showImage } = req.body;
  await News.create({
    author, showImage,
    text, title, publisher, image: req.file ? req.file.filename : null,
  })
    .then(book => res.status(200).json({ message: `${title} created` }))

}

exports.updateNews = async (req, res) => {
  const id = req.params.id;
  const { author, lang, text, title, publisher } = req.body;

  await News.update({ ...req.body, image: req.file?.filename }, {
    where: {
      id: id
    }
  }).then(order => res.status(200).json({ message: `News with id:${id} updated` }))
}


exports.deleteNews = async (req, res) => {
  const itemId = req.params.id;

  await News.destroy({
    where: {
      id: itemId
    }
  });
  res.status(200).json({ message: "Deleted new " + itemId });
}
