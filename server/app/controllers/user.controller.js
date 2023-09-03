const db = require("../models");
const User = db.user;

const Op = db.Sequelize.Op;

exports.userBoard = async (req, res) => {
  const allUsers = await db.sequelize.query("SELECT username,email,`users`.createdAt,`users`.updatedAt FROM users RIGHT JOIN user_roles ON users.id=user_roles.userId WHERE user_roles.roleId=1;", { type: db.sequelize.QueryTypes.SELECT });
  res.status(200).json(allUsers);
};

exports.moderatorBoard = async (req, res) => {
  const allModerators = await db.sequelize.query("SELECT username,email,`users`.createdAt,`users`.updatedAt FROM users RIGHT JOIN user_roles ON users.id=user_roles.userId WHERE user_roles.roleId=2;", { type: db.sequelize.QueryTypes.SELECT });
  res.status(200).json(allModerators);
};

exports.updateInfo = (req, res) => {
  console.log(res)//TODO:
}


exports.deleteUser = async (req, res) => {
  await User.destroy({
    where: {
      id: req.params.id
    }
  });
  res.status(200).send("Deleted user "+req.params.id)
}