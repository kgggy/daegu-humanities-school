var express = require('express');
var router = express.Router();
const fs = require('fs');
const sharp = require('sharp');
const multer = require("multer");
const path = require('path');
var connection = require('../../../config/db').conn;
const {ONE_SIGNAL_CONFIG} = require("../../../config/pushNotification_config");
const pushNotificationService = require("../../../services/push_Notification.services");

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
        files: 5
    },

});

//이벤트 등록 폼 이동
router.get('/', async (req, res) => {
    let route = req.app.get('views') + '/event/event_writForm.ejs';
    res.render(route, {
        crewDiv: req.query.crewDiv
    });
});

//이벤트 등록
router.post('/', upload.single('file'), async (req, res, next) => {
    try {
        const crewDiv = req.body.crewDiv;
        var param1 = [];
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
                        fs.writeFile(path, buffer, (err) => {
                            // console.log("삭제한 path ==============" + path)
                            if (err) {
                                throw err
                            }
                        });
                    });

            }
            param1 = [req.body.eventTitle, req.body.eventContent, req.body.eventDate, req.body.eventAdres, req.body.eventAdresDetail, req.body.voteStartDate, req.body.voteStartDate, req.body.voteEndDate, req.body.voteEndDate, req.body.eventTarget1, req.body.eventTarget2, crewDiv, path];
        } else {
            param1 = [req.body.eventTitle, req.body.eventContent, req.body.eventDate, req.body.eventAdres, req.body.eventAdresDetail, req.body.voteStartDate, req.body.voteStartDate, req.body.voteEndDate, req.body.voteEndDate, req.body.eventTarget1, req.body.eventTarget2, crewDiv, null];
        }
        const sql1 = "insert into event(eventTitle, eventContent, eventDate, eventAdres, eventAdresDetail, voteStartDate, voteEndDate, eventTarget1, eventTarget2, crewDiv, eventImg, eventStatus)\
                                  values(?, ?, ?, ?, ?, if(? = '',null,?), if(? = '',null,?), ?, ?, ?, ?, if(sysdate() >= voteStartDate, 0, null))";
        connection.query(sql1, param1, (err) => {
            if (err) {
                throw err;
            }
            //OneSignal 푸쉬 알림
            var message = {
                app_id: ONE_SIGNAL_CONFIG.APP_ID,
                contents: {
                    "en": req.body.eventTitle
                },
                included_segments: ["All"],
                content_avaliable: true,
                small_icon: "ic_notification_icon",
                data: {
                    PushTitle: "CUSTOM NOTIFICATION"
                }
            };

            pushNotificationService.sendNotification(message, (error, results) => {
                if (error) {
                    return next(error);
                }
                return null;
            })

            res.send('<script>alert("행사가 등록되었습니다."); location.href="/admin/eventSelect?page=1&crewDiv=' + crewDiv + '";</script>');
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;