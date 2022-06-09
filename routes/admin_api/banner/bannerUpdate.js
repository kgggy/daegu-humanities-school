const multer = require("multer");
const path = require('path');
const fs = require('fs');

const sharp = require('sharp');
var express = require('express');
var router = express.Router();

// DB 커넥션 생성                   
var connection = require('../../../config/db').conn;

//파일 업로드 모듈
var upload = multer({ //multer안에 storage정보  
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            fs.mkdir('public/images/banner', function (err) {
                if (err && err.code != 'EEXIST') {
                    // console.log("already exist")
                } else {
                    callback(null, 'public/images/banner');
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
//후원 수정 폼 이동
router.get('/', async (req, res) => {
    try {
        const page = req.query.page;
        const bannerId = req.query.bannerId;
        const sql = "select b.*, f.* from banner b left join file f on b.bannerId = f.bannerId where b.bannerId = ?"
        let route = req.app.get('views') + '/banner/banner_udtForm';
        connection.query(sql, bannerId, (err, result) => {
            if (err) {
                console.error(err);
            }
            res.render(route, {
                result: result,
                page: page,
                bannerId: bannerId
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//게시글 수정
router.post('/', upload.array('file'), (req, res) => {
    const paths = req.files.map(data => data.path);
    const orgName = req.files.map(data => data.originalname);
    var searchText = req.body.searchText == undefined ? "" : req.body.searchText;
    const page = req.body.page;
    var crewDiv = req.body.crewDiv;
    try {
        const param = [req.body.bannerTitle, req.body.bannerDetail, req.body.bannerUrl, req.body.bannerId];
        const sql = "update banner set bannerTitle = ?, bannerDetail = ?, bannerUrl = ? where bannerId = ?";

        connection.query(sql, param, (err) => {
            if (err) {
                console.error(err);
            }
            for (let i = 0; i < paths.length; i++) {
                const sql2 = "insert into file(fileRoute, fileOrgName, bannerId) values (?, ?, ?)";
                const param2 = [paths[i], orgName[i], req.body.bannerId];
                connection.query(sql2, param2, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            };
            res.redirect('bannerSelectOne?bannerId=' +
                req.body.bannerId + '&page=' + page + '&searchText=' + searchText
                + '&crewDiv=' + crewDiv);
        });
    } catch (error) {
        res.send(error.message);
    }
});
module.exports = router;