var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//신고 전체조회
router.get('/', async (req, res) => {
    try {
        var page = req.query.page;
        var targetType = req.query.targetType == undefined ? "" : req.query.targetType;
        var sql = "select *, date_format(blameDate, '%Y-%m-%d') as blameDatefmt,\
                         (select count(*) from board where blame.targetContentId = board.boardId) as boardCount\
                    from blame where 1=1";
        if (targetType != '') {
            sql += " and targetType = '" + targetType + "'";
        }
        sql += " order by blameDate desc"
        connection.query(sql, (err, results) => {
            var countPage = 10; //하단에 표시될 페이지 개수
            var page_num = 10; //한 페이지에 보여줄 개수
            var last = Math.ceil((results.length) / page_num); //마지막 장
            var endPage = Math.ceil(page / countPage) * countPage; //끝페이지(10)
            var startPage = endPage - countPage; //시작페이지(1)
            if (last < endPage) {
                endPage = last
            };
            if (err) {
                console.log(err);
            }
            let route = req.app.get('views') + '/blame/blame';
            res.render(route, {
                results: results,
                page: page, //현재 페이지
                length: results.length - 1, //데이터 전체길이(0부터이므로 -1해줌)
                page_num: page_num,
                countPage: countPage,
                startPage: startPage,
                endPage: endPage,
                pass: true,
                last: last,
                targetType: targetType
            });
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;