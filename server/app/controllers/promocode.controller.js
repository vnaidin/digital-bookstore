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

exports.getPromoByName = async (req, res) => {
  const promocode = await PromoCode.findOne({
    where: {
      name: String(req.query.name).toUpperCase()
    }
  });
  res.status(200).json(promocode);

}


exports.deletePromo = async (req, res) => {
  const promoName = req.params.name;

  await PromoCode.destroy({
    where: {
      name: String(promoName).toUpperCase()
    }
  });
  res.status(200).json({ message: "Deleted PromoCode " + promoName })
}