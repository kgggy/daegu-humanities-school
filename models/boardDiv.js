const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('boardDiv', {
    boardDivId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "일련번호"
    },
    boardName: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "게시판명"
    }
  }, {
    sequelize,
    tableName: 'boardDiv',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "boardDivId" },
        ]
      },
    ]
  });
};
