module.exports = (sequelize, Sequelize) => {
  const News = sequelize.define("news", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    author: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING
    },
    category: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    showImage: {
      type: Sequelize.BOOLEAN
    },
    publisher: {
      type: Sequelize.STRING
    },
    text: {
      type: Sequelize.STRING(5000)
    }
  });

  return News;
};