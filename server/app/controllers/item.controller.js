const db = require("../models");
const Item = db.item;
const ItemsManagement = db.itemsManagement;

const Op = db.Sequelize.Op;

exports.getBooks = async (req, res) => {
  // Find all books
  const { cat, page, order, priceRange, author, publisher, language } = req.query;
  const paginationQuery = {
    order: order ? [order == 0 ? db.sequelize.random() : [...order.split(",")]] : null,
    where: {
      [Op.and]: [
        { itemType: 'book' },
        {
          category: cat ? {
            [Op.or]: [
              { [Op.startsWith]: `${cat},` },
              { [Op.endsWith]: `,${cat}` },
              { [Op.substring]: `,${cat},` },
            ]
          } : { [Op.not]: null }
        },
        { price: priceRange ? { [Op.between]: priceRange?.split(',').map(x => +x) } : { [Op.not]: null } },
        { author: author ? { [Op.substring]: author } : { [Op.not]: null } },
        { publisher: publisher ? publisher : { [Op.not]: null } },
        { lang: language ? language : { [Op.not]: null } }
      ]
    },
    offset: page > 0 ? 12 * page : 0,// page n increments
    limit: page ? 12 : null,// show per page
    include: { model: ItemsManagement, attributes: ['amount', 'comments'] }
  };
  const attributesQuery = {
    /* attributes: ['author', 'publisher', "price"], */ where: {
      [Op.and]: [
        { itemType: 'book' },
        {
          category: cat ? {
            [Op.or]: [
              { [Op.startsWith]: `${cat},` },
              { [Op.endsWith]: `,${cat}` },
              { [Op.substring]: `,${cat},` },
            ]
          } : { [Op.not]: null }
        },
        { price: priceRange ? { [Op.between]: priceRange?.split(',').map(x => +x) } : { [Op.not]: null } },
        { author: author ? { [Op.substring]: author }  : { [Op.not]: null } },
        { publisher: publisher ? publisher : { [Op.not]: null } }
      ]
    }
  };
  const { count, rows } = await Item.findAndCountAll(paginationQuery);
  const authors = await Item.findAll(attributesQuery);
  const priceValues = authors.map(({ price }) => +price);
  res.status(200).json({
    books: rows,
    total: count,
    authors: Array.from(new Set(authors.map(({ author }) => author))),
    publishers: Array.from(new Set(authors.map(({ publisher }) => publisher))),
    minMaxPrice: [Math.min(...priceValues), Math.max(...priceValues)]
  });

};

exports.getBookById = async (req, res) => {
  const itemId = req.params.id;
  const book = await Item.findOne({ where: { id: itemId }, include: { model: ItemsManagement, attributes: ['amount', 'comments'] } });
  res.status(200).json(book);

}

exports.createBook = async (req, res) => {
  const { pageCount, isReducedNow, price, reducedPrice, author, coverType, lang, annotation, isbn, title, tags, publisher, year, category, amount, comments } = req.body;
  await Item.create({
    itemType: 'book',
    pageCount, isReducedNow, price, reducedPrice, author, lang, coverType,
    annotation, isbn, title, tags, publisher, year, category,
    image: req.files['image'] ? req.files['image'][0].filename : null,
    covers: req.files['cover_front'] && req.files['cover_back'] ? `${req.files['cover_front'][0].filename || ''},${req.files['cover_back'][0].filename || ''}` : null,
    item_management: { amount, comments }
  }, { include: [ItemsManagement] })
    .then(book => res.status(200).json({ message: `Book ${title} created` }))

}

exports.updateBook = async (req, res) => {
  const id = req.params.id;
  const { pageCount, isReducedNow, price, reducedPrice, author, lang, annotation,
    isbn, title, tags, publisher, year, category, amount, comments, coverType, image, covers } = req.body;
  try {

    const result = await db.sequelize.transaction(async (t) => {
      const book = await Item.update({
        pageCount, isReducedNow, price, reducedPrice, author, lang,
        annotation, isbn, title, tags, publisher, year, category, coverType,
        image: req.files['image'] ? req.files['image'][0].filename : image,
        covers: req.files['cover_front'] && req.files['cover_back'] ? `${req.files['cover_front'][0].filename || ''},${req.files['cover_back'][0].filename || ''}` : covers,
      }, {
        where: {
          id: id
        }
      }, { transaction: t })

      await ItemsManagement.update({ amount, comments }, { where: { itemId: id } }, { transaction: t })

      return book;

    });
    // If the execution reaches this line, the transaction has been committed successfully
    // `result` is whatever was returned from the transaction callback (the `user`, in this case)
    res.status(200).json({ message: `Book ${author}-${title} updated` })

  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Server Error", error: error })
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back automatically by Sequelize!

  }
}

exports.deleteBook = async (req, res) => {
  const itemId = req.params.id;

  await Item.destroy({
    where: {
      id: itemId
    }
  });
  res.status(200).json({ message: "Deleted book " + itemId });
}


exports.getMerch = async (req, res) => {
  // Find all merch
  const { page, order, priceRange } = req.query;
  const paginationQuery = {
    order: order ? [order == 0 ? db.sequelize.random() : [...order.split(",")]] : null,
    where: {
      [Op.and]: [
        { itemType: 'merch' },
        { price: priceRange ? { [Op.between]: priceRange?.split(',').map(x => +x) } : { [Op.not]: null } },
      ]
    },
    offset: page > 0 ? 12 * page : 0,// page n increments
    limit: page ? 12 : null,// show per page
    include: { model: ItemsManagement, attributes: ['amount', 'comments'] }
  };
  const attributesQuery = {
  /* attributes: ['author', 'publisher', "price"], */ where: {
      [Op.and]: [
        { itemType: 'merch' },
        { price: priceRange ? { [Op.between]: priceRange?.split(',').map(x => +x) } : { [Op.not]: null } },
      ]
    }
  };
  const { count, rows } = await Item.findAndCountAll(paginationQuery);
  const authors = await Item.findAll(attributesQuery);
  const priceValues = authors.map(({ price }) => +price)
  res.status(200).json({
    merch: rows,
    total: count,
    minMaxPrice: [Math.min(...priceValues), Math.max(...priceValues)]
  });
};

exports.getMerchById = async (req, res) => {
  const itemId = req.params.id;
  const merch = await Item.findOne({ where: { id: itemId } });
  res.status(200).json(merch);

}

exports.createMerch = async (req, res) => {
  const { isReducedNow, price, reducedPrice, annotation, title, tags, amount, comments } = req.body;
  await Item.create({
    itemType: 'merch',
    isReducedNow, price, reducedPrice,
    annotation, title, tags,
    image: req.file ? req.file.filename : null,
    item_management: { amount, comments }
  }, { include: [ItemsManagement] })
    .then(merch => res.status(200).json({ message: `Merch ${title} created` }))

}

exports.updateMerch = async (req, res) => {//TODO:
  const id = req.params.id;
  const { isReducedNow, price, reducedPrice, annotation, title, tags, amount, comments, image } = req.body;

  try {

    const result = await db.sequelize.transaction(async (t) => {
      const merch = await Item.update({
        isReducedNow, price, reducedPrice,
        annotation, title, tags, amount, comments,
        image: req.file ? req.file.filename : image,
      }, {
        where: {
          id: id
        }
      }, { transaction: t })

      await ItemsManagement.update({ amount, comments }, { where: { itemId: id } }, { transaction: t })

      return merch;

    });
    // If the execution reaches this line, the transaction has been committed successfully
    // `result` is whatever was returned from the transaction callback (the `user`, in this case)
    res.status(200).json({ message: `Merch ${title} updated` })

  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Server Error", error: error })
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back automatically by Sequelize!

  }
}


exports.deleteMerch = async (req, res) => {
  const itemId = req.params.id;

  await Item.destroy({
    where: {
      id: itemId
    }
  });
  res.status(200).json({ message: "Deleted merch " + itemId });
}

/**
 *  Common for both book and merch, search and getting by list of ID's
 */
exports.getItemsById = async (req, res) => {
  const itemId = req.params.id;
  const items = await Item.findOne({
    where: {
      id: itemId
    }
  });
  res.status(200).json(items);
}

exports.searchBooks = async (req, res) => {
  // console.log(req?.query)
  const result = await Item.findAll({
    where: {
      itemType: 'book',
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${req.query.search}%`
          }
        },
        {
          author: {
            [Op.like]: `%${req.query.search}%`
          }
        },
        {
          publisher: {
            [Op.like]: `%${req.query.search}%`
          }
        }
      ]
    }, include: { model: ItemsManagement, attributes: ['amount', 'comments'] }
  })
  res.status(200).json({ books: result })
}

exports.searchMerch = async (req, res) => {
  // console.log(req?.query)
  const result = await Item.findAll({
    where: {
      itemType: 'merch',
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${req.query.search}%`
          }
        },
      ]
    }, include: { model: ItemsManagement, attributes: ['amount', 'comments'] }
  })
  res.status(200).json({ merch: result })
}