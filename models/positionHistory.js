const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('positionHistory', {
    id: {
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
    auth: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "기수 + 직책"
    }
  }, {
    sequelize,
    tableName: 'positionHistory',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
