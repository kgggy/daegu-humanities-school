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
  //파일 개수, 파일사이즈 제한
  limits: {
    files: 5,
    fileSize: 1024 * 1024 * 1024 //1기가
  },

});

//사용자 등록 페이지 이동
router.get('/', (req, res) => {
  let route = req.app.get('views') + '/user/user_writForm';
  res.render(route);
});

//사용자 등록
router.post('/', upload.fields([{ name: 'userImg' }, { name: 'detailImg' }]), async (req, res) => {
  const {
    userName, userPhone, userEmail, officePhone, userAdres, userAdres4, userNum, userAuth, userUrl, userJob, faxPhone, userCrew, gfPosition, mtPosition
  } = req.body;
  const userAddress = userAdres.split(' ');
  const join = userAddress.slice(2).join(' ');
  let userImg;
  let detailImg;
  // console.log(req.body)
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
    if (req.files.userImg != null) {
      userImg = req.files.userImg[0].path;
      // console.log(userImg)
    }
    if (req.files.detailImg != null) {
      detailImg = req.files.detailImg[0].path;
    }
  } 
  const sql = "call insertUser(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
  const param = [userName, userPhone, userEmail, officePhone, userAddress[0], userAddress[1], join, userAdres4,
                 userNum, userAuth, userUrl, userJob, faxPhone, userCrew, gfPosition, mtPosition, userImg, detailImg];
  // console.log(param);
  connection.query(sql, param, (err, row) => {
    if (err) {
      console.log(err)
    }
    res.send('<script>alert("회원 등록이 완료되었습니다."); location.href="/admin/userSelect?page=1";</script>');
  });
});

module.exports = router;