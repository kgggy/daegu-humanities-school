var express = require('express');
var router = express.Router();
const fs = require('fs');
const sharp = require('sharp');

const multer = require("multer");
const path = require('path');               
var connection = require('../../config/db').conn;

//파일업로드 모듈
var upload = multer({ //multer안에 storage정보  
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            fs.mkdir('uploads/gallery', function (err) {
                if (err && err.code != 'EEXIST') {
                    // console.log("already exist")
                } else {
                    callback(null, 'uploads/gallery');
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

//갤러리 글 전체조회
router.get('/gallery', async (req, res) => {
    try {
        var page = req.query.page;
        var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
        var sql = "select *, (select count(*) from comment where comment.boardId = g.galleryId) as mcount,\
                             date_format(galleryWritDate, '%Y-%m-%d') as galleryWritDateFmt,\
                             (select count(*) from hitCount where hitCount.boardId = g.galleryId) as hitCount\
                       from gallery g"
        if (searchText != '') {
            sql += " where galleryTitle like '%" + searchText + "%' or galleryContent like '%" + searchText + "%'";
        }
            sql += " order by 2 desc";
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
            let route = req.app.get('views') + '/m_gallery/gallery';
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

//갤러리 검색(ajax)
router.get('/gallerySearch', async (req, res) => {
    var page = req.query.page;
    var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
    var sql = "select *, (select count(*) from comment where comment.boardId = gallery.galleryId) as mcount,\
                      (select count(*) from hitCount where hitCount.boardId = gallery.galleryId) as hitCount,\
                      date_format(galleryWritDate, '%Y-%m-%d') as galleryWritDateFmt from gallery";
    if (searchText != '') {
        sql += " where galleryTitle like '%" + searchText + "%' or galleryContent like '%" + searchText + "%'";
    }
    sql += " order by 2 desc";
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err)
        }
        var countPage = 10; //하단에 표시될 페이지 개수
        var page_num = 10; //한 페이지에 보여줄 개수
        var last = Math.ceil((results.length) / page_num); //마지막 장
        var endPage = Math.ceil(page / countPage) * countPage; //끝페이지(10)
        var startPage = endPage - countPage; //시작페이지(1)
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
        // console.log("ajaxSearch = " + results.length);
        // console.log("page = " + page)
    });
});

//갤러리 글 상세조회
router.get('/gallerySelectOne', async (req, res) => {
    var page = req.query.page;
    var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
    try {
        const param = req.query.galleryId;
        const sql = "select g.*, date_format(galleryWritDate, '%Y-%m-%d') as galleryWritDateFmt, f.fileRoute,\
                           (select count(*) from hitCount where hitCount.boardId = g.galleryId) as hitCount\
                        from gallery g\
                        left join file f on f.boardId = g.galleryId\
                        where g.galleryId = ?";

        connection.query(sql, param, (err, result) => {
            if (err) {
                res.json({
                    msg: "select query error"
                });
            }
            let route = req.app.get('views') + '/m_gallery/gallery_viewForm';
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

//갤러리 등록 폼 이동
router.get('/galleryWritForm', async (req, res) => {
    let route = req.app.get('views') + '/m_gallery/gallery_writForm.ejs';
    res.render(route);
});

// 갤러리 등록
router.post('/galleryWrite', upload.array('file'), async (req, res, next) => {
    const paths = req.files.map(data => data.path);
    const orgName = req.files.map(data => data.originalname);
    try {
        for (let i = 0; i < paths.length; i++) {
            if (req.files[i].size > 1000000) {
                sharp(paths[i]).resize({
                    width: 2000
                }).withMetadata() //이미지 방향 유지
                    .toBuffer((err, buffer) => {
                        if (err) {
                            throw err;
                        }
                        fs.writeFileSync(paths[i], buffer, (err) => {
                            if (err) {
                                throw err
                            }
                        });
                    });
            }
        }

        const param1 = [req.body.galleryTitle, req.body.galleryContent];
        const sql1 = "call insertgallery(?,?)";
        connection.query(sql1, param1, (err) => {
            if (err) {
                throw err;
            }
            const sql2 = "SELECT * FROM gallery order by galleryWritDate desc limit 1"
            connection.query(sql2, (err, result) => {
                if (err) {
                    throw err;
                }
                for (let i = 0; i < paths.length; i++) {
                    const param3 = [paths[i], orgName[i], result[0].galleryId];
                    const sql3 = "insert into file(fileRoute, fileOrgName, boardId) values (?, ?, ?)";
                    connection.query(sql3, param3, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                };
            });
        });
        //fcm
        var firebaseToken;
        const token = "select pushToken from user where pushToken is not null";
        connection.query(token, (err, result) => {
            if (err) {
                throw err;
            }
            for (var i = 0; i < result.length; i++) {
                firebaseToken = result[i].pushToken;
                pushing.sendFcmMessage({
                    "message": {
                        "token": firebaseToken,
                        "notification": {
                            "body": "공지사항을 확인해주세요.",
                            "title": "ECOCE 공지사항"
                        },
                        "data": {
                            "action": "notice"
                        }
                    }
                });
            }
            res.send('<script>alert("갤러리가 등록되었습니다."); location.href="/admin/m_gallery/gallery?&page=1";</script>');
        });
    } catch (error) {
        res.send(error.message);
    }
});

//갤러리 수정 폼 이동
router.get('/galleryUdtForm', async (req, res) => {
    try {
        var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
        const param = req.query.galleryId;
        const page = req.query.page;
        const sql = "select g.*, date_format(galleryWritDate, '%Y-%m-%d') as galleryWritDateFmt, f.fileRoute, f.fileOrgName, f.fileId\
                        from gallery g\
                        left join file f on f.boardId = g.galleryId\
                        where g.galleryId = ?";
        connection.query(sql, param, function (err, result) {
            if (err) {
                console.log(err);
            }
            let route = req.app.get('views') + '/m_gallery/gallery_udtForm';
            res.render(route, {
                'result': result,
                searchText: searchText,
                page: page
            });
        });

    } catch (error) {
        res.status(401).send(error.message);
    }
});

//갤러리 수정
router.post('/galleryUpdate', upload.array('file'), (req, res) => {
    const paths = req.files.map(data => data.path);
    const orgName = req.files.map(data => data.originalname);
    const page = req.body.page;
    var searchText = req.body.searchText == undefined ? "" : req.body.searchText;
    try {
        const param1 = [req.body.galleryTitle, req.body.galleryContent, req.body.galleryId];
        const sql1 = "update gallery set galleryTitle = ?, galleryContent = ?, galleryWritDate = sysdate() where galleryId = ?";
        connection.query(sql1, param1, (err) => {
            if (err) {
                console.error(err);
            }
            for (let i = 0; i < paths.length; i++) {
                const sql2 = "insert into file(fileRoute, fileOrgName, boardId) values (?, ?, ?)";
                const param2 = [paths[i], orgName[i], req.body.galleryId];
                connection.query(sql2, param2, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            };
            res.redirect('gallerySelectOne?galleryId=' + req.body.galleryId + '&page=' + page + '&searchText=' + searchText);
        });
    } catch (error) {
        res.send(error.message);
    }
});

//갤러리 여러개 삭제
router.get('/gallerysDelete', (req, res) => {
    const param = req.query.galleryId;
    const str = param.split(',');
    for (var i = 0; i < str.length; i++) {
        let fileRoute = [];
        const sql1 = "select fileRoute from file where boardId = ?";
        connection.query(sql1, str[i], (err, result) => {
            if (err) {
                console.log(err)
            }
            fileRoute = result;
            if (fileRoute != undefined) {
                for (let j = 0; j < fileRoute.length; j++) {
                    fs.unlinkSync(fileRoute[j].fileRoute, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        return;
                    });
                }
            }
        });
        const sql = "call deleteGallery(?)";
        connection.query(sql, str[i], (err) => {
            if (err) {
                console.log(err)
            }
        });
    }
    res.send('<script>alert("삭제되었습니다."); location.href="/admin/m_gallery/gallery?page=1";</script>');
});

//갤러리 삭제
router.get('/galleryDelete', async (req, res) => {
    try {
        const param = req.query.galleryId;
        // console.log(param);
        const sql = "call deleteGallery(?)";
        connection.query(sql, param, (err) => {
            if (err) {
                console.log(err);
            }
            if (req.query.fileRoute != undefined) {
                if (Array.isArray(req.query.fileRoute) == false) {
                    req.query.fileRoute = [req.query.fileRoute];
                }
                for (let i = 0; i < req.query.fileRoute.length; i++) {
                    fs.unlinkSync(req.query.fileRoute[i], (err) => {
                        if (err) {
                            console.log(err);
                        }
                        return;
                    });
                }
            }
            res.send('<script>alert("갤러리가 삭제되었습니다."); location.href="/admin/m_gallery/gallery?page=1";</script>');
        });
    } catch (error) {
        res.send(error.message);
    }
});

//첨부파일 삭제
router.get('/galleryFileDelete', async (req, res) => {
    const param = req.query.fileId;
    const fileRoute = req.query.fileRoute;
    const page = req.query.page;
    var searchText = req.query.searchText == undefined ? "" : req.query.searchText;
    try {
        const sql = "delete from file where fileId = ?";
        connection.query(sql, param, (err, row) => {
            if (err) {
                console.log(err)
            }
            fs.unlinkSync(fileRoute.toString(), (err) => {
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
    res.redirect('galleryUdtForm?galleryId=' + req.query.galleryId + '&page=' + page + '&searchText=' + searchText);
});
module.exports = router;