module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("orders", {
    userId: {
      type: Sequelize.INTEGER
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
    receiverName: {
      type: Sequelize.STRING
    },
    receiverSurname: {
      type: Sequelize.STRING
    },
    receiverPhoneNumber: {
      type: Sequelize.STRING
    },
    comments: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.INTEGER
    },
    paymentMethodId: {
      type: Sequelize.INTEGER
    },
    hasPaid:{
      type: Sequelize.BOOLEAN
    },
    ttn: {
      type: Sequelize.STRING
    },
    promocode: {
      type: Sequelize.STRING
    }
  });

  return Order;
};