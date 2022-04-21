
const express = require('express');
const router = express.Router();


const greeting = require('./greeting.js');
const user = require('./user.js')
const mypage = require('./mypage.js');
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

router.use('/greeting', greeting);
router.use('/user', user);
router.use('/mypage', mypage);
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



module.exports = router;