const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  /**
   * @swagger
   * tags:
   *   name: Users
   *   description: The users managing API
   * components:
   *   schemas:
   *     User:
   *       type: object
   *       required:
   *         - email
   *         - password
   *         - username
   *       properties:
   *         password:
   *           type: string
   *           description: The auto-generated id of the user
   *         email:
   *           type: string
   *           description: The title of your user
   *         username:
   *           type: string
   *           description: The user author
   *         roles:
   *           type: array
   *           items:
   *             type: string
   *   
   *       example:
   *         email: John@gmail.com
   *         password: "@'Sq12RR"
   *         roles: ["user","moderator","admin"]
   */

  /**
   * @swagger
   * /auth/signup:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: The created user.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       500:
   *         description: Some server error
   *
   */
  
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
  /**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         password:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The title of your user
 *   
 *       example:
 *         email: John@gmail.com
 *         password: "@'Sq12RR"
 */

  /**
   * @swagger
   * /auth/signin:
   *   post:
   *     summary: LogIn user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserLogin'
   *     responses:
   *       200:
   *         description: The created user.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       500:
   *         description: Some server error
   *
   */
  app.post("/api/auth/signin", controller.signin);
};