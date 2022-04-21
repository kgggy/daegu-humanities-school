var express = require('express');
var router = express.Router();                
var connection = require('../../config/db').conn;

//댓글 전체조회
router.get('/', async (req, res) => {
    try {
        const param = [req.query.boardId, req.query.boardId];
        const sql = "select c.*, u.userName as userNick, date_format(cmtWritDate, '%Y-%m-%d') as cmtDatefmt,\
                            (select count(*) from comment where boardId = ? group by boardId) as cmtCount\
                       from comment c\
                  left join user u on u.uid = c.uid\
                      where c.boardId = ? order by cmtWritDate desc";
        
        connection.query(sql, param, (err, results) => {
            if (err) {
                console.log(err);
            }
            //cmtviewForm 폼 바꾸기
            const boardId = req.query.boardId.substring(0, 1);
            let route = req.app.get('views') + '/m_comment/certiCont_cmtViewForm';
                res.render(route, {
                results: results,
                subboardId: boardId
            });
        })
    } catch (error) {
        res.send(error.message);
    }
});

//댓글 삭제
router.get('/cmtDelete', async (req, res) => {
    try {
        const param = req.query.cmtId;
        const sql = "delete from comment where cmtId = ?";
        connection.query(sql, param, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/admin/m_comment?boardId=' + req.query.boardId);
        })
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;