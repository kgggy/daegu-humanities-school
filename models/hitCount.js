const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hitCount', {
    hitId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "조회번호"
    },
    boardId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "글번호",
      references: {
        model: 'board',
        key: 'boardId'
      }
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "회원번호",
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    hitDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "조회일자"
    }
  }, {
    sequelize,
    tableName: 'hitCount',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "hitId" },
        ]
      },
      {
        name: "FK_board_TO_hitCount_2_idx",
        using: "BTREE",
        fields: [
          { name: "uid" },
        ]
      },
      {
        name: "FK_board_TO_hitCount_1_idx",
        using: "BTREE",
        fields: [
          { name: "boardId" },
        ]
      },
    ]
  });
};
