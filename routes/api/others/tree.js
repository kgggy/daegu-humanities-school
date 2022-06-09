var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//역대회장 조회
router.get('/', async (req, res) => {
  try {
    const sql = "select uid, userName, userAuth from user where userAuth in ('이사장', '학장', '원장', '교학처장', '행정실장')";
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