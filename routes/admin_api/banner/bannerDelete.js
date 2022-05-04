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
            fs.mkdir('uploads/banner', function (err) {
                if (err && err.code != 'EEXIST') {
                    // console.log("already exist")
                } else {
                    callback(null, 'uploads/banner');
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

//후원광고 삭제
router.get('/', async (req, res) => {
    try {
        const param = req.query.bannerId;
        var bannerDiv = req.query.bannerDiv;
        const sql = "delete from banner where bannerId = ?;\
                        delete from file where bannerId = ?";
        connection.query(sql, [param, param], (err) => {
            if (err) {
                console.log(err);
            }
            if (req.query.fileRoute != undefined) {
                if (Array.isArray(req.query.fileRoute) == false) {
                    req.query.fileRoute = [req.query.fileRoute];
                }
                for (let i = 0; i < req.query.fileRoute.length; i++) {
                    fs.unlinkSync(req.query.fileRoute[i], (err) => {
                        if (err) {
                            console.log(err);
                        }
                        return;
                    });
                }
            }
            res.send('<script>alert("게시물이 삭제되었습니다."); location.href="/admin/bannerMain?page=1&bannerDiv=' + bannerDiv + '";</script>');
        });
    } catch (error) {
        res.send(error.message);
    }
});

//첨부파일 삭제
router.get('/bannerFileDelete', async (req, res) => {
    const param = req.query.fileId;
    const fileRoute = req.query.fileRoute; 
    try {
        const sql = "delete from file where fileId = ?";
        connection.query(sql, param, (err, row) => {
            if (err) {
                console.log(err)
            }
            fs.unlinkSync(fileRoute.toString(), (err) => {
                if (err) {
                    console.log(err);
                }
                return;
            });
        })
    } catch (error) {
        if (error.code == "ENOENT") {
            console.log("프로필 삭제 에러 발생");
        }
    }
    res.redirect('back');
});

module.exports = router;