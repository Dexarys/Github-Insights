'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    avatar: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    repoNumber: DataTypes.INTEGER,
    projectNumber: DataTypes.INTEGER,
    followerNumber: DataTypes.INTEGER,
    followingNumber: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
