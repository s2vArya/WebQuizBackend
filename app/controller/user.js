const response = require("../response/index");
const db = require("../models/index");
const httpStatus = require("http-status");
const { users: User } = db.sequelize.models;
const commonService = require("../services/common");


exports.saveUser = async (req, res) => {
  const dbTrans = await db.sequelize.transaction();
  try {
    const { name, score, friend_id } = req.body;
    const userData = { name, score };
    if (friend_id) userData.friend_id = friend_id;
    const savedUserData = await commonService.addDetail(
      User,
      userData,
      dbTrans
    );
    return response.success(
      req,
      res,
      { msgCode: "SAVE_USER", data: savedUserData },
      httpStatus.OK,
      dbTrans
    );
  } catch (err) {
    console.log(err);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans
    );
  }
};

exports.getFriends = async (req, res) => {
  try {
    const dbTrans = await db.sequelize.transaction();
    const condition = { friend_id: req.query.id };
    const friendData = await commonService.findAllData(User, condition);
    if (!friendData.length) {
      return response.success(
        req,
        res,
        { msgCode: "FRIENDS_LIST", data: friendData },
        httpStatus.NOT_FOUND,
        dbTrans
      );
    }
    return response.success(
      req,
      res,
      { msgCode: "FRIENDS_LIST", data: friendData },
      httpStatus.OK,
      dbTrans
    );
  } catch (err) {
    console.log(err);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans
    );
  }
};

// exports.getQuestion
