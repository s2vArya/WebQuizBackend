const { Model } = require("sequelize");
const { status } = require("./../constant/index");

module.exports = (sequelize, DataTypes) => {
  class auth extends Model {
    static associate(models) {
      models.sessions.belongsTo(auth, {
        foreignKey: "auth_id",
      });
    }
  }
  auth.init(
    {
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(status.ACTIVE, status.DEACTIVATE),
        allowNull: false,
        defaultValue: status.ACTIVE,
      },
    },
    {
      sequelize,
      modelName: "auths",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
    }
  );
  return auth;
};
