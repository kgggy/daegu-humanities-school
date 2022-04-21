var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;

//공지사항 댓글 전체조회
router.get('/notice/:noticeId', async (req, res) => {
    try {
        const param = [req.params.noticeId];
        const sql = "select c.*, u.userName from comment c left join user u on u.uid = c.uid where boardId = ?";
        let comment;
        connection.query(sql, param, (err, results) => {
            if (err) {
                res.json({
                    msg: "query error"
                });
            }
            comment = results;
            res.json(comment);
        })
    } catch (error) {
        res.send(error.message);
    }
});

//갤러리 댓글 전체조회
router.get('/gallery/:galleryId', async (req, res) => {
    try {
        const param = [req.params.galleryId];
        const sql = "select c.*, u.userName from comment c left join user u on u.uid = c.uid where boardId = ?";
        let comment;
        connection.query(sql, param, (err, results) => {
            if (err) {
                res.json({
                    msg: "query error"
                });
            }
            comment = results;
            res.json(comment);
        })
    } catch (error) {
        res.send(error.message);
    }
});

//자료실 댓글 전체조회
router.get('/refer/:referId', async (req, res) => {
    try {
        const param = [req.params.referId];
        const sql = "select c.*, u.userName from comment c left join user u on u.uid = c.uid where boardId = ?";
        let comment;
        connection.query(sql, param, (err, results) => {
            if (err) {
                res.json({
                    msg: "query error"
                });
            }
            comment = results;
            res.json(comment);
        })
    } catch (error) {
        res.send(error.message);
    }
});

//공지사항 게시글의 댓글 달기
router.post('/notice/insert', async (req, res) => {
    try {
        const param = [req.body.noticeId, req.body.uid, req.body.cmtContent];
        const sql = "insert into comment(boardId, uid, cmtContent) values(?, ?, ?)";
        connection.query(sql, param, (err, row) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            res.json({
                msg: "success"
            });
        });
    } catch (error) {
        res.send(error.message);
    }
});

//갤러리 게시글의 댓글 달기
router.post('/gallery/insert', async (req, res) => {
    try {
        const param = [req.body.galleryId, req.body.uid, req.body.cmtContent];
        const sql = "insert into comment(boardId, uid, cmtContent) values(?, ?, ?)";
        connection.query(sql, param, (err, row) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            res.json({
                msg: "success"
            });
        });
    } catch (error) {
        res.send(error.message);
    }
});

//자료실 게시글의 댓글 달기
router.post('/refer/insert', async (req, res) => {
    try {
        const param = [req.body.referId, req.body.uid, req.body.cmtContent];
        const sql = "insert into comment(boardId, uid, cmtContent) values(?, ?, ?)";
        connection.query(sql, param, (err, row) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            res.json({
                msg: "success"
            });
        });
    } catch (error) {
        res.send(error.message);
    }
});

//댓글 삭제
router.delete('/delete/:cmtId', async (req, res) => {
    try {
        const param = [req.params.cmtId];
        const sql = "delete from comment where cmtId = ?";
        connection.query(sql, param, (err, row) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            res.json({
                msg: "success"
            });
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;