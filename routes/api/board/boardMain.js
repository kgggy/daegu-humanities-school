var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//게시판 메인
router.get('/', async (req, res) => {
    try {
        const param = req.query.boardDivId;
        let gallery;
        let notice;
        let refer;
        let event;
        let voteCount;
        const sql1 = "select * from board b\
                left join boardDiv d on b.boardDivId = d.boardDivId\
                left join file f on f.boardId = b.boardId\
               where b.boardDivId = 2\
            group by f.boardId\
            order by b.boardId desc limit 3";
        connection.query(sql1, (err, results) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            gallery = results;
            var sql2 = "select * from board b\
                left join boardDiv d on b.boardDivId = d.boardDivId\
                    where b.boardDivId = 1\
                 order by b.boardId desc limit 3";
            connection.query(sql2, (err, results) => {
                if (err) {
                    console.log(err);
                    res.json({
                        msg: "query error"
                    });
                }
                notice = results;
                var sql3 = "select * from board b\
                left join boardDiv d on b.boardDivId = d.boardDivId\
                    where b.boardDivId = 3\
                 order by b.boardId desc limit 3";
                connection.query(sql3, (err, results) => {
                    if (err) {
                        console.log(err);
                        res.json({
                            msg: "query error"
                        });
                    }
                    refer = results;
                    const sql4 = "select *,\
                                        (select choose from vote v where e.eventId = v.eventId and uid = ?) as voteyn\
                                    from event e\
                                order by eventId desc limit 1;\
                                  call checkvote(@yes, @nono, @undefine);\
                                  select @yes, @nono, @undefine;"
                    connection.query(sql4, req.query.uid, (err, results) => {
                        if (err) {
                            console.log(err);
                            res.json({
                                msg: "query3 error"
                            });
                        }
                        event = results[0];
                        voteCount = results[2];
                        res.status(200).json([{
                            notice: notice,
                            gallery: gallery,
                            refer: refer,
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