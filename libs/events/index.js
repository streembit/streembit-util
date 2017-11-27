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

        this.ONAPPINIT = "on-app-init";
        this.ONAPPLOG = "on-app-log";
        this.ONTASK = "on-task-init";
        this.ONIOTEVENT = "on-iotevent";
        this.ONPEERREQUEST = "on-peer-reqest"; 
        this.ONBCEVENT = "on-bcevent";
        this.ONERROREVENT = "on-errorevent";

        this.clients = new Map();
        this.clients.set(this.ONPEERREQUEST, []);
        this.clients.set(this.ONTASK, []);

        this.onpeerreq();
        this.ontask();
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new EventHandler(singletonEnforcer);
        }
        return this[singleton];
    }

    register(event, callback){
        if(!event ){
            throw new Error("Error in registering event client, event name is required");
        }
        var list_of_callbacks = this.clients.get(event);
        if(!list_of_callbacks ){
            throw new Error("Error in registering event client, invalid event name");
        }
        if(!callback || typeof callback != "function" ){
            throw new Error("Error in registering event client, invalid callback");
        }
        list_of_callbacks.push(callback);
        return true;
    }

    appinit() {
        this.emit(this.ONAPPINIT);
        return true;
    }

    peerrequest(payload){
        this.emit(this.ONPEERREQUEST, payload);
        return true;
    }

    taskinit(task, payload) {
        this.emit(this.ONTASK, task, payload);
        return true;
    }

    onpeerreq(callback){
        this.on(this.ONPEERREQUEST, (payload) => {
            let callbacks = this.clients.get(this.ONPEERREQUEST);            
            callbacks.forEach(
                (callback)=>{
                    callback(payload);
                }                
            );            
        });
    }

    ontask(callback){
        this.on(this.ONTASK, (task, payload) => {
            let callbacks = this.clients.get(this.ONTASK);            
            callbacks.forEach(
                (callback)=>{
                    callback(task, payload);
                }                
            );
        });
    }
}

module.exports = EventHandler.instance;



