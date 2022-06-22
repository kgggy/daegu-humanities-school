var express = require('express');
var router = express.Router();

// DB 커넥션 생성\              
var connection = require('../../../config/db').conn;

//게시글 검색(ajax)
router.get('/', async (req, res) => {
    var page = req.query.page;
    const param = req.query.boardDivId;
    const crewDiv = req.query.crewDiv;
    var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
    var sql = "select b.*, c.*, u.userName, u.uid, date_format(boardDate, '%Y-%m-%d') as boardDatefmt, date_format(boardUpdDate, '%Y-%m-%d') as boardUpdDatefmt\
                 ,(select count(*) from comment c where c.boardId = b.boardId) as mcount\
                    from board b\
                    left join boardDiv c on c.boardDivId = b.boardDivId\
                    left join user u  on u.uid = b.uid\
                    where b.boardDivId = ? and b.crewDiv = ?";
    if (searchText != '') {
        sql += " and (b.boardTitle like '%" + searchText + "%' or b.boardContent like '%" + searchText + "%')";
    }
    sql += " order by boardDate desc";
    connection.query(sql, [param,crewDiv], (err, results) => {
        if (err) {
            console.log(err)
        }
        var countPage = 10; //하단에 표시될 페이지 개수
        var page_num = 10; //한 페이지에 보여줄 개수
        var last = Math.ceil((results.length) / page_num); //마지막 장
        var endPage = Math.ceil(page / countPage) * countPage; //끝페이지(10)
        var startPage = endPage - countPage; //시작페이지(1)
        // ajaxSearch = results;
        if (last < endPage) {
            endPage = last
        };
        res.send({
            ajaxSearch: results,
            page: page, //현재 페이지
            length: results.length - 1, //데이터 전체길이(0부터이므로 -1해줌)
            page_num: page_num,
            countPage: countPage,
            startPage: startPage,
            endPage: endPage,
            pass: true,
            last: last, 
            searchText: searchText,
            crewDiv: crewDiv
        });
        // console.log("page = " + page)
    });
});

module.exports = router;