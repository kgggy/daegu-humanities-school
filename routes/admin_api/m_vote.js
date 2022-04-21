var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;

//투표현황 전체조회
router.get('/', async (req, res) => {
    try {
        var page = req.query.page;
        var searchType1 = req.query.searchType1 == undefined ? "" : req.query.searchType1;
        var keepSearch = "&searchType1=" + searchType1;
        var sql = "select *, date_format(startDate, '%Y-%m-%d') as startDateFmt,\
                            date_format(endDate, '%Y-%m-%d') as endDateFmt,\
                            date_format(eventDate, '%Y-%m-%d') as eventDateFmt\
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
            let route = req.app.get('views') + '/m_vote/vote';
            res.render(route, {
                searchType1: searchType1,
                results: results,
                page: page, //현재 페이지
                length: results.length - 1, //데이터 전체길이(0부터이므로 -1해줌)
                page_num: page_num,
                countPage: countPage,
                startPage: startPage,
                endPage: endPage,
                pass: true,
                last: last,
                keepSearch: keepSearch
            });
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

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