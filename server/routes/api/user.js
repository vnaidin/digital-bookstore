const router = require('express').Router();
const {
  body, validationResult, param, query,
} = require('express-validator');
const sql = require('../../models/db');

router.get(
  '/user',
  query('username').exists().isString().isLength({ min: 3 }),
  (req, res) => {
    // console.log('/user');

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { username } = req.query;

    const sqlQueryWithParam = `SELECT *  FROM  users  WHERE telegram='${username}'`;

    sql.query(sqlQueryWithParam, (err, rows) => {
      if (err) {
        // console.error(err.message);
        return res.status(500).json({ code: 500, message: 'There was an error!', error: err.code });
      }
      return res.status(200).json(rows);
    });
    return null;
  },
);

router.post(
  '/user',
  body('firstName').exists().isString().isLength({ min: 3 }),
  body('lastName').exists().isString().isLength({ min: 3 }),
  body('telegram').exists().isString().isLength({ min: 3 }),
  (req, res) => {
    //console.log('/user', req.body);

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      firstName, lastName, telegram,
    } = req.body;

    const sqlQuery = `INSERT INTO users (firstName,lastName,telegram,boughtCourses,updated)
    VALUES ('${firstName}','${lastName}','${telegram}',0,now())
     AS new_foo 
      ON DUPLICATE KEY UPDATE firstName=new_foo.firstName,lastName=new_foo.lastName,updated=now();`;

    const sqlQuery1 = `INSERT INTO users (firstName,lastName,telegram,boughtCourses,updated)
    VALUES ('${firstName}','${lastName}','${telegram}',0,now());`;
    // console.log(sqlQuery)

    sql.query(sqlQuery1, (err/* , rows */) => {
      if (err) {
        //  console.error(err);
        return res.status(500).json({ code: 500, message: 'There was an error!', error: err.code });
      }
      // console.log(`Data inserting ${Object.values(req.body).toString()}`);
      // console.log(`Rows inserted ${rows.changedRows}`);
      return res.status(200).json({ code: 200, message: 'User created' });
    });
    return null;
  },
);

router.put(
  '/user',
  body('username').exists().isString(),
  (req, res) => {
    // console.log('/token/:id', req.params, req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { username,isPaid } = req.body;

    const sqlQuery = `UPDATE users SET
     ${isPaid ? ` boughtCourses=${isPaid}` : ''} ,updated=now()
     WHERE telegram='${username}'`;

     sql.query(sqlQuery, (err) => {
       if (err) {
          console.log(err)
         return res.status(500).json({ code: 500, message: 'There was an error!', error: err.code });
       }
       return res.status(200).json({ code: 200, message: `User [${username}] changed` });
     });

    return null;
  },

);

router.delete(
  '/collections/:collectionId',
  param('collectionId').exists().isInt({ min: 3, max: 10 }).withMessage('Collection-ID should be in range between 3-10'),
  (req, res) => {
    // console.log('/collections/:collectionId');

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { collectionId } = req.params;
    const sqlQuery = `DELETE FROM collections WHERE collection_id='${collectionId}';`;
    // console.log(sqlQuery)

    sql.query(sqlQuery, (err) => {
      if (err) {
        return res.status(500).json({ code: 500, message: 'There was an error deleting the collection', error: err.code });
      }
      return res.status(200).json({ code: 200, message: 'Collection deleted', deletedCollection: collectionId });
    });
    return null;
  },
);

module.exports = router;
