var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//신고 여러개 삭제
router.get('/', (req, res) => {
    const param = req.query.blameId;
    const str = param.split(',');
    for (var i = 0; i < str.length; i++) {
        const sql = "call blameComplate(?)";
        connection.query(sql, str[i], (err) => {
            if (err) {
                console.log(err)
            }
            res.send('<script>alert("신고내역이 처리되었습니다."); location.href="/admin/blameSelect?page=1";</script>');
        });
    }
});

module.exports = router;