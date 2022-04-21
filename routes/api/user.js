var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;

// 전체 회원 목록
router.get('/all', async (req, res) => {
  try {
    let user;
    connection.query('select * from user where uid <= 10000', (err, results, fields) => {
      if (err) {
        console.log(err);
      }
      user = results;
      res.status(200).json(user);
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

//회원 검색
router.get('/search', async (req, res) => {
  var userPosition = req.query.userPosition == undefined ? "" : req.query.userPosition;
  var userAdres2 = req.query.userAdres2 == undefined ? "" : req.query.userAdres2;
  var userType = req.query.userType == undefined ? "" : req.query.userType;
  // var searchType4 = req.query.searchType4 == undefined ? "" : req.query.searchType4;
  var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
  var sql = "select * from user where uid <= 10000";
  if (userPosition != '') {
    sql += " and userPosition = '" + userPosition + "' \n";
  }
  if (userAdres2 != '') {
    sql += " and userAdres2 like '" + userAdres2 + "' \n";
  }
  if (userType != '') {
    sql += " and userType = '" + userType + "' \n";
  }
  // if (searchType4 != '') {
  //   sql += " and userRole = '" + searchType4 + "' \n";
  // }
  if (searchText != '') {
    sql += " and (userName like '%" + searchText + "%' or hosName like '%" + searchText + "%') order by uid";
  }
  try {
    connection.query(sql, function (err, results) {
      if (err) {
        console.log(err);
      }
      res.json(
        results
      );
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

//푸시토큰, os종류 업데이트
router.post('/infoUpdate', async (req, res) => {
  const sql = "update user set oneSignalId = ?, userSocialDiv = ? where uid = ?";
  const param = [req.body.oneSignalId, req.body.userSocialDiv, req.body.uid];
  try {
    connection.query(sql, param, function (err, results) {
      if (err) {
        console.log(err);
      }
      res.json({
        msg : "success"
      });
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;