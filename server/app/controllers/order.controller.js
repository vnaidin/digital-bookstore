const db = require("../models");
const nodemailer = require('../../mailSender');
const Order = db.order;
// const Item = db.item;
const ItemsManagement = db.itemsManagement;
const OrderItems = db.orderItems;
const OrderAddress = db.orderAddress;

const Op = db.Sequelize.Op;

exports.getOrders = async (req, res) => {
  // Find all orders
  const orders = await Order.findAll({ include: [OrderItems, OrderAddress] });
  res.status(200).json(orders);

};

exports.getOrderById = async (req, res) => {
  const orderId = req.params.id;
  /* const order = await Order.findOne({ where: { id: orderId } });
  res.status(200).json(order); */
  const order = await Order.findOne({ where: { id: orderId }, include: [OrderItems, OrderAddress] });
  res.status(200).json([order]);
}

exports.getOrdersOfUser = async (req, res) => {
  const id = req.params.userId;
  const order = await Order.findAll({ where: { userId: id }, include: [OrderItems, OrderAddress] });
  res.status(200).json(order);
}

exports.createOrder = async (req, res) => {
  const { userId, name, surname, phoneNumber, receiverName, receiverSurname, receiverPhoneNumber,
    email, order_address, comments, year, category, status, rejected, order_items, paymentMethodId, price } = req.body;
  console.log(order_items)
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Ваше замовлення',
    template: 'orderSuccess',
    context: {
      address: req.headers.origin,
      name,
      nOfItems: order_items.length,
      sum: price
      //TODO: get items by id from order items in future
    }
  };


  const itemsAmountById = order_items.map(({ itemId }) => itemId).reduce((prev, cur) => {
    // eslint-disable-next-line no-param-reassign
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});

  try {

    const result = await db.sequelize.transaction(async (t) => {
      // create order
      const order = await Order.create({
        userId, name, surname, phoneNumber, receiverName, receiverSurname, receiverPhoneNumber,
        email, order_address, comments, year, category, status, rejected, order_items, paymentMethodId, price
      },
        {
          include: [OrderItems, OrderAddress]
        }, { transaction: t })
      // deduct the amount of books, and count how many was sold
      Promise.all(Object.entries(itemsAmountById).map(async ([itemId, n]) => {
        await ItemsManagement.increment({ amount: -n, purchasesCount: n }, { where: { itemId } }, { transaction: t })
      }))

      return order;

    });
    // If the execution reaches this line, the transaction has been committed successfully
    // `result` is whatever was returned from the transaction callback (the `user`, in this case)
    res.status(200).json({ message: `New order created`, id: result.id })
    //TODO: send email
    nodemailer.transporter.sendMail({
      ...mailOptions,
      context: { ...mailOptions.context, orderPage: req.headers.origin + '/order/' + result.id }
    }, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  } catch (error) {
    // console.error(error)
    res.status(500).send({ message: "Server Error" })
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back automatically by Sequelize!

  }
}

exports.updateOrder = async (req, res) => {
  const id = req.params.id;
  await Order.update({ ...req.body }, {
    where: {
      id: id
    }
  }).then(order => res.status(200).json({ message: `Order ${id} updated` }))
}

exports.deleteOrder = async (req, res) => {//TODO: do we need it?
  const orderId = req.params.id;
  await Order.destroy({
    where: {
      id: orderId
    }
  });
  res.status(200).json({ message: "Deleted order " + orderId })
}