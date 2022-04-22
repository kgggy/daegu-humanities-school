var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;
//광고 조회
router.get('/', async (req, res) => {
    try {
        const sql = "select * from banner order by 1"
        connection.query(sql, (err, result) => {
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