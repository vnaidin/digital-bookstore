const db = require("../models");
const Order = db.order;
const Item = db.item;

const Op = db.Sequelize.Op;

exports.getOrders = async (req, res) => {
  // Find all orders
  const orders = await Order.findAll();
  res.status(200).json(orders);

};

exports.getOrderById = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findOne({ where: { id: orderId } });
  res.status(200).json(order);
}

exports.getOrdersOfUser = async (req, res) => {
  const id = req.params.userId;
  const order = await Order.findAll({ attributes: ['id', 'items', 'price', 'status'], where: { userId: id } });
  res.status(200).json(order);
}

exports.createOrder = async (req, res) => {
  console.log(req.body)//FIXME:
  const { name, surname, phoneNumber, email, city, address, branch, comments, year, category, status } = req.body;
  await Order.create(req.body)
    .then(order => res.status(200).json({ message: `New order created` }))
}

exports.updateOrder = async (req, res) => {
  const id = req.params.id;
  await Order.update({ ...req.body }, {
    where: {
      id: id
    }
  }).then(order => res.status(200).json({ message: `Order ${id} updated` }))
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