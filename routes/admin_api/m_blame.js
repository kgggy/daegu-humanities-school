var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;

//신고 전체조회
router.get('/blame', async (req, res) => {
    try {
        var page = req.query.page;
        var blameDiv = req.query.blameDiv == undefined ? "" : req.query.blameDiv;
        var sql = "select *, date_format(blameDate, '%Y-%m-%d') as blameDatefmt\
                    from blame where 1=1";
        if (blameDiv != '') {
            sql += " and blameDiv = '" + blameDiv + "'";
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
                blameDiv: blameDiv
            });
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//신고 여러개 삭제
router.get('/blameDelete', (req, res) => {
     const param = req.query.blameId;
     const page = req.query.page;
     const str = param.split(',');
    for (var i = 0; i < str.length; i++) {
        const sql = "call blameComplate(?)";
        connection.query(sql, str[i], (err, result) => {
            if (err) {
                console.log(err)
            }
        });
    }
    res.send('<script>alert("신고내역이 처리되었습니다."); location.href="/admin/m_blame/blameAll?page=1";</script>');
});



module.exports = router;