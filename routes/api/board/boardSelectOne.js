var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;
var models = require('../../../models');

//각 커뮤니티별 글 상세 목록 조회
router.get('/', async (req, res) => {
    try {
        const param = [req.query.boardId, req.query.boardId, req.query.uid];
        const sql = "select *\
                      from board\
                     where boardId = ?;\
                      call selectOneBoard(?, ?, @hitAll);\
                    select @hitAll";
        let board;
        let hitAll;
        connection.query(sql, param, async (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            board = result[0];
            hitAll = result[2];
            //첨부파일 가져오기
            var files;
            for (i = 0; i < board.length; i++) {
                files = await models.file.findAll({
                    where: {
                        uid: board[i].uid
                    },
                    attributes: ["fileRoute", "fileOrgName", "fileType"],
                    raw: true
                })
                // console.log(files)
                board[i]['files'] = files;
            }
            res.status(200).json({
                board: board,
                hitAll: hitAll
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;