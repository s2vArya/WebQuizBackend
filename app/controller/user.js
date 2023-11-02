const response = require("../response/index");
const db = require("../models/index");
const httpStatus = require("http-status");
const {
  users: User,
  answers: Answer,
  languages: Language,
  questions: Question,
} = db.sequelize.models;
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
  const dbTrans = await db.sequelize.transaction();
  try {
    const condition = { friend_id: req.query.id };
    const attributes = ["id", "name", "score"];
    const friendData = await commonService.getList(User, condition, attributes);
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

exports.getQuestion = async (req, res) => {
  const dbTrans = await db.sequelize.transaction();
  try {
    const question_id = req.query.id;
    const lang = req.query.lang;
    const sqlQuery = {
      where: { id: req.query.id },
      attributes: ["id", "text"],
      include: [
        {
          model: Answer,
          attributes: ["isCorrect", "text"],
        },
      ],
    };
    if (lang) {
      const includeLanguageModelInQuestion = {
        model: Language,
        attributes: ["text"],
        where: { question_id, language: lang },
      };
      sqlQuery.include.push(includeLanguageModelInQuestion);
      sqlQuery.attributes.pop();
      const includeLanguageModelInAnswer = {
        model: Language,
        attributes: ["text"],
        where: { language: lang },
      };
      sqlQuery.include[0].include = [includeLanguageModelInAnswer];
      sqlQuery.include[0].attributes.pop();
    }
    let questionData = await Question.findOne(sqlQuery);
    questionData = JSON.parse(JSON.stringify(questionData));
    if (!questionData) {
      return response.success(
        req,
        res,
        { msgCode: "" },
        httpStatus.NOT_FOUND,
        dbTrans
      );
    }
    let answerIndex = -1;
    let ansArr = [];
    if (!lang) {
      ansArr = questionData.answers.map((ele, ind) => {
        if (ele.isCorrect) answerIndex = ind;
        return ele.text;
      });
    } else {
      questionData.text = questionData.languages[0].text;
      delete questionData.languages;
      ansArr = questionData.answers.map((ele, ind) => {
        if (ele.isCorrect) answerIndex = ind;
        return ele.languages[0].text;
      });
    }
    questionData.answers = ansArr;
    questionData.answerIndex = answerIndex;
    return response.success(
      req,
      res,
      { msgCode: "SUCCESS", data: questionData },
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

exports.getAllQuestionsId = async (req, res) => {
  const dbTrans = await db.sequelize.transaction();
  try {
    const attributes = ['id']

    const questionIdList = await commonService.getList(Question,'',attributes);
    questionIdList.rows = questionIdList.rows.map((ele) => ele.id);
    if (!questionIdList) {
      return response.success(
        req,
        res,
        { msgCode: "" },
        httpStatus.NOT_FOUND,
        dbTrans
      );
    }
    return response.success(
      req,
      res,
      { msgCode: "SUCCESS", data: questionIdList },
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
