module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("orders", {
    userId: {
      type: Sequelize.INTEGER
    },
    items: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.INTEGER
    },
    email: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    surname: {
      type: Sequelize.STRING
    },
    phoneNumber: {
      type: Sequelize.STRING
    },
    delMethod: {
      type: Sequelize.INTEGER
    },
    city: {
      type: Sequelize.STRING
    },
    branch: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    comments: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.INTEGER// new, inProgress, finished
    },
    rejected: {
      type: Sequelize.BOOLEAN
    }
  });

  return Order;
};