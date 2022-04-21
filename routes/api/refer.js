var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;

//공지사항 글 전체 목록 조회
router.get('/', async (req, res) => {
    try {
        const sql = "select * from reference order by referWritDate desc";
        let refers;
        connection.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            refers = results;
            res.status(200).json(refers);
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//각 커뮤니티별 글 상세조회
router.get('/one', async (req, res) => {
    try {
        const param = [req.query.referId, req.query.referId, req.query.uid];
        const sql = "select *\
                        from reference n\
                   left join file f on f.boardId = n.referId\
                       where n.referId = ?;\
                       call selectOneBoard(?, ?, @hitAll);\
                       select @hitAll";
        let refer;
        let hitAll;
        connection.query(sql, param, (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "select query error"
                });
            }
            refer = result[0];
            hitAll = result[2];
            res.status(200).json({
                refer: refer,
                hitAll: hitAll
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//파일 다운로드
// router.get('/download/:referId/:fileNo', async (req, res) => {
//     try {
//         const param = [req.params.referId, req.params.fileId];
//         const sql = "select fileRoute from referFile where referId = ? and fileId = ?";
//         let route;
//         connection.query(sql, param, (err, result) => {
//             if (err) {
//                 console.error(err);
//                 res.json({
//                     msg: "query error"
//                 });
//             }
//             route = result;
//             console.log(result);
//             res.status(200).json(route);
//         });
//     } catch (error) {
//         res.status(401).send(error.message);
//     }
// });

module.exports = router;