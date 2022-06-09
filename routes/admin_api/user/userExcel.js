var express = require('express');
var router = express.Router();
var nodeExcel = require('excel-export');
var connection = require('../../../config/db').conn;

//엑셀 다운로드
router.get('/', async (req, res) => {
  var searchType1 = req.query.searchType1 == undefined ? "" : req.query.searchType1;
  var searchType2 = req.query.searchType2 == undefined ? "" : req.query.searchType2;
  var searchType3 = req.query.searchType3 == undefined ? "" : req.query.searchType3;
  var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
  var conf = {};

  conf.cols = [{
      caption: '번호',
      type: 'number',
      width: 8
    }, {
      caption: '기수',
      type: 'string',
      width: 8
    }, {
      caption: '회원명',
      captionStyleIndex: 1,
      type: 'string',
      width: 50
    }, {
      caption: '휴대번호',
      captionStyleIndex: 1,
      type: 'string',
      width: 30
    }, {
      caption: '전화번호',
      captionStyleIndex: 1,
      type: 'string',
      width: 8
    },
    {
      caption: '이메일',
      captionStyleIndex: 1,
      type: 'string',
      width: 30
    },
    {
      caption: '팩스',
      captionStyleIndex: 1,
      type: 'string',
      width: 30
    },
    {
      caption: '주소',
      captionStyleIndex: 1,
      type: 'string',
      width: 15
    }, {
      caption: '소속',
      captionStyleIndex: 1,
      type: 'string',
      width: 15
    }, {
      caption: '홈페이지',
      captionStyleIndex: 1,
      type: 'string',
      width: 12
    }, {
      caption: '동아리',
      captionStyleIndex: 1,
      type: 'string',
      width: 12
    }, {
      caption: '총동창회 직책',
      captionStyleIndex: 1,
      type: 'string',
      width: 12
    }, {
      caption: '골프회 직책',
      captionStyleIndex: 1,
      type: 'string',
      width: 12
    }, {
      caption: '산악회 직책',
      captionStyleIndex: 1,
      type: 'string',
      width: 12
    }, {
      caption: '설치',
      captionStyleIndex: 1,
      type: 'string',
      width: 12
    }
  ];

  var sql = "select *,\
                   concat(substr(userPhone, 1, 3), '-',  substr(userPhone, 4, 4), '-', substr(userPhone, 8, 4)) as userPhone,\
                   concat(substr(officePhone, 1, 3), '-',  substr(officePhone, 4, 4), '-', substr(officePhone, 8, 4)) as officePhone,\
                   (case when userCrew = 'all' then '' when userCrew = 'mt' then '산악회' when userCrew = 'gf' then '골프회' when userCrew = 'mtgf' then '총동창회 및 산악회' end) as userCrew\
              from user where 1=1";
  // console.log(searchType1 + "22222222")
  if (searchType1 != '') {
    sql += " and userNum = '" + searchType1 + "' \n";
    console.log(searchType1)
  }
  if (searchType2 != '') {
    sql += " and userAuth = '" + searchType2 + "' \n";
  }
  if (searchType3 != '') {
    sql += " and userCrew = '" + searchType3 + "' \n";
  }
  if (searchText != '') {
    sql += " and (userJob like '%" + searchText + "%' or userName like '%" + searchText + "%')";
  }
  sql += " order by userNum;"

  try {
    connection.query(sql, function (err, results) {
      if (err) {
        console.log(err);
      }
      var arr = [];
      for (var i = 0; i < results.length; i++) {

        //휴대번호
        var userPhoneFmt;
        if (results[i].userPhone == '--' || results[i].userPhone == undefined) {
          userPhoneFmt = ''
        } else {
          userPhoneFmt = results[i].userPhone;
        }
        //회사번호
        var officePhoneFmt;
        if (results[i].officePhone == '--') {
          officePhoneFmt = ''
        } else {
          officePhoneFmt = results[i].officePhone;
        }

        //주소
        var userAdres1;
        if (results[i].userAdres1 == '' || results[i].userAdres1 == undefined) {
          userAdres1 = ''
        } else {
          userAdres1 = results[i].userAdres1;
        }
        var userAdres2;
        if (results[i].userAdres2 == '' || results[i].userAdres2 == undefined) {
          userAdres2 = ''
        } else {
          userAdres2 = results[i].userAdres2;
        }
        var userAdres3;
        if (results[i].userAdres3 == '' || results[i].userAdres3 == undefined) {
          userAdres3 = ''
        } else {
          userAdres3 = results[i].userAdres3;
        }
        var userAdres4;
        if (results[i].userAdres4 == '' || results[i].userAdres4 == undefined) {
          userAdres4 = ''
        } else {
          userAdres4 = results[i].userAdres4;
        }

        var resultData = [
          i + 1,
          results[i].userNum,
          results[i].userName,
          userPhoneFmt,
          officePhoneFmt,
          results[i].userEmail,
          results[i].userFax,
          userAdres1 + ' ' + userAdres2 + ' ' + userAdres3 + ' ' + userAdres4,
          results[i].userJob,
          results[i].userUrl,
          results[i].userCrew,
          results[i].userAuth,
          results[i].gfPosition,
          results[i].mtPosition,
          results[i].userSocialDiv
        ];
        arr.push(resultData);
      }
      conf.rows = arr;
      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=" + "user.xlsx");
      res.end(result, 'binary');
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;