var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;
//광고 조회
router.get('/', async (req, res) => {
    try {
        const param = req.query.bannerDiv; 
        const sql = "select b.*, f.* from banner b left join file f on f.bannerId = b.bannerId where bannerDiv = ? order by 4"
        connection.query(sql, param, (err, result) => {
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