const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class question extends Model {
    static associate(models) {
      models.languages.belongsTo(question, {
        foreignKey: "question_id",
      });
    }
  }
  question.init(
    {
      text:{
        type:DataTypes.STRING,
        allowNull:false
      }
    },
    {
      sequelize,
      modelName: "questions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      freezeTable: true,
    }
  );
  return question;
};
