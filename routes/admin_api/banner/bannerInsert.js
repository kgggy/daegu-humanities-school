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
        files: 5,
        fileSize: 1024 * 1024 * 1024 //1기가
    },

});

//후원광고 등록폼 이동
router.get('/', async (req, res) => {
    let route = req.app.get('views') + '/banner/banner_writForm';
    res.render(route);
});

//후원광고 등록
router.post('/', upload.array('file'), async function (req, res) {
    const param = [path, req.body.supporter];
    const paths = req.files.map(data => data.path);
    const orgName = req.files.map(data => data.originalname);
    const sql = "call insertBanner(?,?,?,?,?,?);\
                    select max(bannerId) as bannerId from banner;";
    try {
        for (let i = 0; i < paths.length; i++) {
            if (req.files[i].size > 1000000) {
                sharp(paths[i]).resize({
                    width: 2000
                }).withMetadata() //이미지 방향 유지
                    .toBuffer((err, buffer) => {
                        if (err) {
                            throw err;
                        }
                        fs.writeFileSync(paths[i], buffer, (err) => {
                            if (err) {
                                throw err
                            }
                        });
                    });
            }
        }

        connection.query(sql, param, (err, results) => {
            if (err) {
                throw err;
            }
            const bannerId = results[1][0].bannerId;
            for (let i = 0; i < paths.length; i++) {
                const param2 = [bannerId, paths[i], orgName[i], path.extname(paths[i])];
                const sql2 = "insert into file(bannerId, fileRoute, fileOrgName, fileType) values (?, ?, ?, ?)";
                connection.query(sql2, param2, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            };
        });
        res.send('<script>alert("배너가 등록되었습니다."); location.href=""');
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;