module.exports = (sequelize, Sequelize) => {
  const Author = sequelize.define("authors", {
    fullName: {
      type: Sequelize.STRING
    },
    pseudo: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    birthday: {
      type: Sequelize.STRING
    },
    death: {
      type: Sequelize.STRING
    },
    bio: {
      type: Sequelize.STRING
    }
  });

  return Author;
};