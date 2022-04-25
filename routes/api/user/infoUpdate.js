var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//푸시토큰, os종류 업데이트
router.post('/', async (req, res) => {
  const sql = "update user set oneSignalId = ?, userSocialDiv = ? where uid = ?";
  const param = [req.body.oneSignalId, req.body.userSocialDiv, req.body.uid];
  try {
    connection.query(sql, param, function (err, results) {
      if (err) {
        console.log(err);
      }
      res.json({
        msg: "success"
      });
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;