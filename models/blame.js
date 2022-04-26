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
    targetUid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "대상자"
    },
    blameDiv: {
      type: DataTypes.STRING(2),
      allowNull: true,
      comment: "구분"
    },
    blameContent: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "내용"
    },
    boardId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "신고한게시글\/댓글번호"
    },
    blameDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "신고일자"
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
