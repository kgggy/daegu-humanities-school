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
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: "all",
      comment: "전체배너: all 산악회 : mt 골프회 : gt 골프 및 산악회 모두 참여 : mtgf"
    },
    bannerUrl: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "이동경로"
    },
    bannerTitle: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: "후원업체명"
    },
    bannerDetail: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "후원업체설명"
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
