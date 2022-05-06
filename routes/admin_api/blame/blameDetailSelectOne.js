var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//게시글, 댓글 상세보기
router.get('/', (req, res) => {
    try {
        const param = req.query.blameId;
        var sql = "";
        if (req.query.blameDiv == '0') {
            //게시글
            sql = "select *, date_format(boardDate, '%Y-%m-%d') as boardDateFmt\
                     from blame b\
                left join board d on d.boardId = b.targetContentId\
                left join file f on b.targetContentId = f.boardId\
                    where b.blameId = ?";
        } else {
            //댓글
            sql = "select date_format(cmtDate, '%Y-%m-%d') as cmtDateFmt, b.blameDiv,\
                                b.targetUserName, b.uid, c.cmtId, c.cmtContent, c.cmtDate from blame b\
                      left join comment c on c.cmtId = b.targetContentId\
                          where b.blameId = ?";
        }
        connection.query(sql, param, (err, result) => {
            if (err) {
                console.log(err);
            }
            let route = req.app.get('views') + '/blame/blameDetail';
            res.render(route, {
                result: result
            });
        })

    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;