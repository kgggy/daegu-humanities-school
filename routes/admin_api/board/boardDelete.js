var express = require('express');
var router = express.Router();
const fs = require('fs');
var connection = require('../../../config/db').conn;

//게시글 여러개 삭제
router.get('/brdsDelete', (req, res) => {
    var crewDiv = req.query.crewDiv;
    var boardDivId = req.query.boardDivId;
    const param = req.query.boardId;
    const str = param.split(',');
    for (var i = 0; i < str.length; i++) {
        let fileRoute = [];
        const sql1 = "select fileRoute from file where boardId = ?";
        connection.query(sql1, str[i], (err, result) => {
            if (err) {
                console.log(err)
            }
            fileRoute = result;
            if (fileRoute != undefined) {
                for (let j = 0; j < fileRoute.length; j++) {
                    fs.unlinkSync(fileRoute[j].fileRoute, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        return;
                    });
                }
            }
        });
        const sql = "delete from board where boardId = ?;\
                        delete from file where boardId = ?;";
        connection.query(sql, [str[i], str[i]], (err) => {
            if (err) {
                console.log(err)
            }
        });
    }
    res.send('<script>alert("게시물이 삭제되었습니다."); location.href="/admin/boardMain?page=1&crewDiv=' +
        crewDiv + '&boardDivId=' + boardDivId + '";</script>');
});

//게시글 삭제
router.get('/brdDelete', async (req, res) => {
    try {
        const param = req.query.boardId;
        var crewDiv = req.query.crewDiv;
        var boardDivId = req.query.boardDivId;
        const sql = "delete from board where boardId = ?;\
                        delete from file where boardId = ?";
        connection.query(sql, [param,param], (err) => {
            if (err) {
                console.log(err);
            }
            if (req.query.fileRoute != undefined) {
                if (Array.isArray(req.query.fileRoute) == false) {
                    req.query.fileRoute = [req.query.fileRoute];
                }
                for (let i = 0; i < req.query.fileRoute.length; i++) {
                    fs.unlinkSync(req.query.fileRoute[i], (err) => {
                        if (err) {
                            console.log(err);
                        }
                        return;
                    });
                }
            }
            res.send('<script>alert("게시물이 삭제되었습니다."); location.href="/admin/boardMain?page=1&crewDiv=' +
                        crewDiv+'&boardDivId='+boardDivId+'";</script>');
        });
    } catch (error) {
        res.send(error.message);
    }
});

//첨부파일 삭제
router.post('/boardFileDelete', async (req, res) => {
    // console.log(req.body)
    const param = req.body.fileId;
    const fileRoute = req.body.fileRoute;
    const page = req.body.page;
    const searchText = req.body.searchText == undefined ? "" : req.body.searchText;
    const boardId = req.body.boardId;
    const boardName = req.body.boardName;
    try {
        const sql = "delete from file where fileId = ?";
        connection.query(sql, param, (err, row) => {
            if (err) {
                console.log(err)
            }
            fs.unlinkSync(fileRoute.toString(), (err) => {
                if (err) {
                    console.log(err);
                }
                return;
            });
        })
    } catch (error) {
        if (error.code == "ENOENT") {
            console.log("게시판 첨부파일 삭제 에러 발생");
        }
    }
    res.redirect('/admin/boardUpdate?page=' + page + '&searchText=' + searchText + '&boardId=' + boardId + '&boardName' + boardName);
});
module.exports = router;