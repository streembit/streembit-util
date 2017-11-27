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
const events = require("../index").events;
const EventEmitter = require('events');

describe("Event handler", function () {
    describe("Event handler instance", function () {
        it("instance return an EventEmitter object", function () {
            assert.equal(true, events instanceof EventEmitter );
        });
    });

    describe("Event types", function () {
        it("event type ONAPPINIT exists", function () {
            assert.equal(true, (typeof events.ONAPPINIT == 'string' && events.ONAPPINIT.length > 0) );
        });

        it("event type APPLOG exists", function () {
            assert.equal(true, (typeof events.APPLOG == 'string' && events.APPLOG.length > 0));
        });

        it("event type ONTASK exists", function () {
            assert.equal(true, (typeof events.ONTASK == 'string' && events.ONTASK.length > 0));
        });

        it("event type ONIOTEVENT exists", function () {
            assert.equal(true, (typeof events.ONIOTEVENT == 'string' && events.ONIOTEVENT.length > 0));
        });

        it("event type ONBCEVENT exists", function () {
            assert.equal(true, (typeof events.ONBCEVENT == 'string' && events.ONBCEVENT.length > 0));
        });

    });

    describe("Event functions", function () {
        it("appinit should return true", function () {
            let result = events.appinit();
            expect(result).to.equal(true);
        });

        it("taskinit should return true", function () {
            let result = events.taskinit();
            expect(result).to.equal(true);
        });
    });
});