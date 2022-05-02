var express = require('express');
var router = express.Router();
const fs = require('fs');              
var connection = require('../../../config/db').conn;

//사용자 여러명 삭제
router.get('/', (req, res) => {
  const param = req.query.uid;
  const route1 = req.query.userImg;
  const route2 = req.query.detailImg;
  const str = param.split(',');
  const img = route1.split(',');
  const dtImg = route2.split(',');
  // DB 글삭제
  for (var i = 0; i < str.length; i++) {
    const sql = "delete from user where uid = ?";
    connection.query(sql, str[i], (err) => {
      if (err) {
        console.log(err)
      }
    });
  }
  //서버에서 프로필 이미지 삭제
  for (var i = 0; i < img.length; i++) {
    if (img[i] !== '') {
      // console.log("프로필 이미지 존재함.")
      fs.unlinkSync(img[i], (err) => {
        if (err) {
          console.log(err);
        }
        return;
      });
    } 
  }
  //서버에서 프로필 이미지 삭제
  for (var i = 0; i < dtImg.length; i++) {
    if (dtImg[i] !== '') {
      // console.log("프로필 이미지 존재함.")
      fs.unlinkSync(dtImg[i], (err) => {
        if (err) {
          console.log(err);
        }
        return;
      });
    } 
  }
  res.send('<script>alert("삭제되었습니다."); location.href="/admin/userSelect?page=1";</script>');
});

//사용자 한명 삭제
router.get('/one', (req, res) => {
  const param = req.query.uid;
  var img1 = req.query.userImg;
  var img2 = req.query.detailImg;
  var arr = img1 + ',' + img2;
  var img = arr.split(',');
  // console.log(img)
  const sql = "delete from user where uid = ?";
  connection.query(sql, param, (err, row) => {
    if (err) {
      console.log(err)
    }
    for (var i = 0; i < img.length; i++) {
      if (img[i] != '') {
        fs.unlinkSync(img[i], (err) => {
          if (err) {
            console.log(err);
          }
          return;
        })
      }
    }
  });
  res.send('<script>alert("삭제되었습니다."); location.href="/admin/userSelect?page=1";</script>');
});

module.exports = router;