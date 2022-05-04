var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//투표명단 확인
router.get('/', async (req, res) => {
    try {
        var sql = "";
        var param = [];
        if(req.query.choose != undefined) {
            param = [req.query.eventId, req.query.choose];
            sql = "select u.userName from vote v left join user u on u.uid = v.uid where eventId = ? and choose = ? and u.uid < 10000";
        } else {
            param = req.query.eventId;
            sql = "select u.* from user u left join (select uid from vote v where v.eventId = ?) AS B on u.uid = B.uid WHERE B.uid IS NULL and u.uid < 10000;";
        }
        let joinyn;
        connection.query(sql, param, (err, results) => {
            if (err) {
                console.log(err);
            }
            joinyn = results
            res.send({
                joinyn: joinyn
            });
        })
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;