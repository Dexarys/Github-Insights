const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('./config/Logger');
const StatusHandler = require('./middleware/StatusHandler');
const ControllerFactory = require('./factory/ControllerFactory');
const cookieParser = require('cookie-parser');
const envConf = require('dotenv').config();


class Server {
    constructor() {
        this.app = express();
        this.router = express.Router();
        this.setBodyParser();
        this.setPort();
        this.setStatusCodeHandler();
        this.setViewEngine();
    }

    /**
     * * Formatting Port
     */
    static normalizePort(val) {
        const port = parseInt(val, 10);
        if (typeof port !== 'number') {
            return val;
        }
        if (port >= 0) {
            return port;
        }
        return false;
    }

    /**
     * * Bootstrapping Server
     */

    run() {
        logger.info(`Initialisation de l'application`);
        ControllerFactory.initController(this.app,this.router,this.statusHandler,logger).then(() => {
            this.app.listen(this.port, () => logger.info(`Server started on port ${this.port} !`));
        }).catch(err => logger.error(err.message));
    }

    /**
     * * Server Port Configuration
     */
    setPort() {
        logger.info('Getting Server\'s Port...');
        this.port = Server.normalizePort(process.env.PORT || 3000);
    }

    /**
     * * Handling status code
     */
    setStatusCodeHandler() {
        this.statusHandler = new StatusHandler(logger);
        this.app.use(this.statusHandler.handleStatusCode.bind(this.statusHandler));
        this.app.use(this.statusHandler.handleError.bind(this.statusHandler));
    }

    /**
     * * Parser Configuration
     */
    setBodyParser() {
        logger.info('bodyParser configuration...');
        this.router.use(bodyParser.json());
        this.router.use(bodyParser.urlencoded({ extended: true }));
    }

    setViewEngine() {
        logger.info('Setting view engine...');
        this.app.use(express.static(path.join(__dirname, '../public/')));
        this.app.use(cookieParser());
        this.app.set('view engine', 'twig');
        this.app.set('views', path.join(__dirname, './views/'));
    }
}

module.exports = Server;
