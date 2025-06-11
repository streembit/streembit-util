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


const assert = require('assert');
const path = require('path');
const fs = require('fs');
const logger = require("../index").logger;
const { describe, it, test, after } = require('node:test');

after(() => {
    setTimeout(
        () => {
            var wdir = process.cwd();
            var logdir = path.join(wdir, "logs");
            if (fs.existsSync(logdir)) {
                const files = fs.readdirSync(logdir);
                for (const file of files) {
                    const filePath = path.join(logdir, file);
                    fs.rmSync(filePath);
                }
            }
        },
        1000
    );
});

describe("Logger", () => {

    describe("init()", () => {
        test("init() should throw an exception when the opts is not defined", () => {
            assert.throws(() => {
                logger.init();
            });
        });

        test("init() should throw an exception when the loglevel in opts is not defined", () => {
            assert.throws(() => {
                const opt = {};
                logger.init(opt);
            });
        });

        test("init() should throw an exception when the loglevel in opts is an invalid value", () => {
            assert.throws(() => {
                const opt = { loglevel: "nothing" };
                logger.init(opt);
            });
        });

        test("init() should throw an exception when the transport in opts is an invalid value", () => {
            assert.throws(() => {
                const opt = { loglevel: "debug" };
                logger.init(opt);
            });
        });

        test("init() should throw an exception when the logtail transport does not include a logtail_token variable", () => {
            assert.throws(() => {
                const opt = {
                    loglevel: "debug",
                    logtail: { a: "b" }
                };
                logger.init(opt);
            });
        });

        test("init() should execute when the log level is debug and the transport is console", () => {
            const opts = {
                loglevel: "debug",
                console: {}
            };
            logger.init(opts);
        });

        test("The log test.log must exist when the file.logfile parameter is defined", async () => {
            const logfile = "test.log";
            const opts = {
                loglevel: "debug",
                file: { logfile: logfile }
            };
            logger.init(opts);

            // Wait for the file to be created
            await new Promise((resolve) => setTimeout(resolve, 200));
            var wdir = process.cwd();
            var logdir = path.join(wdir, "logs");
            var logfile_path = path.join(logdir, logfile);
            var exist = fs.existsSync(logfile_path);
            assert.strictEqual(exist, true);
        });
    });

    describe("Logger level functions", () => {
        test("Function debug() should not throw exception", () => {
            var iserr = false;
            try {
                logger.debug("debug test");
            }
            catch (err) {
                iserr = true;
            }
            assert.equal(false, iserr);
        });

        test("Function info() should not throw exception", () => {
            var iserr = false;
            try {
                logger.info("info test");
            }
            catch (err) {
                iserr = true;
            }
            assert.equal(false, iserr);
        });

        test("Function warn() should not throw exception", () => {
            var iserr = false;
            try {
                logger.warn("warn test");
            }
            catch (err) {
                iserr = true;
            }
            assert.equal(false, iserr);
        });

        test("Function error() should not throw exception", () => {
            var iserr = false;
            try {
                logger.error("error test");
            }
            catch (err) {
                iserr = true;
            }
            assert.equal(false, iserr);
        });
    });

});