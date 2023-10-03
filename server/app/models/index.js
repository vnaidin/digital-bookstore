const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.item = require("./item.model.js")(sequelize, Sequelize);
db.order = require("./order.model.js")(sequelize, Sequelize);
db.news = require('./news.model.js')(sequelize, Sequelize);
db.orderItems = require("./orderItems.model.js")(sequelize, Sequelize);
db.orderAddress = require("./orderAddress.model.js")(sequelize, Sequelize);
db.orderPromoCode = require("./orderPromoCode.model.js")(sequelize, Sequelize);
db.itemsManagement = require('./itemManagement.model.js')(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.order.hasMany(db.orderItems);
db.order.hasOne(db.orderAddress);

db.item.hasOne(db.itemsManagement);

db.ROLES = ["user", "admin", "moderator", 'seller'];

module.exports = db;