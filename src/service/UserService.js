const BaseService = require('./BaseService');
const UserDto = require('../dto/UserDto');
const DtoUtil = require('../util/DtoUtil');
const BcryptUtils = require('../util/BcryptUtil');
const RightEnum = require('../enum/RightEnum');

class UserService extends BaseService {
    constructor(daos, logger) {
        super(logger);
        this.dao = daos.user;
    }
}

module.exports = UserService;
