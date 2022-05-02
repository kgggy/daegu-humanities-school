var express = require('express');
var router = express.Router();           
var connection = require('../../../config/db').conn;

//사용자 전체조회
router.get('/', async (req, res) => {
  var page = req.query.page;
  var searchType1 = req.query.searchType1 == undefined ? "" : req.query.searchType1;
  var searchType2 = req.query.searchType2 == undefined ? "" : req.query.searchType2;
  var searchType3 = req.query.searchType3 == undefined ? "" : req.query.searchType3;
  var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
  var keepSearch = "&searchType1=" + searchType1 +
    "&searchType2=" + searchType2 + "&searchType3=" + searchType3 + "&searchText=" + searchText;

  var sql = "select *,\
                   concat(substr(userPhone, 1, 3), '-',  substr(userPhone, 4, 4), '-', substr(userPhone, 8, 4)) as userPhone,\
                   concat(substr(officePhone, 1, 3), '-',  substr(officePhone, 4, 4), '-', substr(officePhone, 8, 4)) as officePhone\
              from user where uid <= 10000";

  if (searchType1 != '') {
    sql += " and userNum = '" + searchType1 + "' \n";
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
  sql += " order by uid desc;"
  try {
    connection.query(sql, function (err, results) {
      var countPage = 10; //하단에 표시될 페이지 개수
      var page_num = 10; //한 페이지에 보여줄 개수
      var last = Math.ceil((results.length) / page_num); //마지막 장
      var endPage = Math.ceil(page / countPage) * countPage; //끝페이지(10)
      var startPage = endPage - countPage; //시작페이지(1)
      if (err) {
        console.log(err);
      }

      if (last < endPage) {
        endPage = last
      };
      let route = req.app.get('views') + '/user/user';
      res.render(route, {
        searchType1: searchType1,
        searchType2: searchType2,
        searchType3: searchType3,
        searchText: searchText,
        results: results,
        page: page, 
        length: results.length - 1, 
        page_num: page_num,
        countPage: countPage,
        startPage: startPage,
        endPage: endPage,
        pass: true,
        last: last,
        keepSearch: keepSearch
      });
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;