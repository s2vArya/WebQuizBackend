
const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class session extends Model {
      static associate (models) {
        models.auths.hasOne(session, { foreignKey: 'auth_id' });
      }
    }
    session.init({
      device_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      device_token: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      device_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      jwt_token: {
        type: DataTypes.STRING(1500),
        allowNull: false
      }
  
    }, {
      sequelize,
      modelName: 'sessions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      freezeTable: true,
    });
    return session;
  };
  