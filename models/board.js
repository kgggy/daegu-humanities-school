const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('board', {
    boardId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "글번호"
    },
    boardDivId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "일련번호",
      references: {
        model: 'boardDiv',
        key: 'boardDivId'
      }
    },
    boardTitle: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "제목"
    },
    boardDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "작성일자"
    },
    boardUpdDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "수정일자"
    },
    boardContent: {
      type: DataTypes.STRING(3000),
      allowNull: true,
      comment: "내용"
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    boardFix: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: "0"
    },
    crewDiv: {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment: "총동창회 : all,\\\\n골프회 : gf,\\\\n산악회: mt\n골프 및 산악회 모두 참여 : mtgf"
    }
  }, {
    sequelize,
    tableName: 'board',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "boardId" },
        ]
      },
      {
        name: "FK_boardDiv_TO_board_2_idx",
        using: "BTREE",
        fields: [
          { name: "uid" },
        ]
      },
      {
        name: "FK_boardDiv_TO_board_3_idx",
        using: "BTREE",
        fields: [
          { name: "boardDivId" },
        ]
      },
    ]
  });
};
