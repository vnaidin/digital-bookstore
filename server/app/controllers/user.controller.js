const db = require("../models");
const User = db.user;
const Role=db.role;

const Op = db.Sequelize.Op;

exports.userBoard = async (req, res) => {
  /* const allUsers = await db.sequelize.query("SELECT email,`users`.createdAt,`users`.updatedAt FROM users RIGHT JOIN user_roles ON users.id=user_roles.userId WHERE user_roles.roleId=1;", { type: db.sequelize.QueryTypes.SELECT });
  res.status(200).json(allUsers); */
  const users = await User.findAll({ include: { model: Role, required: true } });
  res.status(200).json(users);
};

exports.moderatorBoard = async (req, res) => {
  const allModerators = await db.sequelize.query("SELECT email,`users`.createdAt,`users`.updatedAt FROM users RIGHT JOIN user_roles ON users.id=user_roles.userId WHERE user_roles.roleId=2;", { type: db.sequelize.QueryTypes.SELECT });
  res.status(200).json(allModerators);
};

exports.updateInfo = async (req, res) => {
  const userId = req.params.id;
  const { name, surname, phoneNumber } = req.body;

  await User.update({
    name, surname, phoneNumber
  }, {
    where: {
      id: userId
    }
  }).then(user => res.status(200).json({ message: `User ${userId} updated` }))
}


exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  await User.destroy({
    where: {
      id: userId
    }
  });
  res.status(200).json({ message: "Deleted user " + userId })
}