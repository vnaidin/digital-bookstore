const { authJwt } = require("../middleware");
const controller = require("../controllers/news.controller");


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
}).single('image');

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
   *   name: News
   *   description: The news managing API
   * components:
   *   schemas:
   *     News:
   *       type: object
   *       properties:
   *         author:
   *           type: string
   *           description: News author
   *         title:
   *           type: string
   *           description: The title of news
   *         image:
   *           type: string
   *           description: The news img path
   *         publisher:
   *           type: string
   *           description: The news publisher
   *         showImage:
   *           type: boolean
   *           description: show banner?
   *         text:
   *           type: string
   *           description: The new
   *         category:
   *           type: string
   *           description: category of the new
   * 
   *       example:
   *         author: test
   *         title: test
   *         image: test
   *         publisher: test
   *         showImage: 1
   *         text: annotation
   *         category: book review
   */

  /**
   * @swagger
   * /all/news:
   *   get:
   *     summary: Get all News
   *     tags: [News]
   *     parameters:
   *      - in: query
   *        name: page
   *        schema:
   *          type: integer
   *        required: true
   *        example: 0
   *        description: Page to show
   *     responses:
   *       200:
   *         description: The created news.
   *         content:
   *           application/json:
   *            schema:
   *              type: array
   *              items:
   *               $ref: '#/components/schemas/News'
   *       500:
   *         description: Some server error
   *
   */
    app.get(
    "/api/all/news",
    controller.getNews
  );

  /**
   * @swagger
   * /news/{id}:
   *   get:
   *     summary: Get news by id
   *     tags: [News]
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: The news id
   *     responses:
   *       200:
   *         description: The news by id.
   *         content:
   *           application/json:
   *            schema:
   *              $ref: '#/components/schemas/News'
   *       500:
   *         description: Some server error
   *
   */
  app.get(
    "/api/news/:id",
    controller.getNewsById
  );

    /**
   * @swagger
   * /news:
   *   post:
   *     security: 
   *       - bearer: []
   *     summary: Create news
   *     tags: [News]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/News'
   * 
   *     responses:
   *       200:
   *         description: The created news.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/News'
   *       500:
   *         description: Some server error
   *
   */
  
    app.post(
      "/api/news",
      [authJwt.verifyToken, authJwt.isModerator],upload,
      controller.createNews
    );

  /**
  * @swagger
  * /news/{id}:
  *   put:
  *    security: 
  *       - bearer: []
  *    summary: Update the news by the id
  *    tags: [News]
  *    parameters:
  *      - in: path
  *        name: id
  *        schema:
  *          type: string
  *        required: true
  *        description: The news id
  *    requestBody:
  *      required: true
  *      content:
  *        multipart/form-data:
  *           schema:
  *             $ref: '#/components/schemas/News'
  *    responses:
  *      200:
  *        description: The news was updated
  *        content:
  *          application/json:
  *            schema:
  *              $ref: '#/components/schemas/News'
  *      404:
  *        description: The news was not found
  *      500:
  *        description: Some error happened
  */
  app.put('/api/news/:id', [authJwt.verifyToken, authJwt.isModerator],upload,
  controller.updateNews)

    /**
  * @swagger
  * /news/{id}:
  *   delete:
  *     security: 
  *       - bearer: []
  *     summary: Remove the news by id
  *     tags: [News]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: number
  *         required: true
  *         description: The news id
  *
  *     responses:
  *       200:
  *         description: The new was deleted
  *       404:
  *         description: The new was not found
  */
  app.delete('/api/news/:id',[authJwt.verifyToken,authJwt.isModerator],controller.deleteNews)
    }