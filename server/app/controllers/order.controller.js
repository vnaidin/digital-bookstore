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
/* const sha1 = crypto.createHash('sha1');
  sha1.update(process.env.LIQ_PAY_PRIVATE + 'eyJwYXltZW50X2lkIjoyMzcyOTk5MTk2LCJhY3Rpb24iOiJwYXkiLCJzdGF0dXMiOiJzdWNjZXNzIiwidmVyc2lvbiI6MywidHlwZSI6ImJ1eSIsInBheXR5cGUiOiJwcml2YXQyNCIsInB1YmxpY19rZXkiOiJpOTM4ODYzMTE1ODEiLCJhY3FfaWQiOjQxNDk2Mywib3JkZXJfaWQiOiI0IiwibGlxcGF5X29yZGVyX2lkIjoiUVNZQ0RMSEoxNjk2MTkyNTE0NDgxNDk1IiwiZGVzY3JpcHRpb24iOiLRgtC10YHRgiIsInNlbmRlcl9waG9uZSI6IjM4MDk1NDI3OTA5MiIsInNlbmRlcl9jYXJkX21hc2syIjoiNDE0OTQzKjAwIiwic2VuZGVyX2NhcmRfYmFuayI6InBiIiwic2VuZGVyX2NhcmRfdHlwZSI6InZpc2EiLCJzZW5kZXJfY2FyZF9jb3VudHJ5Ijo4MDQsImFtb3VudCI6MS4wLCJjdXJyZW5jeSI6IlVBSCIsInNlbmRlcl9jb21taXNzaW9uIjowLjAsInJlY2VpdmVyX2NvbW1pc3Npb24iOjAuMDIsImFnZW50X2NvbW1pc3Npb24iOjAuMCwiYW1vdW50X2RlYml0IjoxLjAsImFtb3VudF9jcmVkaXQiOjEuMCwiY29tbWlzc2lvbl9kZWJpdCI6MC4wLCJjb21taXNzaW9uX2NyZWRpdCI6MC4wMiwiY3VycmVuY3lfZGViaXQiOiJVQUgiLCJjdXJyZW5jeV9jcmVkaXQiOiJVQUgiLCJzZW5kZXJfYm9udXMiOjAuMCwiYW1vdW50X2JvbnVzIjowLjAsImF1dGhjb2RlX2RlYml0IjoiMDIyMDUyIiwicnJuX2RlYml0IjoiMDA0NDU4NDg5MDc0IiwibXBpX2VjaSI6IjciLCJpc18zZHMiOmZhbHNlLCJsYW5ndWFnZSI6InVrIiwiY3JlYXRlX2RhdGUiOjE2OTYxOTI1MTQ0ODQsImVuZF9kYXRlIjoxNjk2MTkyNTE3MDA5LCJ0cmFuc2FjdGlvbl9pZCI6MjM3Mjk5OTE5Nn0=' + process.env.LIQ_PAY_PRIVATE);
  const sha1Sign = sha1.digest('base64');
  console.log(sha1Sign==='objIU8q+zqb6EoiAsdKkKffSzWs='); */
exports.updateOrderPaymentResult = async (req, res) => {
  console.log('params', req.params)
  console.log('body', req.body)
  const { signature, data } = req.body;
  // const encodedData = JSON.parse(Buffer.from(dataCopy, 'base64').toString('utf8'));
  console.log('data from liqpay', data)

  const sha1 = crypto.createHash('sha1');
  sha1.update(process.env.LIQ_PAY_PRIVATE + data + process.env.LIQ_PAY_PRIVATE);
  const sha1Sign = sha1.digest('base64');

  console.log('received sign', signature, 'local sign', sha1Sign, 'equal?', signature === sha1Sign)
  if (signature === sha1Sign) {
    await Order.update({ hasPaid: true }, {
      where: {
        id: JSON.parse(Buffer.from(dataCopy, 'base64').toString('utf8'))?.order_id
      }
    }).then(result => console.log('result', result))

  }
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