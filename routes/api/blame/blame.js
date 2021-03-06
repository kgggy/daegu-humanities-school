var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//신고하기
router.get('/', async (req, res) => {
    try {
        var targetUid = req.query.targetUid == undefined ? "" : req.query.targetUid;
        const param = [req.query.uid, req.query.blameContent, targetUid, req.query.targetType, req.query.targetContentId];
        const sql = "call blameInsert (?, ?, ?, ?, ?);";
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