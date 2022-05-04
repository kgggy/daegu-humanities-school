const multer = require("multer");
const path = require('path');
const fs = require('fs');

var express = require('express');
var router = express.Router();

// DB 커넥션 생성                   
var connection = require('../../../config/db').conn;

//후원목록조회
router.get('/', async (req, res) => {
    const bannerDiv = req.query.bannerDiv;
    const page = req.query.page;
    var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
    var sql = "select * from banner where bannerDiv = ?";
    if (searchText != '') {
        sql += " and (bannerTitle like '%" + searchText + "%')";
    }
    sql += " order by 1 desc";
    try {
        connection.query(sql, bannerDiv, (err, results) => {
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
            let route = req.app.get('views') + '/banner/banner';
            res.render(route, {
                bannerDiv: bannerDiv,
                searchText: searchText,
                results: results,
                page: page, //현재 페이지
                length: results.length - 1, //데이터 전체길이(0부터이므로 -1해줌)
                page_num: page_num,
                countPage: countPage,
                startPage: startPage,
                endPage: endPage,
                pass: true,
                last: last
            });
            
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
module.exports = router;
