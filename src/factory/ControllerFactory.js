/* eslint-disable no-unused-vars */
const BaseFactory = require('./BaseFactory');
const ViewController = require('../controller/ViewController');

/**
 * Here we instantiate the controllers
 */
class ControllerUtil extends BaseFactory {
    static initController(app, router, statusHandler, logger) {
        return new Promise((resolve, reject) => {
            try {
                app.use('/', router);
                const viewController = new ViewController(router, null, logger, statusHandler, '');
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = ControllerUtil;
