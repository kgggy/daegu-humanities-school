const express = require('express');
const router = express.Router();

const m_login = require('./m_login.js');

const userSelect = require('./user/userSelect.js');
const userSelectOne = require('./user/userSelectOne.js');
const userInsert = require('./user/userInsert.js');
const userUpdate = require('./user/userUpdate.js');
const userDelete = require('./user/userDelete.js');
const userExcel = require('./user/userExcel.js');

const boardMain = require('./board/boardMain.js');
const boardSearch = require('./board/boardSearch.js');
const boardSelectOne = require('./board/boardSelectOne.js');
const boardInsert = require('./board/boardInsert.js');
const boardUpdate = require('./board/boardUpdate.js');
const boardDelete = require('./board/boardDelete.js');

const eventSelect = require('./event/eventSelect.js');
const eventSelectOne = require('./event/eventSelectOne.js');
const voteSelect = require('./event/voteSelect.js');
const eventInsert = require('./event/eventInsert.js');
const eventUpdate = require('./event/eventUpdate.js');
const eventDelete = require('./event/eventDelete.js');

const bannerMain = require('./banner/bannerMain.js');
const bannerSearch = require('./banner/bannerSearch.js');
const bannerSelectOne = require('./banner/bannerSelectOne.js');
const bannerInsert = require('./banner/bannerInsert.js');
const bannerUpdate = require('./banner/bannerUpdate.js');
const bannerDelete = require('./banner/bannerDelete.js');


const commentSelect = require('./comment/commentSelect.js');
const commentDelete = require('./comment/commentDelete.js');

const blameSelect = require('./blame/blameSelect.js');
const blameDetailSelectOne = require('./blame/blameDetailSelectOne.js');
const blamesDelete = require('./blame/blamesDelete.js');

const dropDown = require('./dropDown.js');

router.use('/', (req,res,next) => {
    if(req.url == '/' || req.url == '/login') {
        // console.log("세션 검사 하지않고 로그인페이지로")
        next();
    } else {                                            // 로그인 페이지 이외의 페이지에 진입하려고 하는 경우
        if(req.session.user) {
            // console.log("세션이 있다.")
            next();
            // if(req.session.user.isAdmin) {
            //     next();
            // } else {
            //     res.send("<script>alert('어드민 계정으로 로그인 해주세요');location.href='/admin'</script>");
            // }                            // user와 admin이 같은 페이지를 이용할 때 구분해줘야 할 때
        } else {
            // console.log("세션이 없다.")
            res.send("<script>alert('로그인이 필요합니다.');location.href='/admin'</script>");
        }
    }
});

router.use('/', m_login);

router.use('/userSelect', userSelect);
router.use('/userSelectOne', userSelectOne);
router.use('/userInsert', userInsert);
router.use('/userUpdate', userUpdate);
router.use('/userDelete', userDelete);
router.use('/userExcel', userExcel);

router.use('/boardMain', boardMain);
router.use('/boardSearch', boardSearch);
router.use('/boardSelectOne', boardSelectOne);
router.use('/boardInsert', boardInsert);
router.use('/boardUpdate', boardUpdate);
router.use('/boardDelete', boardDelete);

router.use('/eventSelect', eventSelect);
router.use('/eventSelectOne', eventSelectOne);
router.use('/voteSelect', voteSelect);
router.use('/eventInsert', eventInsert);
router.use('/eventUpdate', eventUpdate);
router.use('/eventDelete', eventDelete);

router.use('/bannerMain', bannerMain);
router.use('/bannerSearch', bannerSearch);
router.use('/bannerSelectOne', bannerSelectOne);
router.use('/bannerInsert', bannerInsert);
router.use('/bannerUpdate', bannerUpdate);
router.use('/bannerDelete', bannerDelete);


router.use('/commentSelect', commentSelect);
router.use('/commentDelete', commentDelete);

router.use('/blameSelect', blameSelect);
router.use('/blameDetailSelectOne', blameDetailSelectOne);
router.use('/blamesDelete', blamesDelete);

router.use('/dropDown', dropDown);

module.exports = router;