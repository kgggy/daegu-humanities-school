const multer = require("multer");
const path = require('path');
const fs = require('fs');

var express = require('express');
var router = express.Router();

// DB 커넥션 생성                   
var connection = require('../../../config/db').conn;

//파일 업로드 모듈
var upload = multer({ //multer안에 storage정보  
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            fs.mkdir('public/images/support', function (err) {
                if (err && err.code != 'EEXIST') {
                    // console.log("already exist")
                } else {
                    callback(null, 'public/images/support');
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
        fileSize: 1024 * 1024 * 1024 //1기가
    },

});
//후원광고 수정폼 이동
router.get('/', async (req, res) => {
    try {
        const param = req.query.supportId;
        const sql = "select * from support where supportId = ?"
        connection.query(sql, param, function (err, result, fields) {
            if (err) {
                console.log(err);
            }
            let route = req.app.get('views') + '/m_support/support_udtForm';
            res.render(route, {
                result: result
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//후원 수정
router.post('/', upload.single('file'), async (req, res) => {
    var path = "";
    var param = "";
    var sql = "";
    if (req.file != null) {
        path = req.file.path;
        param = [path, req.body.supporter, req.body.supportId];
        sql = "update support set supportImg = ?, supporter = ?\
                                     where supportId = ?";
    } else {
        param = [req.body.supportImg, req.body.supporter, req.body.supportId];
        sql = "update support set supportImg = ?, supporter = ?\
                                     where supportId = ?";
    }
    connection.query(sql, param, (err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/admin/m_support?page=1');
    });
});

module.exports = router;