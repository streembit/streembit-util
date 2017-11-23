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
const expect = require("chai").expect;
const path = require('path');
const fs = require('fs');
const logger = require("../index").logger;

describe("Logger", function () {

    describe("init()", function () {
        it("init() should execute", function () {
            logger.init();
        });

        it("Log file 'streembit.log' should exists after init", function () {   
            setTimeout(
                () => {
                    var wdir = process.cwd();
                    var logdir = path.join(wdir, "logs");
                    var logfile = path.join(logdir, 'streembit.log');
                    var exist = fs.existsSync(logfile);
                    expect(exist).to.equal(true);
                },
                500
            );
        });
    });

    describe("Functions", function () {
        it("function debug() should not throw exception", function () {     
            var iserr = false;
            try {
                logger.debug("debug test");
            }
            catch (err) {
                iserr = true;
            }
            assert.equal(false, iserr);
        });

        it("function info() should not throw exception", function () {
            var iserr = false;
            try {
                logger.info("info test");
            }
            catch (err) {
                iserr = true;
            }
            assert.equal(false, iserr);
        });

        it("function warn() should not throw exception", function () {
            var iserr = false;
            try {
                logger.warn("warn test");
            }
            catch (err) {
                iserr = true;
            }
            assert.equal(false, iserr);
        });

        it("function error() should not throw exception", function () {
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