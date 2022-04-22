var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//공지사항, 갤러리, 경조사 댓글 전체조회
router.get('/', async (req, res) => {
    try {
        const param = [req.query.boardId];
        const sql = "select c.*, u.userName from comment c left join user u on u.uid = c.uid where boardId = ?";
        connection.query(sql, param, (err, results) => {
            if (err) {
                res.json({
                    msg: "query error"
                });
            }
            res.json(results);
        })
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;