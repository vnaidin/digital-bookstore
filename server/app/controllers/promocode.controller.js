const db = require("../models");
const PromoCode = db.orderPromoCode;

const Op = db.Sequelize.Op;

exports.getAllPromocodes = async (req, res) => {
  const promocodes = await PromoCode.findAll();
  // using string to hide the raw promocodes
  res.status(200).json(Buffer.from(JSON.stringify(promocodes)).toString('base64'));
};

exports.createPromo = async (req, res) => {
  const { name, percent, from, till } = req.body;

  await PromoCode.create({
    name, percent, from: new Date(from), till: new Date(till)
  }).then(user => res.status(200).json({ message: `PromoCode ${name} created` }))
}


exports.deletePromo = async (req, res) => {
  const promoId = req.params.id;

  await PromoCode.destroy({
    where: {
      id: promoId
    }
  });
  res.status(200).json({ message: "Deleted PromoCode " + promoId })
}