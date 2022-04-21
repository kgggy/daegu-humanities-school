var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;

//조회한 사람 목록보기
router.get('/hitUserList', async (req, res) => {
    const param = req.query.boardId;
    try {
        const sql = "select u.uid, u.userName, u.userImg\
                       from hitCount h\
                  left join user u on u.uid = h.uid\
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