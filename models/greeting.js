const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('greeting', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "일련번호"
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "제목"
    },
    writer: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "작성자"
    },
    content: {
      type: DataTypes.STRING(3000),
      allowNull: true,
      comment: "내용"
    },
    img: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "이미지"
    },
    no: {
      type: DataTypes.STRING(4),
      allowNull: true,
      comment: "회"
    }
  }, {
    sequelize,
    tableName: 'greeting',
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
