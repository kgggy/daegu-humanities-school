const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('recommend', {
    rcmdId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "추천번호"
    },
    boardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "게시글번호",
      references: {
        model: 'board',
        key: 'boardId'
      }
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "회원번호",
      references: {
        model: 'user',
        key: 'uid'
      }
    }
  }, {
    sequelize,
    tableName: 'recommend',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "rcmdId" },
        ]
      },
      {
        name: "FK_board_TO_recommand_2_idx",
        using: "BTREE",
        fields: [
          { name: "uid" },
        ]
      },
      {
        name: "FK_board_TO_recommand_1_idx",
        using: "BTREE",
        fields: [
          { name: "boardId" },
        ]
      },
    ]
  });
};
