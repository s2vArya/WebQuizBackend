const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class answer extends Model {
    static associate(models) {
      models.languages.belongsTo(answer, {
        foreignKey: "answer_id",
      });
      models.questions.hasMany(answer, {
        foreignKey: "question_id",
      });
    }
  }
  answer.init(
    { 
      text:{
        type:DataTypes.STRING,
        allowNull:false
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "answers",
      freezeTable: true,
      timestamps:false
    }
  );
  return answer;
};
