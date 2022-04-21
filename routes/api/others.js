var express = require('express');
var router = express.Router();
var connection = require('../../config/db').conn;
// 총칙 파일 다운로드
router.get('/rules/download', async (req, res) => {
  try {
    const sql = "select * from file where fileId = 1";
    let route;
    connection.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json({
          msg: "query error"
        });
      }
      route = result;
      res.status(200).json({
        route,
        rule: '<h2><strong>대한</strong><span style=\\"color:red;\\"><strong>비뇨의학회</strong></span><strong>&nbsp;대구경북지부학회&nbsp;회칙\
        </strong></h2><p>&nbsp;</p><p>&nbsp;</p><p><strong>제 1&nbsp;장&nbsp;총&nbsp;칙</strong></p><p>제 1조&nbsp;본회는&nbsp;대한\
        <span style=\\"color:red;\\">비뇨의학회</span>&nbsp;대구경북지부학회라&nbsp;칭한다.</p><p>제 2조&nbsp;본회는&nbsp;회원상호간의&nbsp;친목과&nbsp;본&nbsp;\
        지부학회발전에&nbsp;기여함을&nbsp;목적으로&nbsp;한다.</p><p>제 3조&nbsp;본회원은&nbsp;대구,경북도내에&nbsp;거주하고&nbsp;<span style=\\"color:red;\\">비뇨의학\
        </span>을&nbsp;전공한&nbsp;자로서&nbsp;정회원&nbsp;및&nbsp;준회원으로&nbsp;구성한다.</p><ol><li>정회원은&nbsp;<span style=\\"color:red;\\">비뇨의학</span>&nbsp;\
        전문의&nbsp;과정을&nbsp;수료한&nbsp;자로&nbsp;구성한다.</li><li>준회원은&nbsp;<span style=\\"color:red;\\">비뇨의학</span>&nbsp;전문의&nbsp;수련&nbsp;과정에\
        &nbsp;있는&nbsp;자&nbsp;또는&nbsp;회칙을&nbsp;찬동하여&nbsp;본인&nbsp;희망에&nbsp;따라&nbsp;가입하고자&nbsp;하는&nbsp;자로&nbsp;한다.</li></ol><p>제 4조&nbsp;\
        본회는&nbsp;사무소를&nbsp;대구광역시&nbsp;혹은&nbsp;경상북도에&nbsp;둔다.</p><p><strong>제 2&nbsp;장&nbsp;조&nbsp;직</strong></p><p>제 5조&nbsp;본회는&nbsp;\
        다음의&nbsp;임원을&nbsp;둔다.</p><p>회장:&nbsp;&nbsp;1명&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \
        부회장:&nbsp;&nbsp;1명&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 총무이사:&nbsp;1명</p><p>학술이사:&nbsp;&nbsp;1명\
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 재무이사:&nbsp;&nbsp;1명&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 개원이사: &nbsp;1명</p><p>\
        자문위원:&nbsp;본회&nbsp; 회장을&nbsp;역임한&nbsp;자&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 감사:&nbsp;1명</p><p>제 6조&nbsp;본&nbsp;회&nbsp;\
        회장은&nbsp;본&nbsp;회를&nbsp;대표하고&nbsp;회를&nbsp;총괄한다.</p><p>제 7조&nbsp;이사회는&nbsp;회장,&nbsp;부회장&nbsp;및&nbsp;이사로&nbsp;구성하고&nbsp;\
        회무를&nbsp;총괄하며&nbsp;정기총회&nbsp;및&nbsp;임시총회를&nbsp;소집할&nbsp;수&nbsp;있다.</p><p>제 8조&nbsp;자문위원은&nbsp;본회&nbsp;회장을&nbsp;역임한&nbsp;\
        자가&nbsp;맡게&nbsp;되며,&nbsp;본&nbsp;회의&nbsp;회무에&nbsp;관하여&nbsp;자문을&nbsp;할&nbsp;수&nbsp;있다.</p><p>제 9조&nbsp;총무이사는&nbsp;회장을&nbsp;보좌하고\
        &nbsp;재무&nbsp;및&nbsp;회&nbsp;운영&nbsp;전반을&nbsp;관장한다.</p><p>제10조&nbsp;학술이사는&nbsp;본회&nbsp;학술부분의&nbsp;전반을&nbsp;담당한다.</p>\
        <p>제11조&nbsp;재무이사는&nbsp;회장을&nbsp;보좌하고&nbsp;재무&nbsp;및&nbsp;서무전반을&nbsp;담당한다.</p><p>제12조&nbsp;회장&nbsp;및&nbsp;부회장은&nbsp;총 \
        회결의에&nbsp;의하여&nbsp;선임되며&nbsp;임기는 1년으로&nbsp;하고&nbsp;필요시&nbsp;중임할&nbsp;수&nbsp;있다.</p><p>제13조&nbsp;이사는&nbsp;회장이&nbsp;지명하여\
        &nbsp;총회에&nbsp;승인을&nbsp;얻어야&nbsp;하고&nbsp;감사는&nbsp;총회에서&nbsp;선출한다.</p><p><strong>제 3&nbsp;장&nbsp;운&nbsp;영</strong></p>\
        <p>제14조&nbsp;회원은&nbsp;매년&nbsp;정기총회에서&nbsp;결정하는&nbsp;정기회비를&nbsp;납부하여야&nbsp;한다(단,&nbsp;만 65세&nbsp;이상&nbsp;회원은&nbsp;면제).\
        </p><p>제15조&nbsp;납부한&nbsp;회비는&nbsp;적립함을&nbsp;원칙으로&nbsp;한다.</p><p>제16조 이사회는 다음 사항을 결의 운영한다.</p><p>&nbsp; &nbsp; &nbsp; \
        &nbsp; 1.&nbsp;회원소집</p><p>&nbsp; &nbsp; &nbsp; &nbsp; 2.&nbsp;회원 경조사시 부조</p><p>&nbsp; &nbsp; &nbsp; &nbsp; 3.&nbsp;기타 필요하다고 인정되는 사항\
        </p><p>제17조 회는 임시총회와 정기총회로 구분하고 정기총회는 12월 중에 개최한다.</p><p>제18조 회비의 차손이 발생시는 그 부족액을 임시회비와 찬조회비로 충당한다.</p>\
        <p>제19조 회비의 출납은 회장이 결정하고 중간보고는 총회에 보고한다.</p><p><strong>제 4&nbsp;장&nbsp;회&nbsp;의</strong></p><p>제20조&nbsp;본회는&nbsp;정기총회와\
        &nbsp;임시총회(학술집담회&nbsp;포함)을&nbsp;둔다.</p><ol><li>정기총회는&nbsp;년 1회로&nbsp;하고&nbsp;일자는&nbsp;이사회가&nbsp;결정한다.</li><li>임시총회는&nbsp;\
        이사회가&nbsp;결정하여&nbsp;소집할&nbsp;수&nbsp;있다.</li></ol><p><strong>제 5&nbsp;장&nbsp;결&nbsp;산</strong></p><p>본회&nbsp;결산은&nbsp;년 1회로&nbsp;하고\
        &nbsp;이를&nbsp;정기총회에&nbsp;승인을&nbsp;얻어야&nbsp;한다.</p><p>&nbsp;</p><p><strong>부 칙</strong></p><p>1.&nbsp;본회 회칙의 수정은 총회에서 시행할 수 있으며,\
        &nbsp;총회에 참가한 회원 1/2&nbsp;이상의 찬성으로 수정할 수 있다.</p><p>2.&nbsp;본회 기타 사항은 일반관례에 준한다.</p><p>3.&nbsp; \
        본회 회칙은 통과한 날로부터 실시한다.</p><p>4.&nbsp;회원 경조사시 부조 및 강의료,&nbsp;원고료 등 기타 필요하다고 인정되는 사항</p><p>&nbsp; &nbsp;:&nbsp;\
        본인상-조기와 <span style=\\"color:red;\\">30만원</span>,</p><p>&nbsp; &nbsp;:&nbsp;부모 및 배우자상-조기와 <span style=\\"color:red;\\">10만원 \
        (최근 3년간 회비를 1회이상 납부한 회원으로 한다.)</span></p><p>&nbsp; &nbsp;:&nbsp;지부학회 강의료-지부학회 내 강사 혹은 대구경북\
         소재의 강사-<span style=\\"color:red;\\">20만원</span></p><p>&nbsp; &nbsp; 대구경북 외 원거리강사-<span style=\\"color:red;\\">40만원\
         </span></p><p>&nbsp;</p><p><strong>(본 회칙은 2019년 4월 12일 임시총회에서 개정되었음.)</strong></p>'
      })
    })
  } catch (error) {
    res.status(401).send(error.message);
  }
});

//연혁 조회
router.get('/history', async (req, res) => {
  try {
    const sql = "select * from history";
    let route;
    connection.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json({
          msg: "query error"
        });
      }
      route = result;
      res.status(200).json(route);
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

//병원 주소
router.get('/companyAdres', async (req, res) => {
  try {
    const sql = "select userAdres1, userAdres2, userWorkplace from user";
    let route;
    connection.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json({
          msg: "query error"
        });
      }
      route = result;
      res.status(200).json(route);
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

//역대회장 조회
router.get('/president', async (req, res) => {
  try {
    const sql = "select * from president p left join user u on p.uid = u.uid;";
    let route;
    connection.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.json({
          msg: "query error"
        });
      }
      route = result;
      res.status(200).json(route);
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;