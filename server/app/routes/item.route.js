const { authJwt } = require("../middleware");
const controller = require("../controllers/item.controller");


const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  }
  ,
  filename: function (req, file, cb) {
      cb(null, file?file.fieldname + '-' + Date.now()+'.'+file.mimetype.split('/')[1]:'none');
  }
});


const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  /* limits: {
      fileSize: 1024 * 1024 * 5// mb
  }, */
  fileFilter: fileFilter
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'cover_front', maxCount: 1 },
  { name: 'cover_back', maxCount: 1 },
]);



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
   *         itemType:
   *           type: string
   *           description: Item Type
   *         author:
   *           type: string
   *           description: Book author
   *         title:
   *           type: string
   *           description: The title of book
   *         image:
   *           type: string
   *           description: The books img path
   *         covers:
   *           type: string
   *           description: The books front and back cover img path "front,back"
   *         publisher:
   *           type: string
   *           description: The books publisher
   *         coverType:
   *           type: integer
   *           description: The books cover type
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
   *         category:
   *           type: string
   *           description: The books category
   *         tags:
   *           type: string
   *           description: The books tags
   * 
   *       example:
   *         itemType: "book"
   *         author: test
   *         title: test
   *         image: test
   *         covers: front,back
   *         publisher: test
   *         coverType: 1
   *         year: 2023
   *         isbn: 787866756
   *         pageCount: 33
   *         lang: lang
   *         price: 500
   *         reducedPrice: 450
   *         isReducedNow: 1
   *         annotation: annotation
   *         category: 1,4
   *         tags: 1
   *     BookCreate:
   *       type: object
   *       properties:
   *         itemType:
   *           type: string
   *           description: Item Type
   *         author:
   *           type: string
   *           description: Book author
   *         title:
   *           type: string
   *           description: The title of book
   *         image:
   *           type: string
   *           description: The books MAIN img path
   *           format: binary
   *         cover_front:
   *           type: string
   *           description: The books COVER img path
   *           format: binary
   *         cover_back:
   *           type: string
   *           description: The books COVER  img path
   *           format: binary
   *         coverType:
   *           type: integer
   *           description: The books cover type
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
   *         category:
   *           type: string
   *           description: The books category
   *         tags:
   *           type: string
   *           description: The books tags
   *     Merch:
   *       type: object
   *       properties:
   *         itemType:
   *           type: string
   *           description: Item Type
   *         title:
   *           type: string
   *           description: The title of Merch
   *         image:
   *           type: string
   *           description: The Merch img path
   *         price:
   *           type: integer
   *           description: The Merch price
   *         reducedPrice:
   *           type: integer
   *           description: The Merch reduced price
   *         isReducedNow:
   *           type: boolean
   *           description: Is the Merch reduced
   *         annotation:
   *           type: string
   *           description: The Merch annotation
   *         tags:
   *           type: string
   *           description: The Merch tags
   *       example:
   *         itemType: merch
   *         title: test
   *         image: test
   *         price: 500
   *         reducedPrice: 450
   *         isReducedNow: 1
   *         annotation: annotation
   *         tags: new
   *     MerchCreate:
   *       type: object
   *       properties:
   *         itemType:
   *           type: string
   *           description: Item Type
   *         title:
   *           type: string
   *           description: The title of book
   *         image:
   *           type: string
   *           description: The books img path
   *           format: binary
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
   *         tags:
   *           type: string
   *           description: The books tags
   */

  /**
   * @swagger
   * /all/books:
   *   get:
   *     summary: Get all Books
   *     tags: [Books]
   *     parameters:
   *      - in: query
   *        name: page
   *        schema:
   *          type: integer
   *        required: true
   *        example: 0
   *        description: Page to show
   *      - in: query
   *        name: cat
   *        schema:
   *          type: string
   *        required: false
   *        example: 1,4
   *        description: Category to show  
   *      - in: query
   *        name: order
   *        schema:
   *          type: string
   *        required: false
   *        example: "price,DESC"
   *        description: Order by ASC/DESC price
   *      - in: query
   *        name: priceRange
   *        schema:
   *          type: string
   *        required: false
   *        example: "300,500"
   *        description: Range of price [MIN,MAX]
   *      - in: query
   *        name: author
   *        schema:
   *          type: string
   *        required: false
   *        example: "Сергій Жадан"
   *        description: Books of that author
   *      - in: query
   *        name: publisher
   *        schema:
   *          type: string
   *        required: false
   *        example: Артбукс
   *        description: Books of that publisher
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
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/BookCreate'
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
      [authJwt.verifyToken, authJwt.isModerator],upload,
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
  *        multipart/form-data:
  *           schema:
  *             $ref: '#/components/schemas/BookCreate'
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
  app.put('/api/book/:id', [authJwt.verifyToken, authJwt.isModerator],upload,
  controller.updateBook)

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

  /******************************************************************************************************************************************************** */

  /**
   * @swagger
   * /all/merch:
   *   get:
   *     summary: Get all Merch
   *     tags: [Merch]
   *     responses:
   *       200:
   *         description: The created merch.
   *         content:
   *           application/json:
   *            schema:
   *              type: array
   *              items:
   *               $ref: '#/components/schemas/Merch'
   *       500:
   *         description: Some server error
   *
   */
  app.get(
    "/api/all/merch",
    controller.getMerch
  );

  /**
   * @swagger
   * /merch/{id}:
   *   get:
   *     summary: Get merch by id
   *     tags: [Merch]
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: The merch id
   *     responses:
   *       200:
   *         description: The merch by id.
   *         content:
   *           application/json:
   *            schema:
   *              $ref: '#/components/schemas/Merch'
   *       500:
   *         description: Some server error
   *
   */
  app.get(
    "/api/merch/:id",
    controller.getMerchById
  );

    /**
   * @swagger
   * /merch:
   *   post:
   *     security: 
   *       - bearer: []
   *     summary: Create a new merch
   *     tags: [Merch]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/MerchCreate'
   *     responses:
   *       200:
   *         description: The created merch.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Merch'
   *       500:
   *         description: Some server error
   *
   */
  
    app.post(
      "/api/merch",
      [authJwt.verifyToken, authJwt.isModerator],multer({ storage }).single('image'),
      controller.createMerch
    );

  /**
  * @swagger
  * /merch/{id}:
  *   put:
  *    security: 
  *       - bearer: []
  *    summary: Update the merch by the id
  *    tags: [Merch]
  *    parameters:
  *      - in: path
  *        name: id
  *        schema:
  *          type: string
  *        required: true
  *        description: The merch id
  *    requestBody:
  *      required: true
  *      content:
  *        multipart/form-data:
  *           schema:
  *             $ref: '#/components/schemas/MerchCreate'
  *    responses:
  *      200:
  *        description: The merch was updated
  *        content:
  *          application/json:
  *            schema:
  *              $ref: '#/components/schemas/Merch'
  *      404:
  *        description: The merch was not found
  *      500:
  *        description: Some error happened
  */
  app.put('/api/merch/:id', [authJwt.verifyToken, authJwt.isModerator],multer({ storage }).single('image'),
  controller.updateMerch)

    /**
  * @swagger
  * /merch/{id}:
  *   delete:
  *     security: 
  *       - bearer: []
  *     summary: Remove the merch by id
  *     tags: [Merch]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: number
  *         required: true
  *         description: The merch id
  *
  *     responses:
  *       200:
  *         description: The merch was deleted
  *       404:
  *         description: The merch was not found
  */
  app.delete('/api/merch/:id',[authJwt.verifyToken,authJwt.isModerator],controller.deleteMerch)

  /************************************************************************************************************************************************** */

  /**
   * @swagger
   * /item/:id:
   *   get:
   *     summary: Get items of the order
   *     tags: [Items]
   *     parameters:
   *      - in: query
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: Items to show 
   *     responses:
   *       200:
   *         description: The items of order.
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
    "/api/item/:id",
    // [authJwt.verifyToken],
    controller.getItemsById
  );

  /**
   * @swagger
   * /books/search:
   *   get:
   *     security: 
   *       - bearer: []
   *     summary: Get search items
   *     tags: [Books]
   *     parameters:
   *      - in: query
   *        name: search
   *        schema:
   *          type: string
   *        required: true
   *        description: Query 
   *     responses:
   *       200:
   *         description: The items of search.
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
    "/api/books/search",
    // [authJwt.verifyToken,authJwt.isModerator],
    controller.searchBooks
  );

  /**
   * @swagger
   * /merches/search:
   *   get:
   *     security: 
   *       - bearer: []
   *     summary: Get search items
   *     tags: [Merch]
   *     parameters:
   *      - in: query
   *        name: search
   *        schema:
   *          type: string
   *        required: true
   *        description: Query 
   *     responses:
   *       200:
   *         description: The items of search.
   *         content:
   *           application/json:
   *            schema:
   *              type: array
   *              items:
   *               $ref: '#/components/schemas/Merch'
   *       500:
   *         description: Some server error
   *
   */
  app.get(
    "/api/merches/search",
    [authJwt.verifyToken,authJwt.isModerator],
    controller.searchMerch
  );
};