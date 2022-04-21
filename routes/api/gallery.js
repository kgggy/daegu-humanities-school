var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;

//갤러리 글 전체 목록 조회
router.get('/', async (req, res) => {
    try {
        const sql = "select * from file group by boardId having substring(boardId, 1, 1) = 'g'";
        let gallerys;
        connection.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            gallerys = results;
            res.status(200).json(gallerys);
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//각 커뮤니티별 글 상세조회
router.get('/one', async (req, res) => {
    try {
        const param = [req.query.galleryId, req.query.galleryId, req.query.uid];
        // const sql1 = "update gallery set galleryHit= galleryHit + 1 where galleryId = ?";
        const sql2 = "select *\
                        from gallery n\
                   left join file f on f.boardId = n.galleryId\
                       where n.galleryId = ?;\
                       call selectOneBoard(?, ?, @hitAll);\
                       select @hitAll";
        let gallery;
        let hitAll;
        // connection.query(sql1, param, (err, row) => {
        //     if (err) {
        //         console.error(err);
        //         res.json({
        //             msg: "hit query error"
        //         });
        //     }
        connection.query(sql2, param, (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "select query error"
                });
            }
            gallery = result[0];
            hitAll = result[2];
            res.status(200).json({
                gallery: gallery,
                hitAll: hitAll
            });
        });
        // });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;