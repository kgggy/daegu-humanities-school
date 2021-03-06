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

//첨부파일 삭제
router.post('/imgDelete', async (req, res) => {
  var deleteFileRoute = req.body.deleteFileRoute;
  const page = req.body.page;
  if (Array.isArray(deleteFileRoute) == false) {
    deleteFileRoute = [deleteFileRoute];
  }
  // console.log(req.body)
  // console.log(deleteFileRoute)
  let sql;
  let param = [];
  try {
    if (req.body.profileyn == '0') {
      sql = "update user set userImg = null where uid = ?";
      param = req.body.uid;
    } else {
      sql = "delete from file where fileRoute = ?";
      param = deleteFileRoute;
    }
    // console.log(sql)
    // console.log(param)
    connection.query(sql, param, async (err) => {
      if (err) {
        console.log(err)
      }
      fs.unlinkSync(deleteFileRoute.toString(), (err) => {
        if (err) {
          console.log(err);
        }
        return;
      });
      var fileSql = "select u.userImg, f.fileRoute from user u left join file f on f.uid = u.uid where u.uid = ?";
      var fileRoute = [];
      await connection.query(fileSql, req.body.uid, async function (err, result) {
        if (err) {
          console.log(err);
        }
        for (i = 0; i < result.length; i++) {
          // console.log(result[i].fileRoute)
          fileRoute[i] = result[i].fileRoute;
        }
        const userImg = result[0].userImg;
        // console.log(fileRoute);
        // console.log(userImg);
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
              // var fileRoute = req.body.fileRoute;
              // if (fileRoute != undefined) {
              //   if (Array.isArray(fileRoute) == false) {
              //     fileRoute = [fileRoute];
              //   }
              // }
              console.log("userImg ========================= " + userImg);
              console.log("fileRoute ========================= " + fileRoute)
              let route = req.app.get('views') + '/user/user_udtForm';
              res.render(route, {
                result: req.body,
                fileRoute: fileRoute,
                userImg: userImg,
                page: page,
                userAuth: userAuth,
                gfPosition: gf,
                mtPosition: mt
              });
            });
          });
        });
      });
    });
  } catch (error) {
    if (error.code == "ENOENT") {
      console.log("프로필 삭제 에러 발생");
    }
  }
});

module.exports = router;