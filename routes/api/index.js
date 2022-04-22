
const express = require('express');
const router = express.Router();


const greeting = require('./greeting.js');
const userSelect = require('./user/userSelect.js')
const userInfoUpdate = require('./user/userInfoUpdate.js')
const mypageUpdate = require('./user/mypageUpdate.js');
const mypageSelectOne = require('./user/mypageSelectOne.js')
const notice = require('./notice.js');
const gallery = require('./gallery.js');
const refer = require('./refer.js');
const support = require('./support.js');
const comment = require('./comment.js');
const others = require('./others.js');
const board = require('./board.js');
const login = require('./login.js');
const like = require('./like.js');
const event = require('./event.js');
const hit = require('./hit.js');
const blame = require('./blame.js');
const boardMain = require('./board/boardMain.js');
const boardSelect = require('./board/boardSelect.js');
const boardSelectOne = require('./board/boardSelectOne.js');
const boardHitSelect = require('./board/boardHitSelect.js');

router.use('/greeting', greeting);
router.use('/userInfoUpdate', userInfoUpdate);
router.use('/userSelect', userSelect);
router.use('/mypageUpdate', mypageUpdate);
router.use('/mypageSelectOne', mypageSelectOne);
router.use('/notice', notice);
router.use('/gallery', gallery);
router.use('/refer', refer);
router.use('/support', support);
router.use('/comment', comment);
router.use('/others', others);
router.use('/board', board);
router.use('/login', login);
router.use('/like', like);
router.use('/event', event);
router.use('/hit', hit);
router.use('/blame', blame);
router.use('/boardSelect', boardSelect);
router.use('/boardSelectOne', boardSelectOne);
router.use('/boardMain', boardMain);
router.use('/boardHitSelect', boardHitSelect);


module.exports = router;