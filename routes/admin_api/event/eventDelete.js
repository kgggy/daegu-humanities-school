var express = require('express');
var router = express.Router();
const fs = require('fs');
var connection = require('../../../config/db').conn;

//행사 삭제
router.get('/', async (req, res) => {
    try {
        const param = req.query.eventId;
        const crewDiv = req.query.crewDiv;
        const eventImg = req.query.eventImg;
        const sql = "call deleteEvent(?)";
        connection.query(sql, param, (err) => {
            if (err) {
                console.log(err);
            }
            if (eventImg != undefined && eventImg != '') {
                fs.unlinkSync(eventImg, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    return;
                });
            }
            res.send('<script>alert("행사가 삭제되었습니다."); location.href="/admin/eventSelect?page=1&crewDiv=' + crewDiv + '";</script>');
        });
    } catch (error) {
        res.send(error.message);
    }
});

//행사 여러개 삭제
// router.get('/eventsDelete', (req, res) => {
//     const eventId = req.query.eventId;
//     const str = eventId.split(',');
//     for (var i = 0; i < str.length; i++) {
//         let fileRoute = [];
//         const sql1 = "select eventFileRoute from event where eventId = ?";
//         connection.query(sql1, str[i], (err, result) => {
//             if (err) {
//                 console.log(err)
//             }
//             fileRoute = result;
//             if (fileRoute != undefined) {
//                 for (let j = 0; j < fileRoute.length; j++) {
//                     if (fileRoute[j].eventFileRoute != null) {
//                         fs.unlinkSync(fileRoute[j].eventFileRoute, (err) => {
//                             if (err) {
//                                 console.log(err);
//                             }
//                             return;
//                         });
//                     }
//                 }
//             }
//         });
//         const sql = "call deleteEvent(?)";
//         connection.query(sql, str[i], (err) => {
//             if (err) {
//                 console.log(err)
//             }
//         });
//     }
//     res.send('<script>alert("삭제되었습니다."); location.href="/admin/m_event?page=1";</script>');
// });

module.exports = router;