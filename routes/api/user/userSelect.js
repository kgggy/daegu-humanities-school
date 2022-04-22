var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

// 전체 회원 목록
router.get('/', async (req, res) => {
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
  var userNum = req.query.userNum == undefined ? "" : req.query.userNum;
  var userAuth = req.query.userAuth == undefined ? "" : req.query.userAuth;
  var userCrew = req.query.userCrew == undefined ? "" : req.query.userCrew;
  var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
  var sql = "select u.*, h.historyAuth from user u left join history h on u.uid = h.uid where u.uid <= 10000";
  if (userNum != '') {
    sql += " and u.userNum = '" + userNum + "' \n";
  }
  if (userAuth != '') {
    sql += " and u.userAuth = '" + userAuth + "' \n";
  }
  if (userCrew != '') {
    sql += " and u.userCrew = '" + userCrew + "' \n";
  }
  if (searchText != '') {
    sql += " and (u.userName like '%" + searchText + "%' or u.userJob like '%" + searchText + "%') order by u.uid";
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

module.exports = router;