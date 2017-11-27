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

const EventEmitter = require('events');

let singleton = Symbol();
let singletonEnforcer = Symbol()

class EventHandler extends EventEmitter {
    constructor(enforcer) {
        if (enforcer != singletonEnforcer) {
            throw "Cannot construct singleton";
        }

        // call the events constructor
        super();

        this.ONAPPINIT = "app-init";
        this.APPLOG = "app-log";
        this.ONTASK = "task-init";
        this.ONIOTEVENT = "on-iotevent";
        this.ONBCEVENT = "on-bcevent";
        this.ONERROREVENT = "on-errorevent";
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new EventHandler(singletonEnforcer);
        }
        return this[singleton];
    }

    appinit() {
        this.emit(this.ONAPPINIT);
        return true;
    }

    taskinit(task, payload) {
        this.emit(this.ONTASK, task, payload);
        return true;
    }
}

module.exports = EventHandler.instance;



