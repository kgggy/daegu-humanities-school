var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//게시판 메인
router.get('/', async (req, res) => {
    try {
        const param = req.query.boardDivId;
        var sql = "";
        if (param == '2') {
            sql = "select * from board b\
                left join boardDiv d on b.boardDivId = d.boardDivId\
                left join file f on f.boardId = b.boardId\
               where b.boardDivId = 2\
            group by f.boardId\
            order by b.boardId desc limit 3";
        }
        sql = "select * from board b\
            left join boardDiv d on b.boardDivId = d.boardDivId\
                where b.boardDivId = ?\
             order by b.boardId desc limit 3";
        connection.query(sql, param, (err, results) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;