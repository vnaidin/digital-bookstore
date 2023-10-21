const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require('../../mailSender');

const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

exports.signup = (req, res) => {

  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: req.body.email,
    subject: 'Успішна реєстрація',
    template: 'registration',
    context: {
      address: req.headers.origin,
      name: req.body.name
    }
  };
  // Save User to Database
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
            // send success registration email
            nodemailer.transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });

          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
          // send success registration email
          nodemailer.transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id },
        config.secret,
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 43200, // 12 hours
        });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          wishlist: user.wishlist,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.requestResetPassword = (req, res) => {

  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: req.body.email,
    subject: 'Запит на зміну пароля',
    template: 'resetPassRequest',
  };
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      let passwordResetToken = user.resetToken;
      if (passwordResetToken) {
        return res.send({ message: "Password Reset is already in process!" });
      }

      let resetToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(resetToken, Number(10));
      const expires = Date.now() + 1800000

      await User.update({
        resetToken: hash, expireToken: expires
      }, {
        where: {
          email: req.body.email
        }
      })
      const link = `${req.headers.origin}/passwordReset?token=${resetToken}&id=${user.id}`;
      // send reset password email
      nodemailer.transporter.sendMail({
        ...mailOptions,
        context: { name: user.name || 'користувачу', link: link, address: req.headers.origin }
      }, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.status(200).send({
        message: "Check your email",
        link: link
      });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.resetPassword = (req, res) => {

  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    subject: 'Зміна пароля',
    template: 'resetPass',
  };

  User.findOne({
    where: {
      id: req.body.id
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      let passwordResetToken = user.resetToken;
      if (!passwordResetToken) {
        throw new Error("Invalid or expired password reset token");
      }
      const isValid = await bcrypt.compare(req.body.token, passwordResetToken);
      if (!isValid) {
        throw new Error("Invalid or expired password reset token");
      }
      const hash = await bcrypt.hash(req.body.password, Number(10));
      await User.update({
        password: hash, expireToken: null, resetToken: null
      }, {
        where: {
          id: req.body.id
        }
      })

      const updatedUser = await User.findOne({
        where: {
          id: req.body.id
        }
      });

      // send success reset password email
      nodemailer.transporter.sendMail({
        ...mailOptions, to: updatedUser.email,
        context: { name: updatedUser.name || 'користувачу', address: req.headers.origin }
      }, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.status(200).send({
        message: "Password Reset Successfully"
      });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};