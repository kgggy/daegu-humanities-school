const express = require('express');
const router = express.Router();


const greeting = require('./others/greeting');
const userSelect = require('./user/userSelect.js')
const mypageUpdate = require('./user/mypageUpdate.js');
const mypageSelectOne = require('./user/mypageSelectOne.js')
const bannerSelect = require('./banner/bannerSelect.js');
const tree = require('./others/tree.js');
const rules = require('./others/rules.js');
const login = require('./login/login.js');
const boardMain = require('./board/boardMain.js');
const boardSelect = require('./board/boardSelect.js');
const boardSelectOne = require('./board/boardSelectOne.js');
const boardHitSelect = require('./board/boardHitSelect.js');
const president = require('./others/president.js');
const eventSelect = require('./event/eventSelect.js');
const voteAttend = require('./vote/voteAttend.js');
const voteSelect = require('./vote/voteSelect.js');
const cmtSelect = require('./comment/cmtSelect.js');
const cmtInsert = require('./comment/cmtInsert.js');
const cmtDelete = require('./comment/cmtDelete.js');
const rcmdUpdate = require('./recommend/rcmdUpdate.js');
const rcmdSelect = require('./recommend/rcmdSelect.js');
const blame = require('./blame/blame.js');
const infoUpdate = require('./user/infoUpdate.js');
const curriculum = require('./curriculum/curriculum.js');

router.use('/greeting', greeting);
router.use('/userSelect', userSelect);
router.use('/mypageUpdate', mypageUpdate);
router.use('/mypageSelectOne', mypageSelectOne);
router.use('/bannerSelect', bannerSelect);
router.use('/tree', tree);
router.use('/rules', rules);
router.use('/login', login);
router.use('/eventSelect', eventSelect);
router.use('/boardSelect', boardSelect);
router.use('/boardSelectOne', boardSelectOne);
router.use('/boardMain', boardMain);
router.use('/boardHitSelect', boardHitSelect);
router.use('/president', president);
router.use('/voteAttend', voteAttend);
router.use('/voteSelect', voteSelect);
router.use('/cmtSelect', cmtSelect);
router.use('/cmtInsert', cmtInsert);
router.use('/cmtDelete', cmtDelete);
router.use('/rcmdUpdate', rcmdUpdate);
router.use('/rcmdSelect', rcmdSelect);
router.use('/blame', blame);
router.use('/infoUpdate', infoUpdate);
router.use('/curriculum', curriculum);
router.use('/privacypolicy', router.get('/', async (req, res) => {
    let route = req.app.get('views') + '/privacypolicy';
    res.render(route, {
        layout: false
    });
}));

module.exports = router;