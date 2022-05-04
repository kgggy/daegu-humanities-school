var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//행사 상세조회
router.get('/', async (req, res) => {
    try {
        const page = req.query.page;
        const crewDiv = req.query.crewDiv;
        const vote = req.query.vote == undefined ? "" : req.query.vote;
        const param = req.query.eventId;
        var eventTarget1 = req.query.eventTarget1 == undefined ? "" : req.query.eventTarget1;
        var eventTarget2 = req.query.eventTarget2 == undefined ? "" : req.query.eventTarget2;
        var eventStatus = req.query.eventStatus == undefined ? "" : req.query.eventStatus;
        const keepSearch = "&eventTarget1=" + eventTarget1 + "&eventTarget2=" + eventTarget2 + "&eventStatus=" + eventStatus;
        const sql = "select *, date_format(voteStartDate, '%Y-%m-%d') as voteStartDateFmt,\
                                date_format(voteEndDate, '%Y-%m-%d') as voteEndDateFmt,\
                                date_format(eventDate, '%Y-%m-%d %H시 %i분') as eventDateFmt\
                        from event\
                        where eventId = ?";
        connection.query(sql, param, (err, result) => {
            if (err) {
                res.json({
                    msg: "select query error"
                });
            }
            let route = req.app.get('views') + '/event/event_viewForm';
            res.render(route, {
                crewDiv: crewDiv,
                result: result,
                // fileOrgName: fileOrgName,
                vote: vote,
                page: page,
                keepSearch: keepSearch
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;