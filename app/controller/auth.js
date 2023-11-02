const response = require("../response/index");
const db = require("../models/index");
const httpStatus = require("http-status");
const {
  auths: Auth,
  sessions: Session,
  questions: Questions,
  answers: Answers,
  languages:Languages
} = db.sequelize.models;
const commonService = require("../services/common");
const { status } = require("./../constant/index");
const passwordHash = require("./../utils/password");
const middleware = require("./../middleware");
const { env } = require("./../constant/index");
const constants = require("./../constant");

exports.login = async (req, res, next) => {
  const dbTrans = await db.sequelize.transaction();
  try {
    const { email, password, device_id, device_token, device_type } = req.body;
    const condition = { email };
    const checkUser = await commonService.findByCondition(Auth, condition);
    if (!checkUser) {
      return response.error(
        req,
        res,
        { msgCode: "EMAIL_NOT_EXIST" },
        httpStatus.UNAUTHORIZED,
        dbTrans
      );
    }
    // check status if block than return
    if (checkUser.status === status.DEACTIVATE) {
      return response.error(
        req,
        res,
        { msgCode: "EMAIL_NOT_EXIST" },
        httpStatus.UNAUTHORIZED,
        dbTrans
      );
    }

    const passwordComparison = await passwordHash.comparePassword(
      password,
      checkUser.password
    );
    if (!passwordComparison)
      return response.error(
        req,
        res,
        { msgCode: "PASSWORD_MISMATCH" },
        httpStatus.UNAUTHORIZED,
        dbTrans
      );

    const token = middleware.generateAuthJwt({
      id: checkUser.id,
      email,
      expires_in: env.TOKEN_EXPIRES_IN,
    });
    if (!token) {
      return response.error(
        req,
        res,
        { msgCode: "INTERNAL_SERVER_ERROR" },
        httpStatus.INTERNAL_SERVER_ERROR,
        dbTrans
      );
    }
    req.loginData = {
      dbTrans,
      deviceDetails: { device_id, device_token, device_type },
      auth_details: {
        id: checkUser.id,
        user_type: checkUser.user_type,
        mobile: checkUser.mobile,
        token,
      },
    };
    return next();
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

exports.createSession = async (req, res) => {
  const { dbTrans } = req.loginData;
  try {
    const { device_id, device_token, device_type } =
      req.loginData.deviceDetails;
    const { auth_details } = req.loginData;
    const condition = { auth_id: auth_details.id };
    const check_session = await commonService.findByCondition(
      Session,
      condition
    );

    if (check_session) {
      const condition = { id: check_session.id };
      // for hard delete true is required to pass in delete query
      const destroy_session = await commonService.deleteQuery(
        Session,
        condition,
        dbTrans,
        true
      );
      if (!destroy_session) {
        return response.error(
          req,
          res,
          { msgCode: "INTERNAL_SERVER_ERROR" },
          httpStatus.INTERNAL_SERVER_ERROR,
          dbTrans
        );
      }
    }
    const sessionData = {
      auth_id: req.loginData.auth_details.id,
      device_id,
      device_token,
      device_type,
      jwt_token: req.loginData.auth_details.token,
    };
    const create_session = await commonService.addDetail(
      Session,
      sessionData,
      dbTrans
    );
    if (!create_session) {
      return response.error(
        req,
        res,
        { msgCode: "INTERNAL_SERVER_ERROR" },
        httpStatus.INTERNAL_SERVER_ERROR,
        dbTrans
      );
    }

    const { ...data } = req.loginData.auth_details;

    const msgCode = "LOGIN_SUCCESSFUL";

    return response.success(
      req,
      res,
      { msgCode, data },
      httpStatus.OK,
      dbTrans
    );
  } catch (err) {
    // console.log("error are", err);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans
    );
  }
};

exports.addQuestion = async (req, res) => {
  const dbTrans = await db.sequelize.transaction();
  try {
    const { question, answer, answerIndex } = req.body;
    const questionEnglishText = { text: question.en };
    const questionData = await commonService.addDetail(
      Questions,
      questionEnglishText,
      dbTrans
    );
    if (!questionData)
      return response.error(
        req,
        res,
        { msgCode: "INTERNAL_SERVER_ERROR" },
        httpStatus.INTERNAL_SERVER_ERROR,
        dbTrans
      );
    const answerEnglishArr = answer.map((ans, ind) => {
      const ansObj = { text: ans.en, question_id: questionData.id };
      if (ind === answerIndex * 1) ansObj.isCorrect = 1;
      return ansObj;
    });
    const answerData = await commonService.addBulkData(
      Answers,
      answerEnglishArr,
      dbTrans
    );
    if (!answerData)
      return response.error(
        req,
        res,
        { msgCode: "INTERNAL_SERVER_ERROR" },
        httpStatus.INTERNAL_SERVER_ERROR,
        dbTrans
      );
    const {en,...otherLangs} = question;
    const languageData = []
    for( let lang of Object.keys(otherLangs)){
      const quesLangData ={language:lang,text:question[lang],question_id:questionData.id} ;
      languageData.push(quesLangData);
      answerData.forEach((element,ind )=> {
        const languageObj = {language:lang,text:answer[ind][lang],answer_id:element.id };
        languageData.push(languageObj);
      });
    }
    const saveLang = await commonService.addBulkData(Languages, languageData,dbTrans);
    if(!saveLang) return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans
    );
    return response.success(
      req,
      res,
      { msgCode: "QUESTIONS_ADDED", data: req.body },
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

exports.addAdmin = async (req, res) => {
  const dbTrans = await db.sequelize.transaction();
  try {
    const { email, password } = req.body;
    const condition = { email };
    const checkEmail = await commonService.findByCondition(Auth, condition);
    if (checkEmail)
      return response.error(
        req,
        res,
        { msgCode: "EMAIL_ALREADY_EXISTS" },
        httpStatus.CONFLICT,
        dbTrans
      );
    const hashedPassword = await passwordHash.generateHash(password);
    const status = constants.status.ACTIVE;
    const adminData = { email, password: hashedPassword, status };
    const savedData = await commonService.addDetail(Auth, adminData, dbTrans);
    if (!savedData)
      return response.error(
        req,
        res,
        { msgCode: "INTERNAL_SERVER_ERROR" },
        httpStatus.INTERNAL_SERVER_ERROR,
        dbTrans
      );
    return response.success(
      req,
      res,
      { msgCode: "ADMIN_ADDED", data: savedData },
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

exports.logout = async (req, res) => {
  const dbTrans = await db.sequelize.transaction();
  try {
    const id = req.data.id;
    const condition = { auth_id: id };
    const check_session = await commonService.findByCondition(
      Session,
      condition
    );

    if (check_session) {
      const condition = { id: check_session.id };
      // for hard delete true is required to pass in delete query
      const destroy_session = await commonService.deleteQuery(
        Session,
        condition,
        dbTrans,
        true
      );
      if (!destroy_session) {
        return response.error(
          req,
          res,
          { msgCode: "INTERNAL_SERVER_ERROR" },
          httpStatus.INTERNAL_SERVER_ERROR,
          dbTrans
        );
      }
    }
    return response.success(
      req,
      res,
      { msgCode: "LOGOUT_SUCCESSFUL" },
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
