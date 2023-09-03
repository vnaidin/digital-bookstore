const { authJwt } = require("../middleware");
const controller = require("../controllers/book.controller");

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
   *   name: Books
   *   description: The books managing API
   * components:
   *   schemas:
   *     Book:
   *       type: object
   *       properties:
   *         author:
   *           type: string
   *           description: Book author
   *         title:
   *           type: string
   *           description: The title of book
   *         image:
   *           type: string
   *           description: The books img path
   *         publisher:
   *           type: string
   *           description: The books publisher
   *         year:
   *           type: integer
   *           description: The books publish year
   *         isbn:
   *           type: string
   *           description: The books isbn
   *         pageCount:
   *           type: integer
   *           description: The books n of pages
   *         lang:
   *           type: string
   *           description: The books language
   *         price:
   *           type: integer
   *           description: The books price
   *         reducedPrice:
   *           type: integer
   *           description: The books reduced price
   *         isReducedNow:
   *           type: boolean
   *           description: Is the book reduced
   *         annotation:
   *           type: string
   *           description: The books annotation
   * 
   *       example:
   *         author: test
   *         title: test
   *         image: test
   *         publisher: test
   *         year: 2023
   *         isbn: 787866756
   *         pageCount: 33
   *         lang: lang
   *         price: 500
   *         reducedPrice: 450
   *         isReducedNow: 1
   *         annotation: annotation
   */

  /**
   * @swagger
   * /all/books:
   *   get:
   *     summary: Get all Books
   *     tags: [Books]
   *     responses:
   *       200:
   *         description: The created books.
   *         content:
   *           application/json:
   *            schema:
   *              type: array
   *              items:
   *               $ref: '#/components/schemas/Book'
   *       500:
   *         description: Some server error
   *
   */
    app.get(
    "/api/all/books",
    controller.getBooks
  );

  /**
   * @swagger
   * /book/{id}:
   *   get:
   *     summary: Get book by id
   *     tags: [Books]
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: The book id
   *     responses:
   *       200:
   *         description: The book by id.
   *         content:
   *           application/json:
   *            schema:
   *              $ref: '#/components/schemas/Book'
   *       500:
   *         description: Some server error
   *
   */
  app.get(
    "/api/book/:id",
    controller.getBookById
  );

    /**
   * @swagger
   * /book:
   *   post:
   *     security: 
   *       - bearer: []
   *     summary: Create a new book
   *     tags: [Books]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Book'
   *     responses:
   *       200:
   *         description: The created book.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Book'
   *       500:
   *         description: Some server error
   *
   */
  
    app.post(
      "/api/book",
      [authJwt.verifyToken, authJwt.isModerator],
      controller.createBook
    );

  /**
  * @swagger
  * /book/{id}:
  *   put:
  *    security: 
  *       - bearer: []
  *    summary: Update the book by the id
  *    tags: [Books]
  *    parameters:
  *      - in: path
  *        name: id
  *        schema:
  *          type: string
  *        required: true
  *        description: The book id
  *    requestBody:
  *      required: true
  *      content:
  *        application/json:
  *          schema:
  *            $ref: '#/components/schemas/Book'
  *    responses:
  *      200:
  *        description: The book was updated
  *        content:
  *          application/json:
  *            schema:
  *              $ref: '#/components/schemas/Book'
  *      404:
  *        description: The book was not found
  *      500:
  *        description: Some error happened
  */
  app.put('/api/book/:id', [authJwt.verifyToken, authJwt.isModerator],controller.updateBook)//TODO: verify that it is exact user

    /**
  * @swagger
  * /book/{id}:
  *   delete:
  *     security: 
  *       - bearer: []
  *     summary: Remove the book by id
  *     tags: [Books]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: number
  *         required: true
  *         description: The book id
  *
  *     responses:
  *       200:
  *         description: The book was deleted
  *       404:
  *         description: The book was not found
  */
  app.delete('/api/book/:id',[authJwt.verifyToken,authJwt.isModerator],controller.deleteBook)
};