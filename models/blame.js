const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('blame', {
    blameId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "신고번호"
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "신고자"
    },
    userName: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "신고자이름"
    },
    targetUid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "대상자"
    },
    targetUserName: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "대상자이름"
    },
    targetUserPhone: {
      type: DataTypes.STRING(13),
      allowNull: true,
      comment: "대상자전화번호"
    },
    targetType: {
      type: DataTypes.STRING(1),
      allowNull: true,
      comment: "0이면 게시글, 1이면 댓글"
    },
    blameContent: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "신고사유"
    },
    targetContentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "신고된게시글\/댓글번호"
    },
    blameDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "신고일자"
    }
  }, {
    sequelize,
    tableName: 'blame',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "blameId" },
        ]
      },
    ]
  });
};
