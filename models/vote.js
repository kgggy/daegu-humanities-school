const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vote', {
    voteId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "투표번호"
    },
    choose: {
      type: DataTypes.STRING(1),
      allowNull: false,
      comment: "선택(0이면 참여, 1이면 불참)"
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
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "행사번호",
      references: {
        model: 'event',
        key: 'eventId'
      }
    }
  }, {
    sequelize,
    tableName: 'vote',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "voteId" },
        ]
      },
      {
        name: "FK_event_TO_vote_2_idx",
        using: "BTREE",
        fields: [
          { name: "uid" },
        ]
      },
      {
        name: "FK_event_TO_vote_1_idx",
        using: "BTREE",
        fields: [
          { name: "eventId" },
        ]
      },
    ]
  });
};
