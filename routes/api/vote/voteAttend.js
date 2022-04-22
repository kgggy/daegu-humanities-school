var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//투표하기
router.get('/', async (req, res) => {
    try {
        const sql = "call voteCheckUpdate(?, ?, ?)"
        const param = [req.query.uid, req.query.eventId, req.query.choose];
        connection.query(sql, param, (err) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            res.json({
                msg: 'success'
            });
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
module.exports = router;