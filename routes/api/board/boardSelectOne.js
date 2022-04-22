var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//각 커뮤니티별 글 상세 목록 조회
router.get('/', async (req, res) => {
    try {
        const param = [req.query.boardId, req.query.boardId, req.query.uid];
        const sql = "select *\
                      from board b\
                 left join file f on f.boardId = b.boardId\
                     where b.boardId = ?;\
                      call selectOneBoard(?, ?, @hitAll);\
                    select @hitAll";
        let board;
        let hitAll;
        connection.query(sql, param, (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            board = result[0];
            hitAll = result[2];
            res.status(200).json({
                board: board,
                hitAll: hitAll
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;