module.exports = (sequelize, Sequelize) => {
  const OrderPromoCode = sequelize.define("order_promo_codes", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    percent: {
      type: Sequelize.INTEGER
    },
    from: {
      type: Sequelize.DATEONLY
    },
    till: {
      type: Sequelize.DATEONLY
    }
  },);

  return OrderPromoCode;
};