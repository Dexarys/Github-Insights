const BaseFactory = require('./BaseFactory');

/**
 * Here we instantiate the services
 */
class ServiceFactory extends BaseFactory {
    static initServices(services, daos, logger) {
        return new Promise((resolve, reject) => {
            try {
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = ServiceFactory;
