var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require("multer");
const sharp = require('sharp');
const path = require('path');
var connection = require('../../../config/db').conn;

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

});

//사용자 등록 페이지 이동
router.get('/', (req, res) => {
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
        let route = req.app.get('views') + '/user/user_writForm';
        res.render(route, {
          userAuth: userAuth,
          gfPosition : gf,
          mtPosition : mt
        });
      });
    });
  });
});

//사용자 등록
router.post('/', upload.array('file'), async (req, res) => {
  const paths = req.files.map(data => data.path);
  const orgName = req.files.map(data => data.originalname);
  const {
    userName,
    userPhone,
    userEmail,
    officePhone,
    userAdres,
    userAdres4,
    userNum,
    userAuth,
    userUrl,
    userJob,
    userFax,
    userCrew,
    gfPosition,
    mtPosition
  } = req.body;
  const userAddress = userAdres.split(' ');
  const join = userAddress.slice(2).join(' ');
  // console.log(req.body)
  if (req.files != null) {
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
  }
  //프로필 사진 없는경우
  var userImg;
  var a;
  if (req.body.userImgyn == '0') {
    userImg = '';
    a = 0;
  } else {
    userImg = paths[0];
    a = 1;
  }
  const sql = "call insertUser(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
  const param = [userName, userPhone, userEmail, officePhone, userAddress[0], userAddress[1], join, userAdres4,
    userNum, userAuth, userUrl, userJob, userFax, userCrew, gfPosition, mtPosition, userImg
  ];
  // console.log(param);
  connection.query(sql, param, (err, row) => {
    if (err) {
      console.log(err)
    }
    const uidSql = "select max(uid) as uid from user";
    connection.query(uidSql, (err, result) => {
      if (err) {
        throw err;
      }
      for (let i = a; i < paths.length; i++) {
        const param3 = [paths[i], orgName[i], result[0].uid, path.extname(paths[i])];
        const sql3 = "insert into file(fileRoute, fileOrgName, uid, fileType) values (?, ?, ?, ?)";
        connection.query(sql3, param3, (err) => {
          if (err) {
            throw err;
          }
        });
      };
      res.send('<script>alert("회원 등록이 완료되었습니다."); location.href="/admin/userSelect?page=1";</script>');
    });
  });
});

module.exports = router;