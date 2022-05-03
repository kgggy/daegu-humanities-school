var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;

// //투표현황 전체조회
// router.get('/', async (req, res) => {
//     try {
//         var page = req.query.page;
//         const crewDiv = req.query.crewDiv;
//         var eventTarget1 = req.query.eventTarget1 == undefined ? "" : req.query.eventTarget1;
//         var eventTarget2 = req.query.eventTarget2 == undefined ? "" : req.query.eventTarget2;
//         var eventStatus = req.query.eventStatus == undefined ? "" : req.query.eventStatus;
//         const keepSearch = "&eventTarget1=" + eventTarget1 + "&eventTarget2=" + eventTarget2 + "&eventStatus=" + eventStatus;
//         var sql = "select *,date_format(voteStartDate, '%Y-%m-%d') as voteStartDateFmt,\
//                             date_format(voteEndDate, '%Y-%m-%d') as voteEndDateFmt,\
//                             date_format(eventDate, '%Y-%m-%d %H시 %i분') as eventDateFmt,\
//                              (case when eventStatus = '0' then '진행중' when eventStatus = '1' then '마감' end) as eventStatusFmt\
//                     from event where crewDiv = ?";
//         if (eventTarget1 != '') {
//             sql += " and eventTarget1 = '" + eventTarget1 + "'";
//         }
//         if (eventTarget2 != '') {
//             sql += " and eventTarget2 = '" + eventTarget2 + "'";
//         }
//         if (eventStatus != '') {
//             sql += " and eventStatus = '" + eventStatus + "'";
//         }
//         sql += " order by eventId desc";
//         connection.query(sql, crewDiv, (err, results) => {
//             var countPage = 10; //하단에 표시될 페이지 개수
//             var page_num = 10; //한 페이지에 보여줄 개수
//             var last = Math.ceil((results.length) / page_num); //마지막 장
//             var endPage = Math.ceil(page / countPage) * countPage; //끝페이지(10)
//             var startPage = endPage - countPage; //시작페이지(1)
//             if (last < endPage) {
//                 endPage = last
//             };
//             if (err) {
//                 console.log(err);
//             }
//             let route = req.app.get('views') + '/vote/vote';
//             res.render(route, {
//                 crewDiv: crewDiv,
//                 eventTarget1: eventTarget1,
//                 eventTarget2: eventTarget2,
//                 eventStatus: eventStatus,
//                 results: results,
//                 page: page, //현재 페이지
//                 length: results.length - 1, //데이터 전체길이(0부터이므로 -1해줌)
//                 page_num: page_num,
//                 countPage: countPage,
//                 startPage: startPage,
//                 endPage: endPage,
//                 pass: true,
//                 last: last,
//                 keepSearch: keepSearch
//             });
//         });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

//투표명단 확인
router.get('/voteList', async (req, res) => {
    try {
        const choose = [req.query.choose];
        const param = [req.query.eventId, req.query.choose];
        const sql = "select u.userName from vote v left join user u on u.uid = v.uid where eventId = ? and choose = ?";
        const nChooseSql = "select u.* from user u left join (select uid from vote v where v.eventId = ?) AS B on u.uid = B.uid WHERE B.uid IS NULL;";
        connection.query(sql, param, (err, results) => {
            if (err) {
                console.log(err);
            }
            connection.query(nChooseSql, req.query.eventId, (err, noChoose) => {
                if (err) {
                    console.log(err);
                }
                let route = req.app.get('views') + '/m_vote/voteList';
                res.render(route, {
                    results: results,
                    noChoose: noChoose,
                    choose: choose
                });
            })
        })
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;