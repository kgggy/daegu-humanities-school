const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('event', {
    eventId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "행사번호"
    },
    eventTitle: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "행사제목"
    },
    eventContent: {
      type: DataTypes.STRING(3000),
      allowNull: true,
      comment: "행사글내용"
    },
    voteStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "투표시작일자"
    },
    voteEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "투표마감일자"
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "행사일자(날짜 + 시간)"
    },
    eventAdres: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "행사장소"
    },
    eventAdresDetail: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "행사세부장소"
    },
    crewDiv: {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment: "골프 : gf\/산악회 : mt\/총동창회 : all"
    },
    eventTarget1: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "투표 조건(전체, 임원)"
    },
    eventTarget2: {
      type: DataTypes.STRING(15),
      allowNull: true,
      comment: "투표 조건(구)"
    },
    eventStatus: {
      type: DataTypes.STRING(1),
      allowNull: true,
      comment: "0 : 진행중, 1 : 마감"
    }
  }, {
    sequelize,
    tableName: 'event',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "eventId" },
        ]
      },
    ]
  });
};
