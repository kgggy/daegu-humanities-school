var express = require('express');
var router = express.Router();

// DB 커넥션 생성                   
var connection = require('../../../config/db').conn;

//후원목록상세조회
router.get('/', async (req, res) => {
    try {
        const param = req.query.bannerId;
        var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
        const page = req.query.page;
        const crewDiv = req.query.crewDiv;
        const sql = "select b.*, f.fileRoute, f.fileOrgName from banner b left join file f on b.bannerId = f.bannerId where b.bannerId = ?";
        connection.query(sql, param, (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    msg: "query error"
                });
            }
            console.log(result)
            let route = req.app.get('views') + '/banner/banner_viewForm';
            res.render(route, {
                crewDiv: crewDiv,
                searchText: searchText,
                page: page,
                result: result
            });
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;