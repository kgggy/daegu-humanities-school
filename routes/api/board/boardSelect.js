var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//각 커뮤니티별 글 전체 목록 조회
router.get('/', async (req, res) => {
    try {
        const param = [req.query.boardDivId, req.query.crewDiv];
        const sql = "select *\
                       from board b\
                  left join boardDiv d on b.boardDivId = d.boardDivId\
                      where b.boardDivId = ? and b.crewDiv = ?";
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