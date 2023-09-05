const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
   /**
 * @swagger
 * components:
 *   schemas:
 *     UserUpdate:
 *       type: object
 *       required:
 *         - name
 *         - surname
 *         - phoneNumber
 *       properties:
 *         name:
 *           type: string
 *           description: User's name
 *         surname:
 *           type: string
 *           description: User's surname
 *         phoneNumber:
 *           type: string
 *           description: UA-type phone number
 *   
 *       example:
 *         name: John
 *         surname: Smith
 *         phoneNumber: "0951234567"
 */

  /**
   * @swagger
   * tags:
   *   name: Users
   *   description: The users managing API
   * /all/user:
   *   get:
   *     security: 
   *       - bearer: []
   *     summary: Get all clients with USER status
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: The created users.
   *         content:
   *           application/json:
   *            schema:
   *              type: array
   *              items:
   *               $ref: '#/components/schemas/User'
   *       500:
   *         description: Some server error
   *
   */
    app.get(
    "/api/all/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  /**
   * @swagger
   * /all/mod:
   *   get:
   *     security: 
   *       - bearer: []
   *     summary: Get all clients with MODERATOR status
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: The created users.
   *         content:
   *           application/json:
   *            schema:
   *              type: array
   *              items:
   *               $ref: '#/components/schemas/User'
   *       500:
   *         description: Some server error
   *
   */
  app.get(
    "/api/all/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  /**
  * @swagger
  * /user/{id}:
  *   put:
  *    security: 
  *       - bearer: []
  *    summary: Update the user by the id
  *    tags: [Users]
  *    parameters:
  *      - in: path
  *        name: id
  *        schema:
  *          type: string
  *        required: true
  *        description: The user id
  *    requestBody:
  *      required: true
  *      content:
  *        application/json:
  *          schema:
  *            $ref: '#/components/schemas/UserUpdate'
  *    responses:
  *      200:
  *        description: The user was updated
  *        content:
  *          application/json:
  *            schema:
  *              $ref: '#/components/schemas/User'
  *      404:
  *        description: The user was not found
  *      500:
  *        description: Some error happened
  */
  app.put('/api/user/:id',[authJwt.verifyToken],controller.updateInfo)//TODO: verify that it is exact user

    /**
  * @swagger
  * /user/{id}:
  *   delete:
  *     security: 
  *       - bearer: []
  *     summary: Remove the user by id
  *     tags: [Users]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: number
  *         required: true
  *         description: The user id
  *
  *     responses:
  *       200:
  *         description: The user was deleted
  *       404:
  *         description: The book was not found
  */
  app.delete('/api/user/:id',[authJwt.verifyToken],controller.deleteUser)
};