var express = require('express');
var router = express.Router();
const sharp = require('sharp');

const multer = require("multer");
const path = require('path');
const fs = require('fs');

var models = require('../../../models');
var connection = require('../../../config/db').conn;

//파일업로드 모듈
var upload = multer({ //multer안에 storage정보  
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            fs.mkdir('uploads/userProfile', function (err) {
                if (err && err.code != 'EEXIST') {
                    console.log("already exist")
                } else {
                    callback(null, 'uploads/userProfile');
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

// 회원정보수정
router.patch('/:uid', upload.fields([{ name: 'userImg' }, { name: 'detailImg' }]), async (req, res) => {
    try {
        console.log(req.body)
        var deleteFileRoute = req.body.deleteFileRoute; //바꾼 파일(바뀌기 전 경로)
        const uid = req.params.uid;

        if (req.files != null) {
            var obj = req.files;
            for (value in obj) {
                async function test() {
                    var i = value;
                    if (obj[i][0]['size'] > 1000000) {
                        sharp(obj[i][0]['path']).resize({
                            width: 2000
                        }).withMetadata() //이미지 방향 유지
                            .toBuffer((err, buffer) => {
                                if (err) {
                                    throw err;
                                }
                                fs.writeFile(obj[i][0]['path'], buffer, (err) => {
                                    if (err) {
                                        throw err
                                    }
                                });
                            });
                    }

                }
                await test();
            }
        }

        //(최초의 경우)파일이 있으면 경로 업데이트하기
        if (req.files['userImg'] != null && req.files['userImg'] != undefined) {
            const paths = req.files['userImg'].map(data => data.path);
            await models.user.update({ userImg: paths[0] }, { where: { uid: uid } })
        }
        if (req.files['detailImg'] != null && req.files['detailImg'] != undefined) {
            const paths = req.files['detailImg'].map(data => data.path);
            await models.user.update({ detailImg: paths[0] }, { where: { uid: uid } })
        }

        const param = [req.body.userName, req.body.userPhone, req.body.userEmail, req.body.officePhone,
            req.body.userAdres1, req.body.userAdres2, req.body.userAdres3, req.body.userAdres4, req.body.userAuth, req.body.userUrl,
            req.body.userNum, req.body.userJob, req.body.faxPhone, req.params.uid
        ];
        console.log(param)
        const sql = "update user set userName = ?, userPhone = ?, userEmail = ?,\
                                 officePhone = ?, userAdres1 = ?, userAdres2 = ?, userAdres3 = ?, userAdres4 = ?,\
                                 userAuth = ?, userUrl = ?,\
                                 userNum = ?, userJob = ?, faxPhone = ?\
                  where uid = ?";
        connection.query(sql, param, async (err) => {
            if (err) {
                console.error(err);
            }
            //바뀐 이미지 있는경우
            if (deleteFileRoute != '') {
                // if (!Array.isArray(deleteFileRoute)) {
                //     deleteFileRoute = [deleteFileRoute]
                // }
                var deleteFilerouteArr = deleteFileRoute.split(',');
                var fileRoutes = await models.user.findOne({
                    where: { uid: uid },
                    attributes: ['userImg', 'detailImg'],
                    raw: true
                })
                var arr = [];
                arr.push(fileRoutes['userImg'], fileRoutes['detailImg'])
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j < deleteFilerouteArr.length; j++) {
                        if (arr[i] == deleteFilerouteArr[j]) { //바뀐 파일 기존경로와 현재 파일 경로가 같으면 null로 하고 나머지는 업데이트시키기
                            arr[i] = null;
                            if (i == 0) {
                                await models.user.update({ userImg: arr[0] }, { where: { uid: uid } })
                            } if (i == 1) {
                                await models.user.update({ detailImg: arr[1] }, { where: { uid: uid } })
                            }
                        }
                    }
                }

                for (var i = 0; i < deleteFilerouteArr.length; i++) {
                    fs.unlinkSync(deleteFilerouteArr[i], (err) => {
                        if (err) {
                            console.log(err);
                        }
                        return;
                    });
                }
            }
            res.json({
                msg: "success"
            });
        });
    } catch (error) {
        res.send(error.message);
    }
});

//푸쉬알람 동의여부
router.patch('/pushyn', async (req, res) => {
    const param = [req.query.uid, req.query.pushYn];
    const sql = "update user set pushYn = ? where uid = ?";
    connection.query(sql, param, (err) => {
        if (err) {
            console.error(err);
        }
        return res.json({
            msg: "success"
        });
    });
});

module.exports = router;