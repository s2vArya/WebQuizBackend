const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class language extends Model {
    static associate(models) {
      models.questions.hasMany(language, {
        foreignKey: "question_id",
      });
      models.answers.hasMany(language,{
        foreignKey:"answer_id"
      })
    }
  }
  language.init(
    {
      language: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "languages",
      timestamps:false,
      freezeTable: true,
    }
  );
  return language;
};
