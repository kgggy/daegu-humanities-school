var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require("multer");
const sharp = require('sharp');
const path = require('path');

//파일업로드 모듈
var upload = multer({ //multer안에 storage정보  
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      fs.mkdir('uploads/userProfile', function (err) {
        if (err && err.code != 'EEXIST') {
          // console.log("already exist")
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
    fileSize: 1024 * 1024 * 1024 //1기가
  },

});

//사용자 정보 수정 페이지 이동
router.post('/udtForm', async (req, res) => {
  const userAuthSql = "select distinct userAuth from user\
                        where userAuth is not null and userAuth != ''\
                     order by field(userAuth, '전체') desc, userAuth asc;";
  const gfSql = "select distinct gfPosition from user\
                  where gfPosition is not null and gfPosition != ''\
               order by field(gfPosition, '전체') desc, gfPosition asc;";
  const mtSql = "select distinct mtPosition from user\
                  where mtPosition is not null and mtPosition != ''\
               order by field(mtPosition, '전체') desc, mtPosition asc;";
  let userAuth;
  let gf;
  let mt;
  connection.query(userAuthSql, function (err, result) {
    if (err) {
      console.log(err);
    }
    userAuth = result;
    connection.query(gfSql, function (err, result) {
      if (err) {
        console.log(err);
      }
      gf = result;
      connection.query(mtSql, function (err, result) {
        if (err) {
          console.log(err);
        }
        mt = result;
        var fileRoute = req.body.fileRoute;
        if (fileRoute != undefined) {
          if (Array.isArray(fileRoute) == false) {
            fileRoute = [fileRoute];
          }
        }
        let route = req.app.get('views') + '/user/user_udtForm';
        res.render(route, {
          result: req.body,
          fileRoute: fileRoute,
          userImg: req.body.userImg,
          page: req.body.page,
          userAuth: userAuth,
          gfPosition: gf,
          mtPosition: mt
        });
      });
    });
  });
});

//사용자 정보 수정
router.post('/', upload.array('file'), (req, res) => {
  try {
    //첨부파일 삭제 x, 업로드만!
    const paths = req.files.map(data => data.path);
    const orgName = req.files.map(data => data.originalname);
    const userAdres = req.body.userAdres;
    const userAddress = userAdres.split(' ');
    const join = userAddress.slice(2).join(' ');
    const uid = req.body.uid;
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
    //프로필 사진 없는경우
    var userImg;
    var a;
    // console.log("userImgyn ============================= " + req.body.userImgyn)
    // console.log("userImg ============================= " + req.body.userImg)
    //파일도 없고 기존파일도 없는경우
    if (req.body.userImgyn == '0') {
      if (req.body.userImg != '') {
        userImg = req.body.userImg;
        a = 0;
      } else {
        userImg = '';
        a = 0;
      }
    } else {
      userImg = paths[0];
      a = 1;
    }
    // console.log("userImg ============================= " + userImg);
    // console.log("a ============================= " + a)
    //사용자 DB 업데이트
    const param = [req.body.userName, req.body.userPhone, req.body.userEmail, req.body.officePhone,
      userAddress[0], userAddress[1], join, req.body.userAdres4, req.body.userNum, req.body.userUrl, req.body.userJob,
      req.body.userFax, req.body.userCrew, req.body.userAuth, req.body.gfPosition, req.body.mtPosition, userImg, uid
    ]
    // console.log(param)
    const sql = "update user set userName = ?, userPhone = ?, userEmail = ?, officePhone = ?,\
                               userAdres1 = ?, userAdres2 = ?, userAdres3 = ?, userAdres4 = ?,\
                               userNum = ?, userUrl = ?, userJob = ?, userFax = ?,\
                               userCrew = ?, userAuth = ?, gfPosition = ?, mtPosition = ?, userImg = ?\
               where uid = ?";
    connection.query(sql, param, function (err) {
      if (err) {
        console.log(err);
      }
      if(paths.length > 0 && userImg == '') {
        let remainQueryCnt = paths.length;
        // console.log(remainQueryCnt)
        //파일 테이블 업데이트
        for (let i = a; i < remainQueryCnt; i++) {
          const fileSql = "insert into file(uid, fileRoute, fileOrgName, fileType) values (?, ?, ?, ?)";
          const param1 = [uid, paths[i], orgName[i], path.extname(paths[i])];
          // console.log(param1);
          connection.query(fileSql, param1, (err) => {
            if (err) {
              console.error(err);
            }
            remainQueryCnt--;
            // console.log(remainQueryCnt)
            // console.log("file table upload success!! ========= " + i + "++++++++" + orgName[i])
            // console.log(remainQueryCnt == 0)
            if (remainQueryCnt == 0) {
              res.redirect('userSelectOne?uid=' + req.body.uid + '&page=' + req.body.page);
            }
          });
        }
      } else {
        //파일 수정 없는 경우
        res.redirect('userSelectOne?uid=' + req.body.uid + '&page=' + req.body.page);
      }
    });
  } catch (err) {
    console.log(err)
    res.send(err)
  }
});

module.exports = router;