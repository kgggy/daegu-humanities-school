var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;

//공지사항 글 전체 목록 조회
router.get('/', async (req, res) => {
    try {
        const sql = "select * from notice order by noticeFix desc, noticeWritDate desc";
        let notices;
        connection.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            notices = results;
            res.status(200).json(notices);
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//각 커뮤니티별 글 상세조회
router.get('/one', async (req, res) => {
    try {
        const param = [req.query.noticeId, req.query.noticeId, req.query.uid];
        const sql = "select *\
                        from notice n\
                   left join file f on f.boardId = n.noticeId\
                       where n.noticeId = ?;\
                       call selectOneBoard(?, ?, @hitAll);\
                       select @hitAll";
        let notice;
        let hitAll;
        connection.query(sql, param, (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "select query error"
                });
            }
            notice = result[0];
            hitAll = result[2];
            res.status(200).json({
                notice: notice,
                hitAll: hitAll
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;