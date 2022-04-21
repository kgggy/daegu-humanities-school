var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;
//인삿말 조회
router.get('/', async (req, res) => {
    try {
        let greeting;
        const sql = "select * from greeting";
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            greeting = result;
            res.status(200).json(greeting);
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;