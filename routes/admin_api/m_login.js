var express = require('express');
var router = express.Router();
const models = require('../../models');

//로그인 페이지로 이동
router.get('/', (req, res) => {
    let route = req.app.get('views') + '/auth-login-basic';
    res.render(route, {
        layout: false
    })
})

//로그인
router.post('/login', async (req, res) => {
    const {
        adminPwd,
        adminId
    } = req.body;

    const nickChk = await models.admin.findOne({
        where: {
            adminId
        }
    });

    if (nickChk == null) {
        return res.send('<script>alert("아이디 또는 비밀번호를 잘못 입력했습니다."); location.href = document.referrer;</script>');
    }
    const pwdChk = await models.admin.findOne({
        where: {
            adminPwd
        }
    });

    if (pwdChk == null) {
        return res.send('<script>alert("아이디 또는 비밀번호를 잘못 입력했습니다."); location.href = document.referrer;</script>');
    }
    if (nickChk !== '' && pwdChk !== '') {
        if (req.session.user) {
            res.redirect('/admin/m_user?page=1');
        } else { // 세션 없는 admin일 경우 만들어줌
            req.session.user = {
                adminId: adminId
            };
            res.redirect('/admin/m_user?page=1');
        }
    } else {
        return res.send('<script>alert("아이디 또는 비밀번호를 잘못 입력했습니다."); location.href = document.referrer;</script>');
    }


});

//로그아웃
router.get('/logout', async (req, res) => {
    if (req.session.user) {
        req.session.destroy(function (err) {
            if (err) throw err;
            res.send("<script>alert('로그아웃 되었습니다.'); location.href='/admin'</script>");
        });
    } else {
        res.redirect('/admin/m_user?page=1');
    }
});

module.exports = router;