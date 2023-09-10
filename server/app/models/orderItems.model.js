module.exports = (sequelize, Sequelize) => {
  const OrderItems = sequelize.define("order_items", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    itemId:{
      type:Sequelize.INTEGER
    },
    price: {
      type: Sequelize.INTEGER
    }
  },{
    timestamps: false
  });

  return OrderItems;
};