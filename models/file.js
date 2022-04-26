const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('file', {
    fileId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "파일번호"
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
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "행사번호",
      references: {
        model: 'event',
        key: 'eventId'
      }
    },
    fileRoute: {
      type: DataTypes.STRING(300),
      allowNull: true,
      comment: "파일경로"
    },
    fileOrgName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "파일원본명"
    },
    fileType: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "파일타입"
    }
  }, {
    sequelize,
    tableName: 'file',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "fileId" },
        ]
      },
      {
        name: "FK_event_TO_file_2_idx",
        using: "BTREE",
        fields: [
          { name: "boardId" },
        ]
      },
      {
        name: "FK_event_TO_file_1_idx",
        using: "BTREE",
        fields: [
          { name: "eventId" },
        ]
      },
    ]
  });
};
