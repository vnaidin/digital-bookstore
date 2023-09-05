const db = require("../models");
const Order = db.order;

const Op = db.Sequelize.Op;

exports.getOrders = async (req, res) => {
  // Find all books
  const orders = await Order.findAll();
  res.status(200).json(orders);

};

exports.getOrderById = async (req, res) => {
  const orderId = req.params.id;
  const book = await Order.findOne({ where: { id: orderId } });
  res.status(200).json(book);
}

exports.createOrder = async (req, res) => {
  console.log(req.body)//TODO:
  const { name, surname, phoneNumber, email, city, address, branch, comments, year, category } = req.body;
  await Order.create(req.body)
    .then(order => res.status(200).json({ message: `Order ${order} created` }))
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