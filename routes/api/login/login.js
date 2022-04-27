var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//이름, 전화번호로 회원 유무 검색
router.post('/', async (req, res) => {
    try {
        const sql = "select * from user where userName = ? and userPhone = ?";
        const param = [req.body.userName, req.body.userPhone];
        connection.query(sql, param, (err, results) => {
            // console.log(results);
            if (err) {
                console.log(err);
            }
            if (results.length > 0) {
                res.json({
                    msg: 'success',
                    uid: results[0].uid
                });
            } else {
                res.json({
                    msg: 'fail'
                })
            }
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;