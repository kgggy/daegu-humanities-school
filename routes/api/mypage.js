var express = require('express');
var router = express.Router();
const sharp = require('sharp');

const multer = require("multer");
const path = require('path');
const fs = require('fs');

var models = require('../../models');
var connection = require('../../config/db').conn;

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

// 내 정보 상세보기
router.get('/:uid', async (req, res) => {
    try {
        const param = req.params.uid;
        let user;
        connection.query('select * from user where uid = ?', param, (err, results, fields) => {
            if (err) {
                console.log(err);
            }
            user = results;
            res.status(200).json(user);
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

// // 회원정보수정
// router.patch('/:uid', upload.single('file'), async (req, res) => {
//     var param;
//     var pathe = "";
//     const userImg = req.body.userImg;
//     if (req.file != null) {
//         pathe = req.file.path;
//         for (let i = 0; i < pathe.length; i++) {
//             if (req.files[i].size > 1000000) {
//                 sharp(pathe[i]).resize({
//                     width: 2000
//                 }).withMetadata() //이미지 방향 유지
//                     .toBuffer((err, buffer) => {
//                         if (err) {
//                             throw err;
//                         }
//                         fs.writeFileSync(pathe[i], buffer, (err) => {
//                             if (err) {
//                                 throw err
//                             }
//                         });
//                     });
//             }
//         }
//         // console.log("프로필 변경함 => userImg 최초만 공백이고 나머지는 원래경로 들어옴")
//         param = [req.body.userName, req.body.userPosition, req.body.userType,
//             req.body.userAdres1, req.body.userAdres2, req.body.userAdres3,
//             req.body.hosName, req.body.userUrl, req.body.userEmail, req.body.hosPost,
//             req.body.userPhone1, req.body.userPhone2, req.body.userPhone3,
//             req.body.hosPhone1, req.body.hosPhone2, req.body.hosPhone3,
//             pathe, req.params.uid
//         ];
//     } else {
//         // console.log("프로필 변경 안함 => userImg 원래 경로임")
//         param = [req.body.userName, req.body.userPosition, req.body.userType,
//             req.body.userAdres1, req.body.userAdres2, req.body.userAdres3,
//             req.body.hosName, req.body.userUrl, req.body.userEmail, req.body.hosPost,
//             req.body.userPhone1, req.body.userPhone2, req.body.userPhone3,
//             req.body.hosPhone1, req.body.hosPhone2, req.body.hosPhone3,
//             userImg, req.params.uid
//         ];
//     }
//     const sql = "update user set userName = ?, userPosition = ?, userType = ?,\
//                                  userAdres1 = ?, userAdres2 = ?, userAdres3 = ?,\
//                                  hosName = ?, userUrl = ?, userEmail = ?, hosPost = ?,\
//                                  userPhone1 = ?, userPhone2 = ?, userPhone3 = ?,\
//                                  hosPhone1 = ?, hosPhone2 = ?, hosPhone3 = ?, userImg = ?\
//                   where uid = ?";
//     connection.query(sql, param, (err) => {
//         if (err) {
//             console.error(err);
//         }
//         //프로필이 수정되는 경우 원래 프로필사진 삭제
//         if (req.file != undefined && req.file != null) {
//             if (userImg != undefined && userImg != '') {
//                 fs.unlinkSync(userImg, (err) => {
//                     if (err) {
//                         console.log(err);
//                     }
//                 });
//             }
//         }
//         return res.json({
//             msg: "success"
//         });
//     });
// });

// 회원정보수정
router.patch('/:uid', upload.fields([{ name: 'userImg' }, { name: 'hosImg' }, { name: 'infoImg' }]), async (req, res) => {
    try {
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
        if (req.files['hosImg'] != null && req.files['hosImg'] != undefined) {
            const paths = req.files['hosImg'].map(data => data.path);
            await models.user.update({ hosImg: paths[0] }, { where: { uid: uid } })
        }
        if (req.files['infoImg'] != null && req.files['infoImg'] != undefined) {
            const paths = req.files['infoImg'].map(data => data.path);
            await models.user.update({ infoImg: paths[0] }, { where: { uid: uid } })
        }

        const param = [req.body.userName, req.body.userPosition, req.body.userType,
        req.body.userAdres1, req.body.userAdres2, req.body.userAdres3,
        req.body.hosName, req.body.userUrl, req.body.userEmail, req.body.hosPost,
        req.body.userPhone1, req.body.userPhone2, req.body.userPhone3,
        req.body.hosPhone1, req.body.hosPhone2, req.body.hosPhone3, req.params.uid
        ];
        const sql = "update user set userName = ?, userPosition = ?, userType = ?,\
                                 userAdres1 = ?, userAdres2 = ?, userAdres3 = ?,\
                                 hosName = ?, userUrl = ?, userEmail = ?, hosPost = ?,\
                                 userPhone1 = ?, userPhone2 = ?, userPhone3 = ?,\
                                 hosPhone1 = ?, hosPhone2 = ?, hosPhone3 = ?\
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
                    attributes: ['userImg', 'hosImg', 'infoImg'],
                    raw: true
                })
                var arr = [];
                arr.push(fileRoutes['userImg'], fileRoutes['hosImg'], fileRoutes['infoImg'])
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j < deleteFilerouteArr.length; j++) {
                        if (arr[i] == deleteFilerouteArr[j]) { //바뀐 파일 기존경로와 현재 파일 경로가 같으면 null로 하고 나머지는 업데이트시키기
                            arr[i] = null;
                            if (i == 0) {
                                await models.user.update({ userImg: arr[0] }, { where: { uid: uid } })
                            } if (i == 1) {
                                await models.user.update({ hosImg: arr[1] }, { where: { uid: uid } })
                            } if (i == 2) {
                                await models.user.update({ infoImg: arr[2] }, { where: { uid: uid } })
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