const db = require("../models");
const Order = db.order;

const Op = db.Sequelize.Op;

exports.getOrders = async (req, res) => {
  // Find all books
  const orders = await Order.findAll();
  res.status(200).json(orders);
  
};

exports.getOrderById = async (req, res) => {
  const bookId = req.params.id;
  const book = await Order.findOne({ where: { id: bookId } });
  res.status(200).json(book);
}

exports.createOrder = (req, res) => {
  console.log(res)//TODO:
}

exports.updateOrder = (req, res) => {
  console.log(res)//TODO:
}


exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  await Order.destroy({
    where: {
      id: orderId
    }
  });
  res.status(200).send("Deleted order " + orderId)
}