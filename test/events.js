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
const events = require("../index").events;
const EventEmitter = require('events');
const { describe, it, test } = require('node:test');

describe("Event handler", () => {
    describe("Event handler instance", () => {
        test("instance return an EventEmitter object", () => {
            assert.equal(true, events instanceof EventEmitter );
        });
    });

    describe("Event types", () => {
        test("event type ONAPPINIT exists", () => {
            assert.equal(true, (typeof events.ONAPPINIT === 'string' && events.ONAPPINIT.length > 0) );
        });

        test("event type ONAPPEVENT exists", () => {
            assert.equal(true, (typeof events.ONAPPEVENT === 'string' && events.ONAPPEVENT.length > 0));
        });

        test("event type ONAPPLOG exists", () => {
            assert.equal(true, (typeof events.ONAPPLOG === 'string' && events.ONAPPLOG.length > 0));
        });

        test("event type ONTASKINIT exists", () => {
            assert.equal(true, (typeof events.ONTASKINIT === 'string' && events.ONTASKINIT.length > 0));
        });

        test("event type ONIOTEVENT exists", () => {
            assert.equal(true, (typeof events.ONIOTEVENT === 'string' && events.ONIOTEVENT.length > 0));
        });

        test("event type ONBCEVENT exists", () => {
            assert.equal(true, (typeof events.ONBCEVENT === 'string' && events.ONBCEVENT.length > 0));
        });

        test("event type ONPEERMSG exists", () => {
            assert.equal(true, (typeof events.ONPEERMSG === 'string' && events.ONPEERMSG.length > 0));
        });

        test("event type ONBCEVENT exists", () => {
            assert.equal(true, (typeof events.ONBCEVENT === 'string' && events.ONBCEVENT.length > 0));
        });

        test("event type ONERROREVENT exists", () => {
            assert.equal(true, (typeof events.ONERROREVENT === 'string' && events.ONERROREVENT.length > 0));
        });
    });

    describe("Event functions", () => {
        test("appinit should return true", () => {
            let result = events.appinit();
            assert.strictEqual(result, true);
        });

        test("appevent should return true", () => {
            let result = events.appevent();
            assert.strictEqual(result, true);
        });

        test("register should throw exception with invalid event name", () => {
            assert.throws(() => {
                events.register("0");
            });
        });

        test("register should throw exception with invalid event callback", () => {
            assert.throws(() => {
                events.register(events.ONPEERMSG);
            });
        });

        test("register should return true", () => {
            let result = events.register(events.ONPEERMSG, function(payload){});
            assert.strictEqual(result, true);
        });

        test("taskinit should return true", () => {
            let result = events.taskinit();
            assert.strictEqual(result, true);
        });

        test("peermsg should return true", () => {
            let result = events.peermsg();
            assert.strictEqual(result, true);
        });

        test("iotmsg should return true", () => {
            let result = events.iotmsg();
            assert.strictEqual(result, true);
        });

        test("bcmsg should return true", () => {
            let result = events.bcmsg();
            assert.strictEqual(result, true);
        });

        test("errorevent should return true", () => {
            let result = events.errorevent();
            assert.strictEqual(result, true);
        });

        test("onappinit should call an event listener", async (t) => {
            await new Promise((resolve) => {
                events.register(
                    events.ONAPPINIT,
                    (result) => {
                        assert.strictEqual(result, true);
                        resolve();
                    }
                );
                events.appinit();
            });
        });

        test("onappevent should call an event listener and return the object that 'num' value is 1", async (t) => {
            let data = {num: 1};
            await new Promise((resolve) => {
                events.register(
                    events.ONAPPEVENT,
                    (result) => {
                        assert.strictEqual(result.num, 1);
                        resolve();
                    }
                );
                events.appevent(data);
            });
        });

        test("onpeermsg should call an event listener", async (t) => {
            let payload = "1";
            let request = "req";
            let response = "resp";
            let id = 1;
            let completefn = (id) =>{
                assert.equal(true, id === 1);
            };

            await new Promise((resolve) => {
                events.register(
                    events.ONPEERMSG,
                    (data, req, resp, msgid, compfn) => {
                        compfn(msgid);
                        assert.equal(true, (data === payload && request === req && resp === response && msgid === id));
                        resolve();
                    }
                );
                events.peermsg(payload, request, response, id, completefn);
            });
        });

        test("ontaskinit should call an event listener", async (t) => {
            let tsk = "T";
            let payload = "1";
            await new Promise((resolve) => {
                events.register(
                    events.ONTASKINIT,
                    (task, data) => {
                        assert.equal(true, (data === payload && task === tsk));
                        resolve();
                    }
                );
                events.taskinit(tsk, payload);
            });
        });

        test("oniotmsg should call an event listener", async (t) => {
            let payload = "P";
            let fn = function(){};
            await new Promise((resolve) => {
                events.register(
                    events.ONIOTEVENT,
                    (data, cb) => {
                        assert.equal(true, (data === payload && cb === fn));
                        resolve();
                    }
                );
                events.iotmsg(payload, fn);
            });
        });

        test("onbcmsg should call an event listener", async (t) => {
            let payload = "BC";
            let fn = function(){};
            await new Promise((resolve) => {
                events.register(
                    events.ONBCEVENT,
                    (data, cb) => {
                        assert.equal(true, (data === payload && cb === fn));
                        resolve();
                    }
                );
                events.bcmsg(payload, fn);
            });
        });

        test("errorevent should call an event listener", async (t) => {
            let err = new Error("test error");
            let payload = {data: 1};
            await new Promise((resolve) => {
                events.register(
                    events.ONERROREVENT,
                    (e, p) => {
                        assert.equal(true, (e.message === "test error" && p.data === 1));
                        resolve();
                    }
                );
                events.errorevent(err, payload);
            });
        });

    });
});