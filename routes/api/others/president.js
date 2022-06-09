var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//역대회장 조회
router.get('/', async (req, res) => {
  try {
    const sql = "select * from president p left join user u on p.uid = u.uid;";
    let route;
    connection.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json({
          msg: "query error"
        });
      }
      route = result;
      res.status(200).json(route);
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;