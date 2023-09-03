module.exports = (sequelize, Sequelize) => {
    const Books = sequelize.define("books", {
      author: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      image:{
        type: Sequelize.STRING
      },
      publisher:{
        type:Sequelize.STRING
      },
      year:{
        type:Sequelize.INTEGER
      },
      isbn:{
        type:Sequelize.STRING
      },
      pageCount: {
        type: Sequelize.INTEGER
      },
      lang:{
        type:Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      reducedPrice:{
        type: Sequelize.INTEGER
      },
      isReducedNow:{
        type:Sequelize.BOOLEAN// 0 false and 1 true
      },
      annotation: {
        type: Sequelize.STRING(2000)
      }
    });
  
    return Books;
  };