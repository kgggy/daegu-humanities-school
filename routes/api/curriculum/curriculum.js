var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

// 커리큘럼 조회
router.get('/', async (req, res) => {
    const sql = "SELECT * FROM daegu_humanities_school.curriculum";
    try {
        connection.query(sql, function (err, results) {
            if (err) {
                console.log(err);
            }
            res.json(results);
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;