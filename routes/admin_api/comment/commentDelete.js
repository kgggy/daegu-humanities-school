var express = require('express');
var router = express.Router();                
var connection = require('../../../config/db').conn;

//댓글 삭제
router.get('/', async (req, res) => {
    try {
        const param = req.query.cmtId;
        const sql = "delete from comment where cmtId = ?";
        connection.query(sql, param, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/admin/commentSelect?boardId=' + req.query.boardId);
        })
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;