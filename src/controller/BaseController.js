class BaseController {
    constructor(router, service, logger, statusHandler, routePreffix) {
        this.service = service;
        this.router = router;
        this.logger = logger;
        this.statusHandler = statusHandler;
        this.registerRoutes(routePreffix);
        this.logger.info(`Instanciating ${this.constructor.name}...`);
    }

    // eslint-disable-next-line no-unused-vars
    registerRoutes(routePreffix) {
    }

    sendMissingParameters(res) {
        this.statusHandler.sendJson(res, this.statusHandler.internalServerError, { error: 'Missing parameters' });
    }
}

module.exports = BaseController;
