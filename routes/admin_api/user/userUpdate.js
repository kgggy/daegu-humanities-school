var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require("multer");
const sharp = require('sharp');
const path = require('path');
const models = require('../../../models');

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

//사용자 정보 수정 페이지 이동
router.post('/udtForm', async (req, res) => {
  let route = req.app.get('views') + '/user/user_udtForm';
  res.render(route, {
    result: req.body,
    page: req.body.page
  });
});

//사용자 정보 수정
router.post('/', upload.fields([{ name: 'userImg' }, { name: 'detailImg' }]), async (req, res) => {
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
  
  var { userName, userPhone, userEmail, officePhone, userAdres, userAdres4, userNum, userUrl,
    userJob, faxPhone, userCrew, userAuth, gfPosition, mtPosition, uid } = req.body;
  const userAddress = userAdres.split(' ');
  const join = userAddress.slice(2).join(' ');
  if (req.files['userImg'] != null) {
    const paths = req.files['userImg'].map(data => data.path);
    await models.user.update({ userImg: paths[0] }, { where: { uid: uid } })
  }
  if (req.files['detailImg'] != null) {
    const paths = req.files['detailImg'].map(data => data.path);
    await models.user.update({ detailImg: paths[0] }, { where: { uid: uid } })
  }

  await models.user.update({
    userName: userName, userPhone: userPhone, userEmail: userEmail, officePhone:officePhone, userAdres1: userAddress[0], userAdres2: userAddress[1],
    userAdres3: join, userAdres4: userAdres4, userNum: userNum, userUrl: userUrl, userJob: userJob, faxPhone: faxPhone,
    userCrew: userCrew, userAuth: userAuth, gfPosition: gfPosition, mtPosition: mtPosition
  }, {
    where: { uid: uid }
  })

  if (deleteFileId != null) {
    if (!Array.isArray(deleteFileId)) {
      deleteFileId = [deleteFileId]
    }

    var fileRoutes = await models.user.findOne({
      where: { uid: uid },
      attributes: ['userImg', 'detailImg'],
      raw: true
    })

    var arr = [];
    arr.push(fileRoutes['userImg'], fileRoutes['detailImg'])

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
            await models.user.update({ detailImg: arr[1] }, { where: { uid: uid } })
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
  res.redirect('userSelectOne?uid=' + req.body.uid + '&page=' + req.body.page);
});

module.exports = router;