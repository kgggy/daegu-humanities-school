var express = require('express');
var router = express.Router();
const fs = require('fs');
const sharp = require('sharp');
const multer = require("multer");
const path = require('path');
var connection = require('../../config/db').conn;
// const {ONE_SIGNAL_CONFIG} = require("../../config/pushNotification_config");
// const pushNotificationService = require("../../services/push_Notification.services");

//파일업로드 모듈
var upload = multer({ //multer안에 storage정보  
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            fs.mkdir('uploads/event', function (err) {
                if (err && err.code != 'EEXIST') {
                    console.log("already exist")
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

//행사목록 전체조회
router.get('/', async (req, res) => {
    try {
        var page = req.query.page;
        var searchType1 = req.query.searchType1 == undefined ? "" : req.query.searchType1;
        var sql = "select *, date_format(eventDate, '%Y-%m-%d %H:%i') as eventDateFmt\
                    from event where 1=1";
        if (searchType1 != '') {
            sql += " and eventStatus = '" + searchType1 + "'";
        }
        sql += " order by eventId desc";
        connection.query(sql, (err, results) => {
            var countPage = 10; //하단에 표시될 페이지 개수
            var page_num = 10; //한 페이지에 보여줄 개수
            var last = Math.ceil((results.length) / page_num); //마지막 장
            var endPage = Math.ceil(page / countPage) * countPage; //끝페이지(10)
            var startPage = endPage - countPage; //시작페이지(1)
            if (last < endPage) {
                endPage = last
            };
            if (err) {
                console.log(err);
            }
            let route = req.app.get('views') + '/m_event/event';
            res.render(route, {
                // searchText: searchText,
                searchType1: searchType1,
                results: results,
                page: page, //현재 페이지
                length: results.length - 1, //데이터 전체길이(0부터이므로 -1해줌)
                page_num: page_num,
                countPage: countPage,
                startPage: startPage,
                endPage: endPage,
                pass: true,
                last: last
            });
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//행사 상세조회
router.get('/eventSelectOne', async (req, res) => {
    try {
        const page = req.query.page
        const searchType1 = req.query.searchType1;
        const vote = req.query.vote == undefined ? "" : req.query.vote;
        const param = req.query.eventId;
        const sql = "select *, date_format(startDate, '%Y-%m-%d') as startDateFmt,\
                                date_format(endDate, '%Y-%m-%d') as endDateFmt,\
                                date_format(eventDate, '%Y-%m-%d %H:%i') as eventDateFmt\
                        from event\
                        where eventId = ?";

        connection.query(sql, param, (err, result) => {
            if (err) {
                res.json({
                    msg: "select query error"
                });
            }
            var fileOrgName;
            if (result[0].eventFileRoute != null && result[0].eventFileRoute != '') {
                const str = result[0].eventFileRoute.split("/");
                fileOrgName = str[2];
                if (fileOrgName == undefined) {
                    const str = result[0].eventFileRoute.split("\\");
                    fileOrgName = str[2];
                }
            } else {
                fileOrgName = '';
            }

            let route = req.app.get('views') + '/m_event/event_viewForm';
            res.render(route, {
                result: result,
                fileOrgName: fileOrgName,
                vote: vote,
                page: page,
                searchType1: searchType1
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//이벤트 등록 폼 이동
router.get('/eventWritForm', async (req, res) => {
    let route = req.app.get('views') + '/m_event/event_writForm.ejs';
    res.render(route);
});

//이벤트 등록
router.post('/eventWrite', upload.single('file'), async (req, res, next) => {
    try {
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
                        console.log(path)
                        fs.writeFile(path, buffer, (err) => {
                            // console.log("삭제한 path ==============" + path)
                            if (err) {
                                throw err
                            }
                        });
                    });
                    
            }
            param1 = [req.body.eventTitle, req.body.eventContent, req.body.eventDate, req.body.eventPlace, req.body.eventPlaceDetail, req.body.startDate, req.body.startDate, req.body.endDate, req.body.endDate, path];
        } else {
            param1 = [req.body.eventTitle, req.body.eventContent, req.body.eventDate, req.body.eventPlace, req.body.eventPlaceDetail, req.body.startDate, req.body.startDate, req.body.endDate, req.body.endDate, req.body.eventFileRoute];
        }
        const sql1 = "insert into event(eventTitle, eventContent, eventDate, eventPlace, eventPlaceDetail, startDate, endDate, eventFileRoute)\
                                  values(?, ?, ?, ?, ?, if(? = '',null,?), if(? = '',null,?), ?)";
        connection.query(sql1, param1, (err) => {
            if (err) {
                throw err;
            }
            //OneSignal 푸쉬 알림
            var message = {
                app_id: ONE_SIGNAL_CONFIG.APP_ID,
                contents: { "en": req.body.eventTitle },
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

            res.send('<script>alert("행사가 등록되었습니다."); location.href="/admin/m_event?page=1";</script>');
        });
    } catch (error) {
        res.send(error.message);
    }
});

//행사 수정 폼 이동
router.get('/eventUdtForm', async (req, res) => {
    try {
        const page = req.query.page;
        const searchType1 = req.query.searchType1;
        const param = req.query.eventId;
        const sql = "select *, date_format(startDate, '%Y-%m-%d') as startDateFmt,\
                                date_format(endDate, '%Y-%m-%d') as endDateFmt,\
                                date_format(eventDate, '%Y-%m-%dT%H:%i') as eventDateFmt\
                       from event\
                      where eventId = ?";
        connection.query(sql, param, function (err, result) {
            if (err) {
                console.log(err);
            }
            var fileOrgName;
            if (result[0].eventFileRoute != null && result[0].eventFileRoute != '') {
                const str = result[0].eventFileRoute.split("\\");
                fileOrgName = str[2];
            } else {
                fileOrgName = '';
            }
            let route = req.app.get('views') + '/m_event/event_udtForm';
            res.render(route, {
                result: result,
                fileOrgName: fileOrgName,
                page: page,
                searchType1: searchType1
            });
        });

    } catch (error) {
        res.status(401).send(error.message);
    }
});

//행사 수정
router.post('/eventUpdate', upload.single('file'), (req, res) => {
    try {
        const page = req.body.page;
        const searchType1 = req.body.searchType1;
        const sql = "update event set eventTitle = ?, eventContent = ?, eventPlace = ?, eventPlaceDetail = ?,\
        eventDate = ?, startDate = if(? = '',null,?), endDate = if(? = '',null,?), eventFileRoute = ?\
        where eventId = ?";
        var param = [];

        if (req.file != null) {
            const path = req.file.path;
            param = [req.body.eventTitle, req.body.eventContent, req.body.eventPlace, req.body.eventPlaceDetail, req.body.eventDate, req.body.startDate, req.body.startDate, req.body.endDate, req.body.endDate, path, req.body.eventId];
        } else {
            param = [req.body.eventTitle, req.body.eventContent, req.body.eventPlace, req.body.eventPlaceDetail, req.body.eventDate, req.body.startDate, req.body.startDate, req.body.endDate, req.body.endDate, req.body.eventFileRoute, req.body.eventId];
        }
        connection.query(sql, param, (err) => {
            if (err) {
                console.error(err);
            }
            res.redirect('eventSelectOne?eventId=' + req.body.eventId + '&page=' + page + '&searchType1=' + searchType1);
        });
    } catch (error) {
        res.send(error.message);
    }
});

//행사 여러개 삭제
router.get('/eventsDelete', (req, res) => {
    const eventId = req.query.eventId;
    const str = eventId.split(',');
    for (var i = 0; i < str.length; i++) {
        let fileRoute = [];
        const sql1 = "select eventFileRoute from event where eventId = ?";
        connection.query(sql1, str[i], (err, result) => {
            if (err) {
                console.log(err)
            }
            fileRoute = result;
            if (fileRoute != undefined) {
                for (let j = 0; j < fileRoute.length; j++) {
                    if (fileRoute[j].eventFileRoute != null) {
                        fs.unlinkSync(fileRoute[j].eventFileRoute, (err) => {
                            if (err) {
                                console.log(err);
                            }
                            return;
                        });
                    }
                }
            }
        });
        const sql = "call deleteEvent(?)";
        connection.query(sql, str[i], (err) => {
            if (err) {
                console.log(err)
            }
        });
    }
    res.send('<script>alert("삭제되었습니다."); location.href="/admin/m_event?page=1";</script>');
});

//행사 삭제
router.get('/eventDelete', async (req, res) => {
    try {
        const param = req.query.eventId;
        const eventFileRoute = req.query.eventFileRoute;
        const sql = "call deleteEvent(?)";
        connection.query(sql, param, (err) => {
            if (err) {
                console.log(err);
            }
            if (eventFileRoute != undefined && eventFileRoute != '') {
                fs.unlinkSync(eventFileRoute, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    return;
                });
            }
            res.send('<script>alert("행사가 삭제되었습니다."); location.href="/admin/m_event?page=1";</script>');
        });
    } catch (error) {
        res.send(error.message);
    }
});

//첨부파일 삭제
router.get('/eventFileDelete', async (req, res) => {
    const page = req.query.page;
    const eventFileRoute = req.query.eventFileRoute;
    const param = [req.query.eventId];
    const searchType1 = req.query.searchType1;
    try {
        const sql = "update event set eventFileRoute = null where eventId = ?";
        connection.query(sql, param, (err) => {
            if (err) {
                console.log(err)
            }
            fs.unlinkSync(eventFileRoute.toString(), (err) => {
                if (err) {
                    console.log(err);
                }
                return;
            });
        })
    } catch (error) {
        if (error.code == "ENOENT") {
            console.log("프로필 삭제 에러 발생");
        }
    }
    res.redirect('eventUdtForm?eventId=' + req.query.eventId + '&page=' + page + '&searchType1=' + searchType1);
});

module.exports = router;