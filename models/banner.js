const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('banner', {
    bannerId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "배너번호"
    },
    bannerDiv: {
      type: DataTypes.STRING(1),
      allowNull: true,
      comment: "n산악회 : 0\\n골프회 : 1\n회원홍보배너 : null "
    },
    bannerImg: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "이미지경로"
    },
    bannerUrl: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "이동경로"
    }
  }, {
    sequelize,
    tableName: 'banner',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bannerId" },
        ]
      },
    ]
  });
};
