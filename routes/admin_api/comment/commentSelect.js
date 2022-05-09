var express = require('express');
var router = express.Router();                
var connection = require('../../../config/db').conn;

//댓글 전체조회
router.get('/', async (req, res) => {
    try {
        const param = [req.query.boardId, req.query.boardId];
        const sql = "select c.*, u.userName as userNick, date_format(cmtDate, '%Y-%m-%d') as cmtDatefmt,\
                            (select count(*) from comment where boardId = ? group by boardId) as cmtCount\
                       from comment c\
                  left join user u on u.uid = c.uid\
                      where c.boardId = ? order by cmtDate desc";
        
        connection.query(sql, param, (err, results) => {
            if (err) {
                console.log(err);
            }
            //cmtviewForm 폼 바꾸기
            const boardId = req.query.boardId;
            let route = req.app.get('views') + '/comment/cmtViewForm';
                res.render(route, {
                results: results,
                boardId: boardId
            });
        })
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;