module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define("items", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    itemType: {
      type: Sequelize.STRING
    },
    author: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    publisher: {
      type: Sequelize.STRING
    },
    coverType:{
      type: Sequelize.INTEGER
    },
    year: {
      type: Sequelize.INTEGER
    },
    isbn: {
      type: Sequelize.STRING
    },
    pageCount: {
      type: Sequelize.INTEGER
    },
    lang: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.INTEGER
    },
    reducedPrice: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    isReducedNow: {
      type: Sequelize.BOOLEAN
    },
    annotation: {
      type: Sequelize.STRING(2000)
    },
    category: {
      type: Sequelize.INTEGER
    },
    tags: {
      type: Sequelize.STRING
    }
  });

  return Item;
};