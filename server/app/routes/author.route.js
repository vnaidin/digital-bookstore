const { authJwt } = require("../middleware");
const controller = require("../controllers/author.controller");


const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  }
  ,
  filename: function (req, file, cb) {
    cb(null, file ? file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1] : 'none');
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
   *   name: Author
   *   description: The authors managing API
   * components:
   *   schemas:
   *     Author:
   *       type: object
   *       properties:
   *         fullName:
   *           type: string
   *           description: Author fullName
   *         pseudo:
   *           type: string
   *           description: The pseudo of author
   *         image:
   *           type: string
   *           description: The author photo path
   *         birthday:
   *           type: string
   *           description: The authors birthday
   *         death:
   *           type: string
   *           description: death date if available
   *         bio:
   *           type: string
   *           description: The authors bio
   * 
   *       example:
   *         fullName: John Malkovich
   *         pseudo: malkov
   *         image: img_path
   *         birthday: test
   *         death: test
   *         bio: bla-bla
   * 
   *     AuthorCreate:
   *       type: object
   *       properties:
   *         fullName:
   *           type: string
   *           description: Author fullName
   *         pseudo:
   *           type: string
   *           description: The pseudo of author
   *         image:
   *           type: string
   *           description: The author photo path
   *           format: binary
   *         birthday:
   *           type: string
   *           description: The authors birthday
   *         death:
   *           type: string
   *           description: death date if available
   *         bio:
   *           type: string
   *           description: The authors bio
   * 
   */

  /**
   * @swagger
   * /all/authors:
   *   get:
   *     summary: Get all Authors
   *     tags: [Author]
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
   *               $ref: '#/components/schemas/Author'
   *       500:
   *         description: Some server error
   *
   */
  app.get(
    "/api/all/authors",
    controller.getAuthors
  );

  /**
   * @swagger
   * /author/{id}:
   *   get:
   *     summary: Get author by id
   *     tags: [Author]
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: The author id
   *     responses:
   *       200:
   *         description: The author by id.
   *         content:
   *           application/json:
   *            schema:
   *              $ref: '#/components/schemas/Author'
   *       500:
   *         description: Some server error
   *
   */
  app.get(
    "/api/author/:id",
    controller.getAuthorById
  );

  /**
 * @swagger
 * /author:
 *   post:
 *     security: 
 *       - bearer: []
 *     summary: Create author
 *     tags: [Author]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/AuthorCreate'
 * 
 *     responses:
 *       200:
 *         description: The created author.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       500:
 *         description: Some server error
 *
 */

  app.post(
    "/api/author",
    [authJwt.verifyToken, authJwt.isModerator], upload,
    controller.createAuthor
  );

  /**
  * @swagger
  * /author{id}:
  *   put:
  *    security: 
  *       - bearer: []
  *    summary: Update the author by the id
  *    tags: [Author]
  *    parameters:
  *      - in: path
  *        name: id
  *        schema:
  *          type: string
  *        required: true
  *        description: The author id
  *    requestBody:
  *      required: true
  *      content:
  *        multipart/form-data:
  *           schema:
  *             $ref: '#/components/schemas/AuthorCreate'
  *    responses:
  *      200:
  *        description: The author was updated
  *        content:
  *          application/json:
  *            schema:
  *              $ref: '#/components/schemas/Author'
  *      404:
  *        description: The author was not found
  *      500:
  *        description: Some error happened
  */
  app.put('/api/author:id', [authJwt.verifyToken, authJwt.isModerator], upload,
    controller.updateAuthor)

  /**
* @swagger
* /author/{id}:
*   delete:
*     security: 
*       - bearer: []
*     summary: Remove the author by id
*     tags: [Author]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: number
*         required: true
*         description: The author id
*
*     responses:
*       200:
*         description: The new was deleted
*       404:
*         description: The new was not found
*/
  app.delete('/api/author/:id', [authJwt.verifyToken, authJwt.isModerator], controller.deleteAuthor)
}