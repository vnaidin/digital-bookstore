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
   *         - name
   *         - email
   *         - password
   *       properties:
   *         password:
   *           type: string
   *           description: Password 8 symbols
   *         email:
   *           type: string
   *           description: User's email
   *         name:
   *           type: string
   *           description: The user name
   *         surname:
   *           type: string
   *           description: The user surname
   *         phoneNumber:
   *           type: string
   *           description: The user tel
   *         wishlist:
   *           type: string
   *           description: Wishlist, string of item ID's
   *         birthday:
   *           type: string
   *           description: The user's birthday, save only day
   *         roles:
   *           type: array
   *           items:
   *             type: string
   *   
   *       example:
   *         name: John
   *         email: John@gmail.com
   *         password: "@'Sq12RR"
   *         roles: ["user","seller","moderator","admin"]
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

    /**
 * @swagger
 * components:
 *   schemas:
 *     UserRequestResetPass:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: Address where to send recovery email
 *   
 *       example:
 *         email: shniperson62@gmail.com
 */

  /**
   * @swagger
   * /auth/requestResetPass:
   *   post:
   *     summary: Reset password request
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserRequestResetPass'
   *     responses:
   *       200:
   *         description: The created user.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  link:
   *                    type: string
   *                    description: Address where to send recovery link
   *   
   *               example:
   *                link: "http://localhost:3016/passwordReset?token=7bf8c59ac10cfa89cb0ccf05f3d680b653a7645a00ab1f6523febaa63ad5a4fb&id=1"
   * 
   *       500:
   *         description: Some server error
   *
   */
  app.post("/api/auth/requestResetPass", controller.requestResetPassword);

  /**
 * @swagger
 * components:
 *   schemas:
 *     ResetPass:
 *       type: object
 *       required:
 *         - id
 *         - token
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         token:
 *           type: string
 *           description: The title of your user
 *         password:
 *           type: string
 *           description: The title of your user
 *   
 *       example:
 *         id: 1
 *         token: b49fcad0883e3b2da229251100ed7d4d5cf9a9725187ef8d0e4920208e3d6eed
 *         password: "@'Sq12RR"
 */

  /**
   * @swagger
   * /auth/resetPass:
   *   post:
   *     summary: Reset user's password
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ResetPass'
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
  app.post("/api/auth/resetPass", controller.resetPassword);
};