var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;

//게시판 메인
// router.get('/', async (req, res) => {
//     let notices;
//     let gallerys;
//     let refers;
//     // let gallery = await models.gallery.findAndCountAll({
//     //     attributes: ["galleryId"],
//     //     group: "galleryId",
//     //     raw: true
//     // });
//     // console.log(gallery.count.length)
//     try {
//         const sql = "select noticeWritDate, noticeTitle from notice order by noticeFix desc, noticeWritDate desc limit 2";
//         connection.query(sql, (err, results) => {
//             if (err) {
//                 console.log(err);
//                 res.json({
//                     msg: "query error"
//                 });
//             }
//             notices = results;
//             const sql1 = "select referWritDate, referTitle from reference order by referWritDate desc limit 2";
//             connection.query(sql1, (err, results) => {
//                 if (err) {
//                     console.log(err);
//                     res.json({
//                         msg: "query error"
//                     });
//                 }
//                 refers = results;
//                 // for (let i = 0; i < gallery.count.length; i++) {
//                 const sql2 = "select * from file group by boardId; ";
//                 connection.query(sql2, (err, results) => {
//                     if (err) {
//                         console.log(err);
//                         res.json({
//                             msg: "query error"
//                         });
//                     }
//                     gallerys = results;
//                     res.status(200).json([{
//                         notices: notices,
//                         gallerys: gallerys,
//                         refers: refers
//                     }]);
//                 });
//                 // }
//             });
//         });
//     } catch (error) {
//         res.status(401).send(error.message);
//     }
// });

//게시판 메인
router.get('/', async (req, res) => {
    let notices;
    let gallerys;
    let refers;
    let event;
    let voteCount;
    try {
        const sql = "select noticeWritDate, noticeTitle from notice order by noticeFix desc, noticeWritDate desc limit 2";
        connection.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            notices = results;
            const sql1 = "select referWritDate, referTitle from reference order by referWritDate desc limit 2";
            connection.query(sql1, (err, results) => {
                if (err) {
                    console.log(err);
                    res.json({
                        msg: "query1 error"
                    });
                }
                refers = results;
                const sql2 = "select fileRoute, boardId from file where substring(boardId, 1, 1) = 'g' group by boardId limit 3";
                connection.query(sql2, (err, results) => {
                    if (err) {
                        console.log(err);
                        res.json({
                            msg: "query2 error"
                        });
                    }
                    gallerys = results;
                    const sql3 = "select *,\
                                        (select choose from vote v where e.eventId = v.eventId and uid = ?) as voteyn\
                                    from event e\
                                order by eventId desc limit 1;\
                                  call checkvote(@yes, @nono, @undefine);\
                                  select @yes, @nono, @undefine;"
                    connection.query(sql3, req.query.uid, (err, results) => {
                        if (err) {
                            console.log(err);
                            res.json({
                                msg: "query3 error"
                            });
                        }
                        event = results[0];
                        voteCount = results[2];
                        res.status(200).json([{
                            notices: notices,
                            gallerys: gallerys,
                            refers: refers,
                            event: event,
                            voteCount: voteCount
                        }]);
                    });
                });
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;