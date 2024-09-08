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
const { createLogger, transports } = require('winston');
const util = require('util');
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston"); 

let singleton = Symbol();
let singletonEnforcer = Symbol();

class Logger {
    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) {
            throw "Cannot construct singleton";
        }

        this.logger = 0;
        this.islogtail = false;
        this.logtail = undefined;
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
            if (this.islogtail && this.logtail !== undefined) {
                // Ensure that all logs are sent to Logtail
                this.logtail.flush();
            }
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

    configure(loglevel, trans, params) {

        var winston_transports = [];

        if (trans.indexOf('console') > -1) {
            winston_transports.push(
                new transports.Console({
                    level: loglevel,
                    json: false,
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    ),
                    handleExceptions: true
                })
            );
        }

        if (trans.indexOf('file') > -1) {
            if (!params || !params.logpath) {
                console.log("Failed to initialize file log. Error: the params.logpath parameter is required.")
            }
            else {
                winston_transports.push(
                    new transports.File({
                        filename: params.logpath,
                        level: loglevel,
                        maxsize: 4096000, // 4MB
                        maxFiles: 100,
                        tailable: true,
                        colorize: false,
                        format: winston.format.json(),
                        handleExceptions: true
                    })
                );
            }            
        }

        if (trans.indexOf('logtail') > -1) {
            if (!params.logtail_token) {
                console.log("Failed to initialize file log. Error: logtail requires a token.")
            }
            else {
                // Create a Logtail client
                this.logtail = new Logtail(params.logtail_token);
                const logtail_trans = new LogtailTransport(this.logtail);
                winston_transports.push(
                    logtail_trans 
                );
                // set the logtail flag
                this.islogtail = true;
            }            
        }

        var logconfig = {
            transports: winston_transports,
            exitOnError: false
        };

        //if (trans.indexOf('file') > -1) {
        //    logconfig.exceptionHandlers.push(new transports.File({ filename: excpath })); 
        //}

        this.logger = createLogger(logconfig);
    }

    init(loglevel, transports = ['console'], opts = {}) {

        var params = {};

        if (transports.indexOf('file') > -1) {
            var logdir;
            if (!opts.logdir) {
                var wdir = process.cwd();
                logdir = path.join(wdir, "logs");
            }
            else {
                logdir = opts.logdir;
            }

            // create logs directory, if not exists
            try {
                if (!fs.existsSync(logdir)) {
                    fs.mkdirSync(logdir);
                }
            }
            catch (e) {
                return console.log("Error in creating logs directory: " + e.message);
            }


            // test if we can write to the logdir
            try {
                var testfile_path = path.join(logdir, "temp.txt");
                if (fs.existsSync(testfile_path)) {
                    fs.rmSync(testfile_path);
                }
                fs.writeFileSync(testfile_path, 'testing the path');
                //remove the test file
                fs.rmSync(testfile_path);
            }
            catch (e) {
                return console.log("Error in writing to the logs directory: " + e.message);
            }
            
            var logf = opts.logfile  || 'streembit.log';
            // get the logfile path
            var logfile_path = path.join(logdir, logf);            

            // rename the log file, if it exists
            try {
                if (fs.existsSync(logfile_path)) {
                    fs.renameSync(logfile_path, path.join(logdir, `/${Date.now()}_${logf}`));
                }
            }
            catch (e) {
                return console.log("Error in renaming log file: " + e.message);
            }

            params.logpath = logfile_path;
        }

        if (transports.indexOf('logtail') > -1) {
            if (!opts.logtail_token) {
                return console.log("Error in creating logger: logtail token is required for logtail log type");
            }
            params.logtail_token = opts.logtail_token;
        }

        this.configure(loglevel || "debug", transports, params);

        if (transports.indexOf('file') > -1) {
            this.logger.info("logfile: " + params.logpath);
        }
    }
}

module.exports = Logger.instance;
