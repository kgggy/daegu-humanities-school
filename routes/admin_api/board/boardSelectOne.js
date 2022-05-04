var express = require('express');
var router = express.Router();     
var connection = require('../../../config/db').conn;

//게시글 상세조회
router.get('/', async (req, res) => {
    try {
        var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
        var boardName = req.query.boardName;
        const page = req.query.page;
        const param = req.query.boardId;
        const boardDivId = req.query.boardDivId;
        const crewDiv = req.query.crewDiv;
        const sql = "select b.*,date_format(boardDate, '%Y-%m-%d') as boardDateFmt,\
                            (select count(*) from hitCount where hitCount.boardId = b.boardId) as hitCount,\
                            f.fileRoute from board b left join file f on b.boardId = f.boardId\
                            where b.boardId = ?";

        connection.query(sql, param, (err, result) => {
            if (err) {
                res.json({
                    msg: "select query error"
                });
            }
            let route = req.app.get('views') + '/board/brd_viewForm';
            res.render(route, {
                result: result,
                page: page,
                searchText: searchText,
                boardName: boardName,
                crewDiv: crewDiv,
                boardDivId: boardDivId
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;