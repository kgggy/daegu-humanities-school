var DataTypes = require("sequelize").DataTypes;
var _admin = require("./admin");
var _banner = require("./banner");
var _blame = require("./blame");
var _board = require("./board");
var _boardDiv = require("./boardDiv");
var _comment = require("./comment");
var _event = require("./event");
var _file = require("./file");
var _greeting = require("./greeting");
var _history = require("./history");
var _hitCount = require("./hitCount");
var _positionHistory = require("./positionHistory");
var _president = require("./president");
var _recommend = require("./recommend");
var _user = require("./user");
var _vote = require("./vote");

function initModels(sequelize) {
  var admin = _admin(sequelize, DataTypes);
  var banner = _banner(sequelize, DataTypes);
  var blame = _blame(sequelize, DataTypes);
  var board = _board(sequelize, DataTypes);
  var boardDiv = _boardDiv(sequelize, DataTypes);
  var comment = _comment(sequelize, DataTypes);
  var event = _event(sequelize, DataTypes);
  var file = _file(sequelize, DataTypes);
  var greeting = _greeting(sequelize, DataTypes);
  var history = _history(sequelize, DataTypes);
  var hitCount = _hitCount(sequelize, DataTypes);
  var positionHistory = _positionHistory(sequelize, DataTypes);
  var president = _president(sequelize, DataTypes);
  var recommend = _recommend(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var vote = _vote(sequelize, DataTypes);

  file.belongsTo(banner, { as: "banner", foreignKey: "bannerId"});
  banner.hasMany(file, { as: "files", foreignKey: "bannerId"});
  comment.belongsTo(board, { as: "board", foreignKey: "boardId"});
  board.hasMany(comment, { as: "comments", foreignKey: "boardId"});
  file.belongsTo(board, { as: "board", foreignKey: "boardId"});
  board.hasMany(file, { as: "files", foreignKey: "boardId"});
  hitCount.belongsTo(board, { as: "board", foreignKey: "boardId"});
  board.hasMany(hitCount, { as: "hitCounts", foreignKey: "boardId"});
  recommend.belongsTo(board, { as: "board", foreignKey: "boardId"});
  board.hasMany(recommend, { as: "recommends", foreignKey: "boardId"});
  board.belongsTo(boardDiv, { as: "boardDiv", foreignKey: "boardDivId"});
  boardDiv.hasMany(board, { as: "boards", foreignKey: "boardDivId"});
  recommend.belongsTo(comment, { as: "cmt", foreignKey: "cmtId"});
  comment.hasMany(recommend, { as: "recommends", foreignKey: "cmtId"});
  file.belongsTo(event, { as: "event", foreignKey: "eventId"});
  event.hasMany(file, { as: "files", foreignKey: "eventId"});
  vote.belongsTo(event, { as: "event", foreignKey: "eventId"});
  event.hasMany(vote, { as: "votes", foreignKey: "eventId"});
  board.belongsTo(user, { as: "uid_user", foreignKey: "uid"});
  user.hasMany(board, { as: "boards", foreignKey: "uid"});
  comment.belongsTo(user, { as: "uid_user", foreignKey: "uid"});
  user.hasMany(comment, { as: "comments", foreignKey: "uid"});
  file.belongsTo(user, { as: "uid_user", foreignKey: "uid"});
  user.hasMany(file, { as: "files", foreignKey: "uid"});
  hitCount.belongsTo(user, { as: "uid_user", foreignKey: "uid"});
  user.hasMany(hitCount, { as: "hitCounts", foreignKey: "uid"});
  recommend.belongsTo(user, { as: "uid_user", foreignKey: "uid"});
  user.hasMany(recommend, { as: "recommends", foreignKey: "uid"});
  vote.belongsTo(user, { as: "uid_user", foreignKey: "uid"});
  user.hasMany(vote, { as: "votes", foreignKey: "uid"});

  return {
    admin,
    banner,
    blame,
    board,
    boardDiv,
    comment,
    event,
    file,
    greeting,
    history,
    hitCount,
    positionHistory,
    president,
    recommend,
    user,
    vote,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
