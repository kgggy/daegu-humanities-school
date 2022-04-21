var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require("multer");
const sharp = require('sharp');
const path = require('path');
//const models = require('../../models');
//엑셀파일 생성
var nodeExcel = require('excel-export');
// DB 커넥션 생성                
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

//사용자 전체조회
router.get('/page', async (req, res) => {
  var page = req.query.page;
  var searchType1 = req.query.searchType1 == undefined ? "" : req.query.searchType1;
  var searchType2 = req.query.searchType2 == undefined ? "" : req.query.searchType2;
  var searchType3 = req.query.searchType3 == undefined ? "" : req.query.searchType3;
  var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
  var keepSearch = "&searchType1=" + searchType1 +
    "&searchType2=" + searchType2 + "&searchType3=" + searchType3 + "&searchText=" + searchText;

  var sql = "select * from user where uid <= 10000";

  if (searchType1 != '') {
    sql += " and userAdres2 = '" + searchType1 + "' \n";
  }
  if (searchType2 != '') {
    sql += " and userType = '" + searchType2 + "' \n";
  }
  if (searchType3 != '') {
    sql += " and userPosition = '" + searchType3 + "' \n";
  }
  if (searchText != '') {
    sql += " and (hosName like '%" + searchText + "%' or userName like '%" + searchText + "%')";
  }
  sql += " order by uid desc;"
  try {
    connection.query(sql, function (err, results) {
      var countPage = 10; //하단에 표시될 페이지 개수
      var page_num = 10; //한 페이지에 보여줄 개수
      var last = Math.ceil((results.length) / page_num); //마지막 장
      var endPage = Math.ceil(page / countPage) * countPage; //끝페이지(10)
      var startPage = endPage - countPage; //시작페이지(1)
      if (err) {
        console.log(err);
      }

      if (last < endPage) {
        endPage = last
      };
      let route = req.app.get('views') + '/m_user/m_user';
      res.render(route, {
        searchType1: searchType1,
        searchType2: searchType2,
        searchType3: searchType3,
        searchText: searchText,
        results: results,
        page: page, //현재 페이지
        length: results.length - 1, //데이터 전체길이(0부터이므로 -1해줌)
        page_num: page_num,
        countPage: countPage,
        startPage: startPage,
        endPage: endPage,
        pass: true,
        last: last,
        keepSearch: keepSearch
      });
      // console.log(last)
      // console.log("endPage = " + endPage)
      // console.log("page = " + page)
      // console.log("startPage = " + startPage)
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

//사용자 상세조회
router.get('/selectOne', async (req, res) => {
  try {
    var searchType1 = req.query.searchType1 == undefined ? "" : req.query.searchType1;
    var searchType2 = req.query.searchType2 == undefined ? "" : req.query.searchType2;
    var searchType3 = req.query.searchType3 == undefined ? "" : req.query.searchType3;
    var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
    var keepSearch = "&searchType1=" + searchType1 +
      "&searchType2=" + searchType2 + "&searchType3=" + searchType3 + "&searchText=" + searchText;
    var page = req.query.page;
    const param = [req.query.uid, req.query.uid, req.query.uid];
    const sql = "select *\
                   from user where uid = ?";
    connection.query(sql, param, function (err, result) {
      if (err) {
        console.log(err);
      }
      let route = req.app.get('views') + '/m_user/orgm_viewForm';
      res.render(route, {
        result: result,
        page: page,
        searchType1: searchType1,
        searchType2: searchType2,
        searchType3: searchType3,
        searchText: searchText,
        keepSearch: keepSearch
      });
    });

  } catch (error) {
    res.status(401).send(error.message);
  }
});

//사용자 등록 페이지 이동
router.get('/userInsertForm', (req, res) => {
  let route = req.app.get('views') + '/m_user/orgm_writForm';
  res.render(route);
});

//사용자 등록
router.post('/userInsert', upload.fields([{ name: 'userImg' }, { name: 'hosImg' }, { name: 'infoImg' }]), async (req, res) => {
  const {
    userName, hosName, hosPost, userAdres1, userAdres2, userAdres3, hosPhone1, hosPhone2, hosPhone3, userPhone1, userPhone2, userPhone3, userType, userPosition, pushYn
  } = req.body;
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

    let userImg;
    let hosImg;
    let infoImg;
    // for (value in obj) {
    //   if(value == 'userImg') {
    //     userImg = req.files.userImg[0].path
    //   }

    // }
    if (req.files.userImg != null) {
      userImg = req.files.userImg[0].path;
    }
    if (req.files.hosImg != null) {
      hosImg = req.files.hosImg[0].path;
    }
    if (req.files.infoImg != null) {
      infoImg = req.files.infoImg[0].path;
    }
    await models.user.create({
      userName, hosName, hosPost, userAdres1, userAdres2, userAdres3, hosPhone1, hosPhone2, hosPhone3, userPhone1, userPhone2, userPhone3, userType, userPosition, pushYn, userImg, hosImg, infoImg
    });
  } else {
    await models.user.create({
      userName, hosName, hosPost, userAdres1, userAdres2, userAdres3, hosPhone1, hosPhone2, hosPhone3, userPhone1, userPhone2, userPhone3, userType, userPosition, pushYn
    });
  }
  res.send('<script>alert("회원 등록이 완료되었습니다."); location.href="/admin/m_user/page?page=1";</script>');
});

//사용자 정보 수정 페이지 이동
router.post('/userUdtForm', async (req, res) => {
  let route = req.app.get('views') + '/m_user/orgm_udtForm';
  res.render(route, {
    result: req.body,
    userImg: req.body.userImg,
    hosImg: req.body.hosImg,
    infoImg: req.body.infoImg,
    page: req.body.page
  });
});

// //사용자 정보 수정
// router.post('/userUpdate', upload.fields([{ name: 'userImg' }, { name: 'hosImg' }, { name: 'infoImg' }]), async (req, res) => {
//   var path = "";
//   var param = "";
//   if (req.file != null) {
//     path = req.file.path;
//     param = [path, req.body.userName, req.body.hosName,
//       req.body.hosPost, req.body.userAdres1, req.body.userAdres2, req.body.userAdres3,
//       req.body.hosPhone1, req.body.hosPhone2, req.body.hosPhone3,
//       req.body.userPhone1, req.body.userPhone2, req.body.userPhone3,
//       req.body.userType, req.body.userPosition, req.body.uid
//     ];
//   } else {
//     param = [req.body.userImg, req.body.userName, req.body.hosName,
//       req.body.hosPost, req.body.userAdres1, req.body.userAdres2, req.body.userAdres3,
//       req.body.hosPhone1, req.body.hosPhone2, req.body.hosPhone3,
//       req.body.userPhone1, req.body.userPhone2, req.body.userPhone3,
//       req.body.userType, req.body.userPosition, req.body.uid
//     ];
//   }
//   const sql = "update user set userImg = ?, userName = ?, hosName = ?, hosPost = ?, userAdres1 = ?, userAdres2 = ?,\
//                                userAdres3 = ?, hosPhone1 = ?, hosPhone2 = ?, hosPhone3 = ?,\
//                                userPhone1 = ?, userPhone2 = ?, userPhone3 = ?, userType = ? , userPosition = ?\
//                 where uid = ?";
//   connection.query(sql, param, (err) => {
//     if (err) {
//       console.error(err);
//     }
//     res.redirect('selectOne?uid=' + req.body.uid + '&page=' + req.body.page);
//   });
// });

//사용자 정보 수정
router.post('/userUpdate', upload.fields([{ name: 'userImg' }, { name: 'hosImg' }, { name: 'infoImg' }]), async (req, res) => {
  var { deleteFileId } = req.body;
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
  var { userName, hosName, hosPost, userAdres1, userAdres2, userAdres3, hosPhone1, hosPhone2,
    hosPhone3, userPhone1, userPhone2, userPhone3, userType, userPosition, uid } = req.body;

  if (req.files['userImg'] != null) {
    const paths = req.files['userImg'].map(data => data.path);
    await models.user.update({ userImg: paths[0] }, { where: { uid: uid } })
  }
  if (req.files['hosImg'] != null) {
    const paths = req.files['hosImg'].map(data => data.path);
    await models.user.update({ hosImg: paths[0] }, { where: { uid: uid } })
  }
  if (req.files['infoImg'] != null) {
    const paths = req.files['infoImg'].map(data => data.path);
    await models.user.update({ infoImg: paths[0] }, { where: { uid: uid } })
  }

  await models.user.update({
    userName: userName, hosName: hosName, hosPost: hosPost, userAdres1: userAdres1, userAdres2: userAdres2,
    userAdres3: userAdres3, hosPhone1: hosPhone1, hosPhone2: hosPhone2,
    hosPhone3: hosPhone3, userPhone1: userPhone1,
    userPhone2: userPhone2, userPhone3: userPhone3, userType: userType, userPosition: userPosition
  }, {
    where: { uid: uid }
  })

  if (deleteFileId != null) {
    if (!Array.isArray(deleteFileId)) {
      deleteFileId = [deleteFileId]
    }

    var fileRoutes = await models.user.findOne({
      where: { uid: uid },
      attributes: ['userImg', 'hosImg', 'infoImg'],
      raw: true
    })

    var arr = [];
    arr.push(fileRoutes['userImg'], fileRoutes['hosImg'], fileRoutes['infoImg'])

    for (var i = 0; i < arr.length; i++) {
      // console.log("arr ============== " + arr)
      for (var j = 0; j < deleteFileId.length; j++) {
        // console.log("deleteFileId ================ " + deleteFileId)
        if (arr[i] == deleteFileId[j]) {
          arr[i] = null;
          // console.log("삭제될 번호는???? == " + i)
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

    for (var i = 0; i < deleteFileId.length; i++) {
      fs.unlinkSync(deleteFileId[i], (err) => {
        if (err) {
          console.log(err);
        }
        return;
      });
    }
  }
  res.redirect('selectOne?uid=' + req.body.uid + '&page=' + req.body.page);
});

//사용자 여러명 삭제
router.get('/userDelete', (req, res) => {
  const param = req.query.uid;
  const route = req.query.userImg;
  const str = param.split(',');
  const img = route.split(',');
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
    } else {
      // console.log("프로필 이미지 존재하지않음.")
    }
  }
  res.send('<script>alert("삭제되었습니다."); location.href="/admin/m_user/page?page=1";</script>');
});

//사용자 한명 삭제
router.get('/oneUserDelete', (req, res) => {
  const param = req.query.uid;
  var img1 = req.query.userImg;
  var img2 = req.query.hosImg;
  var img3 = req.query.infoImg;
  var arr = img1 + ',' + img2 + ',' + img3;
  var img = arr.split(',');
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
  res.send('<script>alert("삭제되었습니다."); location.href="/admin/m_user/page?page=1";</script>');
});

//프로필 삭제
router.get('/imgDelete', async (req, res) => {
  const param = req.query.userImg;
  const page = req.query.page;
  try {
    const sql = "update user set userImg = null where uid = ?";
    connection.query(sql, req.query.uid, (err) => {
      if (err) {
        console.log(err)
      }
      fs.unlinkSync(param, (err) => {
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
  let route = req.app.get('views') + '/m_user/orgm_udtForm';
  res.render(route, {
    result: req.query,
    userImg: '',
    page: page
  });
});

//엑셀 다운로드
router.get('/userExcel', async (req, res) => {
  var searchType1 = req.query.searchType1 == undefined ? "" : req.query.searchType1;
  var searchType2 = req.query.searchType2 == undefined ? "" : req.query.searchType2;
  var searchType3 = req.query.searchType3 == undefined ? "" : req.query.searchType3;
  // var searchType4 = req.query.searchType4 == undefined ? "" : req.query.searchType4;
  var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
  var conf = {};

  conf.cols = [{
    caption: '번호',
    type: 'number',
    width: 8
  }, {
    caption: '회원명',
    captionStyleIndex: 1,
    type: 'string',
    width: 50
  }, {
    caption: '병원명',
    captionStyleIndex: 1,
    type: 'string',
    width: 30
  }, {
    caption: '우편번호',
    captionStyleIndex: 1,
    type: 'string',
    width: 8
  },
  {
    caption: '병원주소',
    captionStyleIndex: 1,
    type: 'string',
    width: 30
  },
  {
    caption: '병원번호',
    captionStyleIndex: 1,
    type: 'string',
    width: 15
  }, {
    caption: '형태',
    captionStyleIndex: 1,
    type: 'string',
    width: 15
  }, {
    caption: '역할',
    captionStyleIndex: 1,
    type: 'string',
    width: 12
  }
  ];

  var sql = "select * from user where 1=1";

  if (searchType1 != '') {
    sql += " and userAdres2 = '" + searchType1 + "' \n";
  }
  if (searchType2 != '') {
    sql += " and userType = '" + searchType2 + "' \n";
  }
  if (searchType3 != '') {
    sql += " and userPosition = '" + searchType3 + "' \n";
  }
  if (searchText != '') {
    sql += " and (hosName like '%" + searchText + "%' or userName like '%" + searchText + "%') order by uid";
  }

  try {
    connection.query(sql, function (err, results) {
      if (err) {
        console.log(err);
      }
      var arr = [];
      for (var i = 0; i < results.length; i++) {
        var resultData = [
          results[i].uid,
          results[i].userName,
          results[i].hosName,
          results[i].hosPost,
          results[i].userAdres1 + ' ' + results[i].userAdres2 + results[i].userAdres3,
          results[i].hosPhone1 + '-' + results[i].hosPhone2 + '-' + results[i].hosPhone3,
          results[i].userType,
          results[i].userPosition
        ];
        arr.push(resultData);
      }
      conf.rows = arr;
      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=" + "user.xlsx");
      res.end(result, 'binary');
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;