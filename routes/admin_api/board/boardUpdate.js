var express = require('express');
var router = express.Router();
const fs = require('fs');

const multer = require("multer");
const path = require('path');
const sharp = require('sharp');

// DB 커넥션 생성\              
var connection = require('../../../config/db').conn;

//파일업로드 모듈
var upload = multer({ //multer안에 storage정보  
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            //파일이 이미지 파일이면
            if (file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png" || file.mimetype == "application/octet-stream") {
                // console.log("이미지 파일입니다.");
                fs.mkdir('uploads/boardImgs', function (err) {
                    if (err && err.code != 'EEXIST') {
                        // console.log("already exist")
                    } else {
                        callback(null, 'uploads/boardImgs');
                    }
                })
                //텍스트 파일이면
            } else {
                // console.log("텍스트 파일입니다.");
                fs.mkdir('uploads/boardTexts', function (err) {
                    if (err && err.code != 'EEXIST') {
                        // console.log("already exist")
                    } else {
                        callback(null, 'uploads/boardTexts');
                    }
                })

            }
        },
        //파일이름 설정
        filename: (req, file, done) => {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    //파일 개수, 파일사이즈 제한
    limits: {
        files: 5,
        // fileSize: 1024 * 1024 * 1024 //1기가
    },

});

//공지사항 수정 폼 이동
router.get('/', async (req, res) => {
    try {
        const page = req.query.page;
        const boardId = req.query.boardId;
        const boardName = req.query.boardName;
        const sql = "select b.*, f.* from board b left join file f on b.boardId = f.boardId where b.boardId = ?"
        let route = req.app.get('views') + '/board/brd_udtForm';
        connection.query(sql, boardId, (err, result) => {
            if (err) {
                console.error(err);
            }
            res.render(route, {
                result: result,
                page: page,
                boardName: boardName,
                boardId: boardId

            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//게시글 수정
router.post('/', upload.array('file'), (req, res) => {
    const paths = req.files.map(data => data.path);
    const orgName = req.files.map(data => data.originalname);
    const boardFix = req.body.boardFix == undefined ? "0" : req.body.boardFix;
    var searchText = req.body.searchText == undefined ? "" : req.body.searchText;
    const page = req.body.page;
    var crewDiv = req.body.crewDiv;
    var boardDivId = req.body.boardDivId;
    var boardName = req.body.boardName;
    try {
        const param = [req.body.boardTitle, req.body.boardContent, boardFix, req.body.boardId];
        const sql = "update board set boardTitle = ?, boardContent = ?, boardFix = ?, boardDate = sysdate() where boardId = ?";
        
        connection.query(sql, param, (err) => {
            if (err) {
                console.error(err);
            }
            for (let i = 0; i < paths.length; i++) {
                const sql2 = "insert into file(fileRoute, fileOrgName, boardId) values (?, ?, ?)";
                const param2 = [paths[i], orgName[i], req.body.boardId];
                connection.query(sql2, param2, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            };
            res.redirect('boardSelectOne?boardId=' +
                req.body.boardId + '&page=' + page + '&searchText=' + searchText
                + '&boardName=' + boardName + '&crewDiv=' + crewDiv + '&boardDivId=' +boardDivId);
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;