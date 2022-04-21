var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;

//추천
router.get('/add/board', async (req, res) => {
    try {
        
        const sql = "call recommendCheck(?,?)";
        const param = [req.query.boardId, req.query.uid];
        connection.query(sql, param, (err, row) => {
            if (err) {
                console.error(err);
                res.json({
                    msg: "hit query error"
                });
            }
            res.json({
                msg: "success"
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//좋아요한 유저목록 조회
router.get('/likeUserList', async (req, res) => {
    const param = req.query.boardId;
    try {
        const sql = "select r.recommendId, r.boardId, u.userName, u.uid, u.userPosition, u.userImg\
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