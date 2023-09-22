module.exports = (sequelize, Sequelize) => {
  const ItemManagement = sequelize.define("item_management", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amount: { // left in the system
      type: Sequelize.INTEGER
    },
    purchasesCount: {// how many times the book was bought
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    comments: {
      type: Sequelize.STRING
    }
  });

  return ItemManagement;
};