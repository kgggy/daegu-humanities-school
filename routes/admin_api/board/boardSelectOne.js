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