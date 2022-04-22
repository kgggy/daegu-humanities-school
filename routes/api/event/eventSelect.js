var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//행사 목록
router.get('/', async (req, res) => {
    try {
        const sql = "select *,\
                           (select choose from vote v where e.eventId = v.eventId and uid = ?) as voteyn\
                       from event e\
                   order by eventId desc"
        connection.query(sql, req.query.uid, (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            res.status(200).json(result);
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;