var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//행사 목록
router.get('/', async (req, res) => {
    try {
        const sql = "call selectEvent(?, ?, @yes, @nono, @undefine);"
        connection.query(sql, [req.query.uid, req.query.crewDiv], (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            res.status(200).json(result[0]);
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;