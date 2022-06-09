var express = require('express');
var router = express.Router();     
var connection = require('../../../config/db').conn;

//사용자 상세조회
router.get('/', async (req, res) => {
  try {
    var searchType1 = req.query.searchType1 == undefined ? "" : req.query.searchType1;
    var searchType2 = req.query.searchType2 == undefined ? "" : req.query.searchType2;
    var searchType3 = req.query.searchType3 == undefined ? "" : req.query.searchType3;
    var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
    var keepSearch = "&searchType1=" + searchType1 +
      "&searchType2=" + searchType2 + "&searchType3=" + searchType3 + "&searchText=" + searchText;
    var page = req.query.page;
    const param = [req.query.uid, req.query.uid, req.query.uid];
    const sql = "select u.*, f.fileRoute,\
                        concat(substr(u.userPhone, 1, 3), '-',  substr(u.userPhone, 4, 4), '-', substr(u.userPhone, 8, 4)) as userPhoneFmt,\
                        concat(substr(u.officePhone, 1, 3), '-',  substr(u.officePhone, 4, 3), '-', substr(u.officePhone, 7, 4)) as officePhoneFmt\
                   from user u\
                   left join file f on f.uid = u.uid\
                  where u.uid = ?";
    connection.query(sql, param, function (err, result) {
      if (err) {
        console.log(err);
      }
      let route = req.app.get('views') + '/user/user_viewForm';
      res.render(route, {
        result: result,
        page: page,
        searchType1: searchType1,
        searchType2: searchType2,
        searchType3: searchType3,
        searchText: searchText,
        keepSearch: keepSearch
      });
    });

  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;