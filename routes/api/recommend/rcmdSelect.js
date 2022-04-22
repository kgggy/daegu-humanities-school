var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//좋아요한 유저목록 조회
router.get('/', async (req, res) => {
    const param = req.query.boardId;
    try {
        const sql = "select r.rcmdId, r.boardId, u.userName, u.uid, u.userImg\
                       from recommend r\
                  left join user u on r.uid = u.uid\
                      where boardId = ? and u.uid < 10000";
        let likeUsers;
        connection.query(sql, param, (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            likeUsers = result;
            res.status(200).json(likeUsers);
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;