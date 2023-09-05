const { authJwt } = require("../middleware");
const controller = require("../controllers/order.controller");

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
   * tags:
   *   name: Orders
   *   description: The orders managing API
   * components:
   *   schemas:
   *     Order:
   *       type: object
   *       properties:
   *         userID:
   *           type: integer
   *           description: UserId might not be stated
   *         orderedItemIDs:
   *           type: string
   *           description: Array of books ordered
   *         email:
   *           type: string
   *           description: Buyer email
   *         name:
   *           type: string
   *           description: Buyer name
   *         surname:
   *           type: string
   *           description: Buyer surname
   *         phoneNumber:
   *           type: integer
   *           description: Buyer phone number
   *         delMethodId:
   *           type: integer
   *           description: ID of delivery method
   *         region:
   *           type: string
   *           description: Delivery region
   *         branch:
   *           type: string
   *           description: Branch if it is delivery branch
   *         address:
   *           type: string
   *           description: Buyer address/ delivery address
   *         comments:
   *           type: string
   *           description: Any comments might be
   *         status:
   *           type: boolean
   *           description: Done or not done
   *         rejected:
   *           type: boolean
   *           description: Was it rejected?
   * 
   *       example:
   *         userId: 1
   *         orderedItemIDs: "[1,2]"
   *         email: test@email.com
   *         name: test
   *         phoneNumber: 380954279091
   *         delMethodId: 3
   *         region: test@email.com
   *         branch: test@email.com
   *         address: test@email.com
   *         comments: test comment
   *         status: true
   *         rejected: false
   */

  /**
   * @swagger
   * /all/orders:
   *   get:
   *     security: 
   *       - bearer: []
   *     summary: Get all Orders
   *     tags: [Orders]
   *     responses:
   *       200:
   *         description: The created orders.
   *         content:
   *           application/json:
   *            schema:
   *              type: array
   *              items:
   *               $ref: '#/components/schemas/Order'
   *       500:
   *         description: Some server error
   *
   */
    app.get(
    "/api/all/orders",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.getOrders
  );

  /**
   * @swagger
   * /order/{id}:
   *   get:
   *     security: 
   *       - bearer: []
   *     summary: Get order by id
   *     tags: [Orders]
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: The order id
   *     responses:
   *       200:
   *         description: The order by id.
   *         content:
   *           application/json:
   *            schema:
   *              type: array
   *              items:
   *               $ref: '#/components/schemas/Order'
   *       500:
   *         description: Some server error
   *
   */
  app.get(
    "/api/order/:id",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.getOrderById
  );

    /**
   * @swagger
   * /order:
   *   post:
   *     summary: Create a new order
   *     tags: [Orders]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Order'
   *     responses:
   *       200:
   *         description: The created order.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Order'
   *       500:
   *         description: Some server error
   *
   */
  
    app.post(
      "/api/order",
      controller.createOrder
    );

  /**
  * @swagger
  * /order/{id}:
  *   put:
  *    security: 
  *       - bearer: []
  *    summary: Update the order by the id
  *    tags: [Orders]
  *    parameters:
  *      - in: path
  *        name: id
  *        schema:
  *          type: string
  *        required: true
  *        description: The order id
  *    requestBody:
  *      required: true
  *      content:
  *        application/json:
  *          schema:
  *            $ref: '#/components/schemas/Order'
  *    responses:
  *      200:
  *        description: The order was updated
  *        content:
  *          application/json:
  *            schema:
  *              $ref: '#/components/schemas/Order'
  *      404:
  *        description: The order was not found
  *      500:
  *        description: Some error happened
  */
  app.put('/api/order/:id', [authJwt.verifyToken, authJwt.isModerator],controller.updateOrder)//TODO: verify that it is exact user

    /**
  * @swagger
  * /order/{id}:
  *   delete:
  *     security: 
  *       - bearer: []
  *     summary: Remove the order by id
  *     tags: [Orders]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: number
  *         required: true
  *         description: The order id
  *
  *     responses:
  *       200:
  *         description: The order was deleted
  *       404:
  *         description: The order was not found
  */
  app.delete('/api/order/:id',[authJwt.verifyToken,authJwt.isModerator],controller.deleteOrder)
};