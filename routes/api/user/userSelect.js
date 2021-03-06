var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;
var models = require('../../../models');

// 전체 회원 목록
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    let user;
    let userNum;
    let userAuth;
    var sql = "";
    var param = [];
    // console.log(req.query.page != 'null')
    // console.log(req.query.page != undefined)
    if (req.query.page != 'null') {
      sql = "select * from user where uid <= 10000 limit 15 offset ?";
      param = page * 15;
    } else {
      sql = "select * from user where uid <= 10000";
    }
    connection.query(sql, param, (err, results, fields) => {
      if (err) {
        console.log(err);
      }
      user = results;
      const userNumSql = "select distinct userNum from user where userNum is not null and userNum != ''  order by field(userNum, '기수') desc, userNum asc;";
      connection.query(userNumSql, (err, results) => {
        if (err) {
          console.log(err);
        }
        userNum = results;
        const userAuthSql = "select distinct userAuth from user where userAuth is not null and userAuth != '' order by field(userAuth,'부회장','회장','전체') desc, userAuth asc;";
        connection.query(userAuthSql, async (err, results) => {
          if (err) {
            console.log(err);
          }
          userAuth = results;
          // console.log(userAuth)
          //회원 이미지들 가져오기
          var userImgs;
          for (i = 0; i < user.length; i++) {
            // (function (i) {
            userImgs = await models.file.findAll({
              where: {
                uid: user[i].uid
              },
              attributes: ["fileRoute", "fileOrgName", "fileType"],
              raw: true
            })
            user[i]['userImgs'] = await userImgs
            // })(i);
          }
          res.status(200).json({
            user: user,
            userNum: userNum,
            userAuth: userAuth
          });
        });
      });
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

//회원 검색
router.get('/search', async (req, res) => {
  const page = parseInt(req.query.page);
  var userNum = req.query.userNum == undefined ? "" : req.query.userNum; //기수
  var userAuth = req.query.userAuth == undefined ? "" : req.query.userAuth; //직책
  var userCrew = req.query.userCrew == undefined ? "" : req.query.userCrew; //동아리
  var searchText = req.query.searchText == undefined ? "" : req.query.searchText; //이름, 소속
  var param = [];
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
    sql += " and (u.userName like '%" + searchText + "%' or u.userJob like '%" + searchText + "%')";
  }
  if (req.query.page != 'null') {
    sql += " order by u.uid limit 15 offset ?;"
    param = page * 15;
  } else {
    sql += " order by u.uid";
  }
  try {
    connection.query(sql, param, function (err, results) {
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