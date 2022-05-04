var express = require('express');
var router = express.Router();
const fs = require('fs');
const sharp = require('sharp');
const multer = require("multer");
const path = require('path');
var connection = require('../../../config/db').conn;

//파일업로드 모듈
var upload = multer({ //multer안에 storage정보  
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            fs.mkdir('uploads/event', function (err) {
                if (err && err.code != 'EEXIST') {
                    // console.log("already exist")
                } else {
                    callback(null, 'uploads/event');
                }
            })
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
        fileSize: 1024 * 1024 * 1024 //1기가
    },

});

//행사 수정 폼 이동
router.post('/udtForm', async (req, res) => {
    try {
        const page = req.body.page;
        const crewDiv = req.body.crewDiv;
        const param = req.body.eventId;
        const keepSearch = req.body.keepSearch;
        const sql = "select *, date_format(voteStartDate, '%Y-%m-%d') as voteStartDateFmt,\
                                date_format(voteEndDate, '%Y-%m-%d') as voteEndDateFmt,\
                                date_format(eventDate, '%Y-%m-%dT%H:%i') as eventDateFmt\
                       from event\
                      where eventId = ?";
        connection.query(sql, param, function (err, result) {
            if (err) {
                console.log(err);
            }
            let route = req.app.get('views') + '/event/event_udtForm';
            res.render(route, {
                result: result,
                page: page,
                crewDiv: crewDiv,
                keepSearch: keepSearch
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//행사 수정
router.post('/', upload.single('file'), (req, res) => {
    try {
        // console.log(req.body.deleteFileId);
        // console.log(req.file.path)
        const page = req.body.page;
        const crewDiv = req.body.crewDiv;
        const keepSearch = req.body.keepSearch;
        const sql = "update event set eventTitle = ?, eventContent = ?, eventAdres = ?, eventAdresDetail = ?, eventDate = ?,\
                                      voteStartDate = if(? = '',null,?), voteEndDate = if(? = '',null,?), eventTarget1 = ?, eventTarget2 = ?,\
                                      crewDiv = ?, eventImg = ?\
                      where eventId = ?";
        var param = [];
        if(req.body.deleteFileId != undefined) {
            fs.unlinkSync(req.body.deleteFileId, (err) => {
                if (err) {
                    console.log(err);
                }
                return;
            });
        }
        if (req.file != null) {
            const path = req.file.path;
            if (req.file.size > 1000000) {
                sharp(path).resize({
                        width: 2000
                    }).withMetadata() //이미지 방향 유지
                    .toBuffer((err, buffer) => {
                        if (err) {
                            throw err;
                        }
                        console.log(path)
                        fs.writeFile(path, buffer, (err) => {
                            // console.log("삭제한 path ==============" + path)
                            if (err) {
                                throw err
                            }
                        });
                    });

            }

            param = [req.body.eventTitle, req.body.eventContent, req.body.eventAdres, req.body.eventAdresDetail, req.body.eventDate, req.body.voteStartDate, req.body.voteStartDate, req.body.voteEndDate, req.body.voteEndDate,
                req.body.eventTarget1, req.body.eventTarget2, req.body.crewDiv, path, req.body.eventId
            ];
        } else {
            param = [req.body.eventTitle, req.body.eventContent, req.body.eventAdres, req.body.eventAdresDetail, req.body.eventDate, req.body.voteStartDate, req.body.voteStartDate, req.body.voteEndDate, req.body.voteEndDate,
                req.body.eventTarget1, req.body.eventTarget2, req.body.crewDiv, req.body.eventImg, req.body.eventId
            ];
        }
        connection.query(sql, param, (err) => {
            if (err) {
                console.error(err);
            }
            res.redirect('eventSelectOne?eventId=' + req.body.eventId + '&page=' + page + '&crewDiv=' + crewDiv + keepSearch);
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;