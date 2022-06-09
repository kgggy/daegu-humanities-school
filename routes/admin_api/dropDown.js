var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;
var exports = module.exports = {};

//사용자 정보 수정
module.exports 
router.get('/', async (req, res) => {
    try {
        const userAuthSql = "select distinct userAuth from user\
                              where userAuth is not null and userAuth != ''\
                           order by field(userAuth, '전체') desc, userAuth asc;";
        const userPositionSql = "select distinct userPosition from user\
                              where userPosition is not null and userPosition != ''\
                           order by field(userPosition, '전체') desc, userPosition asc;";

        connection.query(userAuthSql, function(err, results) {
            if(err) {
                console.log("dropdown query error")
                res.send(err)
            }
            console.log(results)
        })

    } catch (error) {
        res.status(401).send(error.message);
    }
});

module.exports = router;