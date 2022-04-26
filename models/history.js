const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('history', {
    historyId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "역대직책번호"
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "회원번호"
    },
    historyAuth: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "기수 + 직책"
    }
  }, {
    sequelize,
    tableName: 'history',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "historyId" },
        ]
      },
    ]
  });
};
