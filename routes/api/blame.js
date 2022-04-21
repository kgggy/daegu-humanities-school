var express = require('express');
var router = express.Router();

// DB 커넥션 생성
var connection = require('../../config/db').conn;

//신고하기
router.get('/', async (req, res) => {
    try {
        var targetUid = req.query.targetUid == undefined ? "10000" : req.query.targetUid;
        const param = [req.query.uid, req.query.targetContentId, targetUid, req.query.targetType, req.query.blaContent];
        const sql = "insert into blame(uid, targetContentId, targetUid, targetType, blaContent) values(?, ?, ?, ?, ?);";
        connection.query(sql, param, (err) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            res.status(200).json({
                msg: 'success'
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;