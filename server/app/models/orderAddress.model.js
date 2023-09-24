module.exports = (sequelize, Sequelize) => {
  const OrderAddress = sequelize.define("order_address", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    delMethodId: {
      type: Sequelize.INTEGER
    },
    city: {
      type: Sequelize.STRING
    },
    street: {
      type: Sequelize.STRING
    },
    houseNr: {
      type: Sequelize.STRING
    },
    flatNr: {
      type: Sequelize.INTEGER
    },
    branch: {
      type: Sequelize.INTEGER
    }
  }, {
    timestamps: false
  });

  return OrderAddress;
};