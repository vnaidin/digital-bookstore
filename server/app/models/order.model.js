module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("orders", {
      userID: {
        type: Sequelize.INTEGER
      },
      orderedItemIDs:{
        type: Sequelize.STRING
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
        type: Sequelize.INTEGER
      },
      delMethodId:{
        type: Sequelize.INTEGER
      },
      region: {
        type: Sequelize.STRING
      },
      branch: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      comments:{
        type: Sequelize.STRING
      },
      status:{
        type: Sequelize.BOOLEAN// 1 true or 0 false
      },
      rejected:{
        type: Sequelize.BOOLEAN
      }
    });
  
    return Order;
  };