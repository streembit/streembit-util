/*
 
This file is part of Streembit application. 
Streembit is an open source project to create a real time communication system for humans and machines. 

Streembit is a free software: you can redistribute it and/or modify it under the terms of the GNU General Public License 
as published by the Free Software Foundation, either version 3.0 of the License, or (at your option) any later version.

Streembit is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Streembit software.  
If not, see http://www.gnu.org/licenses/.
 
-------------------------------------------------------------------------------------------------------------------------
Author: Tibor Z Pardi 
Copyright (C) 2017 The Streembit software development team
-------------------------------------------------------------------------------------------------------------------------

*/


'use strict';

const path = require('path');
const fs = require('fs');
const winston = require('winston');
const util = require('util');


let singleton = Symbol();
let singletonEnforcer = Symbol();

class Logger {
    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) {
            throw "Cannot construct singleton";
        }

        this.logger = 0;
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new Logger(singletonEnforcer);
        }
        return this[singleton];
    }

    logmsg(level, msg) {
        if (!this.logger || !this.logger.log) {
            console.log(msg);
        }
        else {
            this.logger.log(level, msg);
        }
    }


    error (err, param) {
        try {
            if (!err) {
                return;
            }

            if (param) {
                var msg = err;
                if (typeof err === 'string') {
                    if (err.indexOf("%j") > -1) {
                        //  the Error object is not formated well from the util library
                        //  send only the message field if that is an Error object
                        if (param.message && (typeof param === Error || typeof param === Object)) {
                            err = err.replace("%j", "%s");
                            msg = util.format(err, param.message);
                        }
                        else if (typeof param === 'string') {
                            err = err.replace("%j", "%s");
                            msg = util.format(err, param);
                        }
                        else if (typeof param === 'number') {
                            err = err.replace("%j", "%d");
                            msg = util.format(err, param);
                        }
                    }
                    else {
                        msg = util.format(err, param);
                    }
                }
                else {
                    msg = err;
                }

                this.logmsg("error", msg);
                return msg;
            }
            else {
                this.logmsg("error", err);
                return err;
            }
        }
        catch (e) {
            if (err) {
                // still log to the console
                console.log(err.message ? err.message : err);
            }
        }
    }

    level_log(level, msg, val1, val2, val3, val4) {
        try {
            if (msg) {
                if (val1 !== undefined && val2 !== undefined && val3 !== undefined && val4 !== undefined) {
                    msg = util.format(msg, val1, val2, val3, val4);
                    this.logmsg(level, msg);
                }
                else if (val1 !== undefined && val2 !== undefined && val3 !== undefined) {
                    msg = util.format(msg, val1, val2, val3);
                    this.logmsg(level, msg);
                }
                else if (val1 !== undefined && val2 !== undefined) {
                    msg = util.format(msg, val1, val2);
                    this.logmsg(level, msg);
                }
                else if (val1 !== undefined) {
                    msg = util.format(msg, val1);
                    this.logmsg(level, msg);
                }
                else {
                    this.logmsg(level, msg);
                }
            }
        }
        catch (e) {
            if (msg) {
                // still log to the console
                console.log(msg)
            }
        }
    }

    info (msg, val1, val2, val3, val4) {
        this.level_log("info", msg, val1, val2, val3, val4);
    }

    debug (msg, val1, val2, val3, val4) {
        this.level_log("debug", msg, val1, val2, val3, val4);
    }

    warn (msg, val1, val2, val3, val4) {
        this.level_log("warn", msg, val1, val2, val3, val4);
    }

    setlevel (newlevel) {
        if (this.logger && this.logger.transports) {
            for (var i = 0; i < this.logger.transports.length; i++) {
                this.logger.transports[i].level = newlevel;
            }
        }
    }

    configure(loglevel, logpath, excpath, trans) {
        var transports = [];
        if (trans.indexOf('console') > -1) {
            transports.push(
                new winston.transports.Console({
                    level: loglevel,
                    json: false,
                    //colorize: true,
                    //format: winston.format.simple()
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            );
        }
        if (trans.indexOf('file') > -1) {
            transports.push(
                new (winston.transports.File)({
                    filename: logpath,
                    level: loglevel,
                    maxsize: 4096000, // 4MB
                    maxFiles: 100,
                    tailable: true,
                    colorize: false,
                    format: winston.format.json()
                })
            );
        }

        this.logger = winston.createLogger({
            exitOnError: false,
            transports: transports,
            exceptionHandlers: [
                new winston.transports.File({ filename: excpath }),
                new winston.transports.Console()
            ]
        });

    }

    init (loglevel, logdir, transport = ['console', 'file']) {
        if (!logdir) {
            var wdir = process.cwd();
            logdir = path.join(wdir, "logs");
        }
        // get logfile path
        var logfile = path.join(logdir, 'streembit.log');

        // create logs directory, if not exists
        try {
            if (!fs.existsSync(logdir)) {
                fs.mkdirSync(logdir);
            }
        }
        catch (e) {
            return console.log("Error in creating logs directory: " + e.message);
        }

        // rename log file, if exists
        try {
            if (fs.existsSync(logfile)) {
                fs.renameSync(logfile, path.join(logdir, "/streembit_" + Date.now() + ".log"));
            }
        }
        catch (e) {
            return console.log("Error in renaming log file: " + e.message);
        }

        this.configure(loglevel || "debug", logfile, path.join(logdir, 'exception.log'), transport);

        this.logger.info("logfile: " + logfile);
    }
}

module.exports = Logger.instance;
