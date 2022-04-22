var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//댓글 삭제
router.delete('/', async (req, res) => {
    try {
        const param = req.query.cmtId;
        const sql = "delete from comment where cmtId = ?";
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