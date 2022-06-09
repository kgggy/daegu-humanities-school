const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comment', {
    cmtId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "댓글번호"
    },
    boardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "글번호",
      references: {
        model: 'board',
        key: 'boardId'
      }
    },
    cmtDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "댓글작성일자"
    },
    cmtContent: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "댓글내용"
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "작성자",
      references: {
        model: 'user',
        key: 'uid'
      }
    }
  }, {
    sequelize,
    tableName: 'comment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "cmtId" },
        ]
      },
      {
        name: "FK_board_TO_comment_2_idx",
        using: "BTREE",
        fields: [
          { name: "uid" },
        ]
      },
      {
        name: "FK_board_TO_comment_1_idx",
        using: "BTREE",
        fields: [
          { name: "boardId" },
        ]
      },
    ]
  });
};
