var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//조회한 사람 목록 조회
router.get('/', async (req, res) => {
    try {
        const param = req.query.boardId;
        const sql = "select u.uid, u.userName, u.userImg\
                      from hitCount h\
                 left join user u on u.uid = h.uid\
                     where boardId = ?";
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