var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//투표(참석, 불참석) 명단
router.get('/voteList', async (req, res) => {
    try {
        const sql = "select  u.uid, u.userName, u.userPhone from vote v left join user u on u.uid = v.uid where choose = ? and eventId = ?"
        const param = [req.query.choose, req.query.eventId];
        connection.query(sql, param, (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            res.status(200).json(result);
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//투표(미정자) 명단
router.get('/nVoteList', async (req, res) => {
    try {
        const nChooseSql = "select u.uid, u.userName, u.userPhone from user u left join (select uid from vote v where v.eventId = ?) AS B on u.uid = B.uid WHERE B.uid IS NULL;";
        connection.query(nChooseSql, req.query.eventId, (err, results) => {
            if (err) {
                console.log(err);
            }
            res.json(results);
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;