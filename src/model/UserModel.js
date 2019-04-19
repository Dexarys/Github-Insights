const Sequelize = require('sequelize');
const BaseModel = require('./BaseModel');
const RightEnum = require('../enum/RightEnum');
const BcryptUtil = require('../util/BcryptUtil');

class UserModel extends BaseModel {
    createModel() {
        this.model = this.sequelize.define(this.modelName, {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            github_id: {
                type: Sequelize.STRING
            },
            username: {
                type: Sequelize.STRING
            },
            avatar: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            repoNumber: {
                type: Sequelize.INTEGER
            },
            followerNumber: {
                type: Sequelize.INTEGER
            },
            followingNumber: {
                type: Sequelize.INTEGER
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    }
}

module.exports = UserModel;
