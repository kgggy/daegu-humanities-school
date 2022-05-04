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

//게시글, 댓글 상세보기
router.get('/blameDetail', (req, res) => {
    try {
        if(req.query.blameDiv == '0') {
            //게시글
            const param = req.query.boardId;
            const boardDivId = req.query.boardDivId;
            const sql = "select b.*,date_format(boardDate, '%Y-%m-%d') as boardDateFmt,\
                                    (select count(*) from hitCount where hitCount.boardId = b.boardId) as hitCount,\
                                    f.fileRoute from board b left join file f on b.boardId = f.boardId\
                                    where b.boardId = ?";
    
            connection.query(sql, param, (err, result) => {
                if (err) {
                    res.json({
                        msg: "select query error"
                    });
                }
                let route = req.app.get('views') + '/board/brd_viewForm';
                res.render(route, {
                    result: result,
                    boardName: boardName,
                    boardDivId: boardDivId
                });
            });
        } else {
            //댓글
            const param = req.query.blameId;
            const sql = "select date_format(cmtDate, '%Y-%m-%d') as cmtDateFmt,\
                                b.targetUserName, b.uid, c.cmtId, c.cmtContent, c.cmtDate from blame b\
                      left join comment c on c.cmtId = b.targetContentId\
                          where b.blameId = ?";
            connection.query(sql, param, (err, result) => {
                if (err) {
                    console.log(err);
                }
                let route = req.app.get('views') + '/blame/blameDetail';
                    res.render(route, {
                    result: result
                });
            })
        }
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;