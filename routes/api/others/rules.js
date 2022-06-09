var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

// 총칙 파일 다운로드
router.get('/', async (req, res) => {
  try {
    const sql = "select * from greeting where id = 2";
    connection.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json({
          msg: "query error"
        });
      }
      res.status(200).json(result)
    })
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;