const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');
const session = require('express-session');

const app = express(); //express 패키지 호출, app변수 객체 생성. => app객체에 기능 하나씩 연결.

const routes = require('./routes/api');
const adminRoutes = require('./routes/admin_api');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

//app.use => 미들웨어 연결
app.use(logger('dev')); //요청에 대한 정보 출력
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // css 연결
// app.use(express.static(path.join(__dirname, 'views'))); // html 연결
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(expressLayouts);

// 세션 설정
app.use( // request를 통해 세션 접근 가능 ex) req.session
  session({
    // key: "loginData",
    secret: "keyboard cat", // 반드시 필요한 옵션. 세션을 암호화해서 저장함
    resave: false, // 세션 변경되지 않아도 계속 저장됨. 기본값은 true지만 false로 사용 권장
    saveUninitialized: true, // 세션을 초기값이 지정되지 않은 상태에서도 강제로 저장. 모든 방문자에게 고유 식별값 주는 것.
    cookie: {
      maxAge: 3600000
    },
    rolling: true
    // store: new MYSQLStore(connt),
  })
);

app.use(function (req, res, next) {
  if (req.session.user) {
    global.sessionComId = req.session.user.comId;
  }
  next();
});


// 화면 engine을 ejs로 설정
app.set('layout', '../layout/layout');
app.set("layout extractScripts", true);
app.set('view engine', 'ejs');
// app.engine('ejs', require('ejs').__express);
// app.engine('html', require('ejs').renderFile);
// app.set('views', __dirname + '/views/ejs');   //view 경로 설정
app.set('views', path.join(__dirname, '/views/admin_ejs'));


// app.get('/', (req, res) => { res.render(__dirname + "/views/ejs/index.ejs", {layout:false}) })
app.get('/', (req, res) => {
  res.redirect('/admin');
})
// app.post(admin, (req, res) => { res.sendFile(__dirname + "/views/index.html"); })
// app.get(admin + "orgm_list", (req, res) => { res.render(__dirname + ejs + "orgm_viewForm.ejs"); }) // 랜더링 필요하기 때문에 sendfile 대신 render 써줘야함
// app.get(admin, (req, res) => { res.render(__dirname + ejs + "index.ejs"); });
// app.get("/admin/orgm_list", (req, res) => { res.sendFile(__dirname + admin + "orgmember_mngt/orgm_listForm.html"); })
app.use('/', routes);
app.use('/admin', adminRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // next(createError(404));
  res.status(404).send('404 error')
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app; //app객체를 모듈로 만듦(bin/www에서 사용된 app모듈)