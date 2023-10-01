const db = require("../models");
const nodemailer = require('../../mailSender');
const crypto = require('crypto');
const Order = db.order;
const ItemsManagement = db.itemsManagement;
const OrderItems = db.orderItems;
const OrderAddress = db.orderAddress;

const Op = db.Sequelize.Op;

exports.getOrders = async (req, res) => {
  // Find all orders
  const { status } = req.query;

  const orders = await Order.findAll({
    where: {
      [Op.and]: [
        { status: status ? status : { [Op.not]: null } },
      ]
    }, include: [OrderItems, OrderAddress]
  });
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
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    subject: 'Ваше замовлення',
    template: 'orderStatusChange',
    context: {
      address: req.headers.origin,
    }
  };
  const MAILING_STATUSES = { 2: { title: 'Доставка' }, 3: { title: 'Завершений' }, 4: { title: 'Скасований' } };
  const id = req.params.id;
  const { status, ttn } = req.body;
  await Order.update({ status, ttn }, {
    where: {
      id: id
    }
  }).then(async () => {
    const updatedOrder = await Order.findOne({ where: { id: id }, include: [OrderItems, OrderAddress] })
    res.status(200).json({ message: `Order ${id} updated` })
    if (status > 1 && status < 5) {
      nodemailer.transporter.sendMail({
        ...mailOptions, to: updatedOrder.email,
        context: {
          ...mailOptions.context, orderPage: req.headers.origin + '/order/' + id,
          status: MAILING_STATUSES[+updatedOrder.status].title,
          ttn: ttn,
          nOfItems: updatedOrder.order_items.length
        }
      }, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
  })
}

exports.updateOrderPaymentResult = async (req, res) => {
  console.log('params', req.params)
  console.log('body', req.body)
  const { signature, data } = req.body;
  const encodedData = Buffer.from(data, 'base64').toString('utf8');
  console.log('data from liqpay', encodedData)

  const sha1 = crypto.createHash('sha1');
  sha1.update(process.env.LIQ_PAY_PRIVATE + data + process.env.LIQ_PAY_PRIVATE);
  const sha1Sign = sha1.digest('base64');

  const localEncodedSignature = Buffer.from(sha1Sign, 'utf8').toString('base64')
  console.log('received sign', signature, 'local sign', localEncodedSignature, 'equal?', signature === localEncodedSignature)
  await Order.update({ hasPaid: true }, {
    where: {
      id: encodedData.order_id
    }
  }).then(result => console.log('result', result))
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

exports.searchOrder = async (req, res) => {
  const result = await Order.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${req.query.search}%`
          }
        },
        {
          surname: {
            [Op.like]: `%${req.query.search}%`
          }
        },
        {
          phoneNumber: {
            [Op.like]: `%${req.query.search}%`
          }
        }
      ]
    }, include: [OrderItems, OrderAddress]
  })
  res.status(200).json(result)
}