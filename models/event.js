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
