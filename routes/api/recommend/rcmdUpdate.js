var express = require('express');
var router = express.Router();
var connection = require('../../../config/db').conn;

//추천
router.get('/', async (req, res) => {
    try {
        const sql = "call recommendCheck(?,?)";
        const param = [req.query.boardId, req.query.uid];
        connection.query(sql, param, (err, row) => {
            if (err) {
                console.error(err);
                res.json({
                    msg: "hit query error"
                });
            }
            res.json({
                msg: "success"
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});



module.exports = router;