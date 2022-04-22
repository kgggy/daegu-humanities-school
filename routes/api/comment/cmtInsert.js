var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//공지사항, 갤러리, 경조사 게시글의 댓글 달기
router.post('/', async (req, res) => {
    try {
        const param = [req.body.boardId, req.body.uid, req.body.cmtContent];
        const sql = "insert into comment(boardId, uid, cmtContent) values(?, ?, ?)";
        connection.query(sql, param, (err, row) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            res.json({
                msg: "success"
            });
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;