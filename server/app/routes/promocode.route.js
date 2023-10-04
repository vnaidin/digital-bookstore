const { authJwt } = require("../middleware");
const controller = require("../controllers/promocode.controller");

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
* components:
*   schemas:
*     PromoCode:
*       type: object
*       required:
*         - name
*         - percent
*         - from
*         - till
*       properties:
*         name:
*           type: string
*           description: Promo name
*         percent:
*           type: integer
*           description: Percent to exclude
*         from:
*           type: string
*           description: date from
*         till:
*           type: string
*           description: date to
*   
*       example:
*         name: FEST
*         percent: 5
*         from: 'October 6, 2023 00:00:01'
*         till: 'October 8, 2023 23:59:59'
*/

  /**
   * @swagger
   * tags:
   *   name: PromoCode
   *   description: The promocode managing API
   * /all/promo:
   *   get:
   *     summary: Get all promocodes in Base64, need to decode
   *     tags: [PromoCode]
   *     responses:
   *       200:
   *         description: The created promocodes.
   *         content:
   *           application/json:
   *            schema:
   *              type: array
   *              items:
   *               $ref: '#/components/schemas/PromoCode'
   *       500:
   *         description: Some server error
   *
   */
  app.get(
    "/api/all/promo",
    controller.getAllPromocodes
  );

  /**
  * @swagger
  * /promo:
  *   post:
  *    security: 
  *       - bearer: []
  *    summary: Create the promocode
  *    tags: [PromoCode]
  *    requestBody:
  *      required: true
  *      content:
  *        application/json:
  *          schema:
  *            $ref: '#/components/schemas/PromoCode'
  *    responses:
  *      200:
  *        description: The promocode was created
  *        content:
  *          application/json:
  *            schema:
  *              $ref: '#/components/schemas/PromoCode'
  *      404:
  *        description: The user was not found
  *      500:
  *        description: Some error happened
  */
  app.post('/api/promo', [authJwt.verifyToken, authJwt.isModerator], controller.createPromo);

  /**
* @swagger
* /promo/{id}:
*   delete:
*     security: 
*       - bearer: []
*     summary: Remove the promocode by id
*     tags: [PromoCode]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: number
*         required: true
*         description: The promocode id
*
*     responses:
*       200:
*         description: The promocode was deleted
*       404:
*         description: The promocode was not found
*/
  app.delete('/api/promo/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.deletePromo)
};