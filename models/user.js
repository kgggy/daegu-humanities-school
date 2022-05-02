const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    uid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "회원번호"
    },
    userName: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "이름"
    },
    userPhone: {
      type: DataTypes.STRING(13),
      allowNull: true,
      comment: "휴대번호"
    },
    userEmail: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: "이메일"
    },
    officePhone: {
      type: DataTypes.STRING(13),
      allowNull: true,
      comment: "직장번호"
    },
    userAdres1: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "주소1(시)"
    },
    userAdres2: {
      type: DataTypes.STRING(15),
      allowNull: true,
      comment: "주소2(구)"
    },
    userAdres3: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "도로명"
    },
    userAuth: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "권한(학장, 원장, 교학처장...)"
    },
    userImg: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "프로필사진"
    },
    detailImg: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "홍보사진"
    },
    userNum: {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment: "기수"
    },
    userUrl: {
      type: DataTypes.STRING(300),
      allowNull: true,
      comment: "홈페이지주소"
    },
    userJob: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "소속(회사 및 직급)"
    },
    faxPhone: {
      type: DataTypes.STRING(13),
      allowNull: true,
      comment: "팩스번호"
    },
    userCrew: {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment: "골프 : gf\/산악회 : mt\/총동창회 : all\/ 골프 및 산악회 모두 참여 : mtgf"
    },
    mtPosition: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "산악회 직책"
    },
    gfPosition: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "골프회 직책"
    },
    oneSignalId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "푸쉬토큰값"
    },
    userSocialDiv: {
      type: DataTypes.STRING(7),
      allowNull: true,
      comment: "소셜로그인 종류"
    },
    userAdres4: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "상세주소"
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "uid" },
        ]
      },
    ]
  });
};
