var express = require('express');
var router = express.Router();
const fs = require('fs');

const multer = require("multer");
const path = require('path');

// DB 커넥션 생성\              
var connection = require('../../config/db').conn;

//파일업로드 모듈
var upload = multer({ //multer안에 storage정보  
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            fs.mkdir('uploads/notice', function (err) {
                if (err && err.code != 'EEXIST') {
                    console.log("already exist")
                } else {
                    callback(null, 'uploads/notice');
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

//공지사항 글 전체조회
router.get('/notice', async (req, res) => {
    try {
        var page = req.query.page;
        var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
        var sql = "select *, (select count(*) from comment where comment.boardId = notice.noticeId) as mcount,\
                          (select count(*) from hitCount where hitCount.boardId = notice.noticeId) as hitCount,\
                           date_format(noticeWritDate, '%Y-%m-%d') as noticeWritDateFmt\
                       from notice";
        if (searchText != '') {
            sql += " where noticeTitle like '%"+searchText+"%' or noticeContent like '%"+searchText+"%'";
        }
        sql += " order by noticeFix desc, noticeWritDate desc";
        connection.query(sql, (err, results) => {
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
            let route = req.app.get('views') + '/m_notice/notice';
            res.render(route, {
                searchText: searchText,
                results: results,
                page: page, //현재 페이지
                length: results.length - 1, //데이터 전체길이(0부터이므로 -1해줌)
                page_num: page_num,
                countPage: countPage,
                startPage: startPage,
                endPage: endPage,
                pass: true,
                last: last
            });
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//게시글 검색(ajax)
router.get('/noticeSearch', async (req, res) => {
    var page = req.query.page;
    var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
    var sql = "select *, (select count(*) from comment where comment.boardId = notice.noticeId) as mcount,\
                        (select count(*) from hitCount where hitCount.boardId = notice.noticeId) as hitCount,\
                        date_format(noticeWritDate, '%Y-%m-%d') as noticeWritDateFmt\
                 from notice";
    if (searchText != '') {
        sql += " where noticeTitle like '%" + searchText + "%' or noticeContent like '%" + searchText + "%'";
    }
    sql += " order by 1 desc";
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err)
        }
        var countPage = 10; //하단에 표시될 페이지 개수
        var page_num = 10; //한 페이지에 보여줄 개수
        var last = Math.ceil((results.length) / page_num); //마지막 장
        var endPage = Math.ceil(page / countPage) * countPage; //끝페이지(10)
        var startPage = endPage - countPage; //시작페이지(1)
        // ajaxSearch = results;
        if (last < endPage) {
            endPage = last
        };
        res.send({
            ajaxSearch: results,
            page: page, //현재 페이지
            length: results.length - 1, //데이터 전체길이(0부터이므로 -1해줌)
            page_num: page_num,
            countPage: countPage,
            startPage: startPage,
            endPage: endPage,
            pass: true,
            last: last, 
            searchText: searchText
        });
        // console.log("page = " + page)
    });
});

//공지사항 글 상세조회
router.get('/noticeSelectOne', async (req, res) => {
    try {
        var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
        const page = req.query.page;
        const param = req.query.noticeId;
        const sql = "select *,date_format(noticeWritDate, '%Y-%m-%d') as noticeWritDateFmt,\
                            (select count(*) from hitCount where hitCount.boardId = notice.noticeId) as hitCount\
                        from notice\
                       where noticeId = ?";

        connection.query(sql, param, (err, result) => {
            if (err) {
                res.json({
                    msg: "select query error"
                });
            }
            let route = req.app.get('views') + '/m_notice/notice_viewForm';
            res.render(route, {
                'result': result,
                page: page,
                searchText: searchText
            });
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});

//게시글 등록 폼 이동
router.get('/galleryWritForm', async (req, res) => {
    let route = req.app.get('views') + '/m_notice/notice_writForm.ejs';
    var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
    res.render(route, {
        uid: req.query.uid,
        noticeId: req.query.noticeId,
        searchText: searchText
    });
});

//공지사항 작성
router.post('/noticewrite', async (req, res, next) => {
    try {
        const param = [req.body.noticeTitle, req.body.noticeContent];
        const noticeFix = req.body.noticeFix;
        console.log(noticeFix);
        const sql = "call insertNotice(?,?)";
        connection.query(sql, param, (err) => {
            if (err) {
                throw err;
            }
            if(noticeFix == 1){
                const sql1 = "call noticeFixCheck()";
                connection.query(sql1, param, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        });
        res.send('<script>alert("공지사항이 등록되었습니다."); location.href="/admin/m_notice/notice?page=1";</script>');
    } catch (error) {
        res.send(error.message);
    }
});

//공지사항 수정 폼 이동
router.get('/noticeUdtForm', async (req, res) => {
    try {
        var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
        const param = req.query.noticeId;
        const sql = "select * from notice where noticeId = ?";
        const page = req.query.page;
        connection.query(sql, param, function (err, result) {
            if (err) {
                console.log(err);
            }
            let route = req.app.get('views') + '/m_notice/notice_udtForm';
            console.log(route);
            res.render(route, {
                'result': result,
                searchText: searchText,
                page : page
            });
            console.log(result);
        });

    } catch (error) {
        res.status(401).send(error.message);
    }
});

//게시글 수정
router.post('/noticeUpdate', (req, res) => {
    try {
        const noticeFix = req.body.noticeFix == undefined ? "0" : req.body.noticeFix;
        const param = [req.body.noticeTitle, req.body.noticeContent, noticeFix, req.body.noticeId];
        const sql = "update notice set noticeTitle = ?, noticeContent = ?, noticeFix = ?, noticeWritDate = sysdate() where noticeId = ?";
        var searchText = req.body.searchText == undefined ? "" : req.body.searchText;
        const page = req.body.page;
        connection.query(sql, param, (err) => {
            if (err) {
                console.error(err);
            }
            res.redirect('noticeSelectOne?noticeId=' + req.body.noticeId + '&page='+ page +'&searchText=' + searchText);
        });
    } catch (error) {
        res.send(error.message);
    }
});

//공지사항 여러개 삭제
router.get('/noticesDelete', (req, res) => {
    const noticeId = req.query.noticeId;
    const param = req.query.noticeId;
    const str = param.split(',');
    for (var i = 0; i < str.length; i++) {
        const sql = "delete from notice where noticeId = ?";
        connection.query(sql, str[i], (err) => {
            if (err) {
                console.log(err)
            }
        });
    }
    res.send('<script>alert("삭제되었습니다."); location.href="/admin/m_notice/notice?page=1";</script>');
});

//공지사항 삭제
router.get('/noticeDelete', async (req, res) => {
    try {
        const param = req.query.noticeId;
        // console.log(param);
        const sql = "delete from notice where noticeId = ?";
        connection.query(sql, param, (err) => {
            if (err) {
                console.log(err);
            }
            res.send('<script>alert("공지사항이 삭제되었습니다."); location.href="/admin/m_notice/notice?page=1";</script>');
        });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;